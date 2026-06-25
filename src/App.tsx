import { useState, useEffect } from 'react';
import { useProjectStore } from './store/useProjectStore';
import { Play, Download } from 'lucide-react';
import { EditorSidebar } from './components/EditorSidebar';
import { EpisodeGrid } from './components/EpisodeGrid';
import { PresentationMode } from './components/PresentationMode';
import { PrintLayout } from './components/PrintLayout';

import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { useTranslation } from './i18n';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { contentPages, type ContentPath, isContentPath } from './content';
import {
  makeProjectFilename,
  PROJECT_FILE_MIME_TYPE,
  serializeProject,
} from './domain/projectCodec';
import './index.css';

function ContentPage({ pathname }: { pathname: ContentPath }) {
  const { locale } = useTranslation();
  const page = contentPages[locale][pathname];
  
  return (
    <main className="content-page">
      <a href="/" className="content-page__back">← Zurück zur App</a>
      <div className="markdown-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
      </div>
    </main>
  );
}

type PreviewTab = 'EPISODEN' | 'DETAILS' | 'QUELLEN';

function App() {
  const store = useProjectStore();
  const { data, replaceData, resetData } = store;
  const [activeSeasonId, setActiveSeasonId] = useState(data.seasons[0]?.id || '');
  const [activeTab, setActiveTab] = useState<PreviewTab>('EPISODEN');
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname.replace(/\/+$/, "") || "/");
  const { t, locale } = useTranslation();

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname.replace(/\/+$/, "") || "/");
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  const activeSeason = data.seasons.find(s => s.id === activeSeasonId) || data.seasons[0];

  const handleExport = () => {
    window.print();
  };

  if (showPresentation) {
    return <PresentationMode data={data} onClose={() => setShowPresentation(false)} />;
  }

  if (isContentPath(currentPath)) {
    return (
      <div className="app-shell app-shell--content-route">
        <AppHeader />
        <ContentPage pathname={currentPath} />
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppHeader 
        onExport={() => {
          const blob = new Blob([serializeProject(data)], {
            type: PROJECT_FILE_MIME_TYPE,
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = makeProjectFilename(data.title);
          a.click();
          URL.revokeObjectURL(url);
          alert(locale === 'de' ? 'Das Projekt wurde erfolgreich heruntergeladen.' : 'The project was successfully downloaded.');
        }}
        onImport={(importedData) => {
          replaceData(importedData);
          setActiveSeasonId(importedData.seasons[0]?.id || '');
        }}
        onReset={() => {
          if (window.confirm(t.confirmReset)) {
            resetData();
          }
        }}
      />
      <div className="app-main-content">
        {/* Hidden layout purely used for the high-res PDF snapshot */}
        <PrintLayout data={data} />

      {/* Sidebar Editor */}
      <EditorSidebar 
        activeSeasonId={activeSeasonId} 
        setActiveSeasonId={setActiveSeasonId} 
        store={store}
      />

      {/* Main Preview (Streaming Look) */}
      <main className="preview-main theme-streaming">
        <header className="preview-header">
          <div className="preview-header__brand">haak3 STREAM</div>
          <nav className="preview-header__nav">
            <span>Startseite</span>
            <strong>Serien</strong>
            <span>Klassenprojekte</span>
          </nav>
          <button className="preview-header__print" onClick={handleExport}>
            <Download size={16} />
            {t.btnPdf}
          </button>
        </header>

        <section className="streaming-hero" style={{ backgroundImage: data.coverUrl ? `url(${data.coverUrl})` : 'none', backgroundColor: data.coverUrl ? 'transparent' : '#222' }}>
          <div className="streaming-hero-content">
            <h1 className="streaming-title">{data.title || "Titel der Serie"}</h1>
            
            <div className="streaming-meta">
              <span className="match-score">{data.matchPercentage}% Match</span>
              <span>{new Date().getFullYear()}</span>
              <span className="age-rating">{data.ageRating || "Klasse"}</span>
              <span>{data.seasons.length} {t.season}{data.seasons.length === 1 ? '' : 'n'}</span>
            </div>

            <p className="streaming-desc">
              {data.description || "Füge eine spannende Beschreibung hinzu..."}
            </p>

            <div className="streaming-actions">
              <button className="btn-play" onClick={() => setShowPresentation(true)}>
                <Play fill="black" size={24} /> {t.btnPlay}
              </button>
            </div>

            <div className="streaming-facts">
              <p><span>{t.castPrefix}</span> {data.cast}</p>
              <p><span>{t.genrePrefix}</span> {data.genre}</p>
            </div>
          </div>
        </section>

        <section className="preview-section">
          <div className="preview-tabs" role="tablist" aria-label="Serienbereich">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'EPISODEN'}
              onClick={() => setActiveTab('EPISODEN')}
            >
              {t.tabEpisodes}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'DETAILS'}
              onClick={() => setActiveTab('DETAILS')}
            >
              {t.tabBackground}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'QUELLEN'}
              onClick={() => setActiveTab('QUELLEN')}
            >
              {t.tabSources}
            </button>
          </div>

          {activeTab === 'EPISODEN' && (
            <>
              <div className="season-selector">
                <select 
                  value={activeSeasonId}
                  onChange={(e) => setActiveSeasonId(e.target.value)}
                >
                  {data.seasons.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              {activeSeason && <EpisodeGrid episodes={activeSeason.episodes} />}
            </>
          )}

          {activeTab === 'DETAILS' && (
            <div className="preview-text-panel">
              <h3>Lernziele & Reflexion</h3>
              <p>{data.reflection || t.noReflection}</p>
            </div>
          )}

          {activeTab === 'QUELLEN' && (
            <div className="preview-text-panel">
              <h3>Quellenverzeichnis</h3>
              <p>{data.sources || t.noSources}</p>
            </div>
          )}
        </section>
        </main>
      </div>
      <AppFooter />
    </div>
  );
}

export default App;
