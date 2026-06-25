import { useState, useEffect } from 'react';
import { useProjectStore } from './store/useProjectStore';
import { Play, Plus, Download } from 'lucide-react';
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
import './index.css';

function ContentPage({ pathname }: { pathname: ContentPath }) {
  const { locale } = useTranslation();
  const page = contentPages[locale][pathname];
  
  return (
    <div style={{ flex: 1, padding: '4rem', maxWidth: '800px', margin: '0 auto', color: 'var(--color-text)', overflowY: 'auto', width: '100%' }}>
      <a href="/" style={{ color: '#E50914', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block', fontWeight: 'bold' }}>← Zurück zur App</a>
      <div className="markdown-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
      </div>
    </div>
  );
}

function App() {
  const store = useProjectStore();
  const { data, updateData, resetData } = store;
  const [activeSeasonId, setActiveSeasonId] = useState(data.seasons[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'EPISODEN' | 'DETAILS' | 'QUELLEN'>('EPISODEN');
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
      <div className="app-shell">
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
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${data.title || 'SeriesCreator_Projekt'}.json`;
          a.click();
          URL.revokeObjectURL(url);
          alert(locale === 'de' ? 'Das Projekt wurde erfolgreich heruntergeladen.' : 'The project was successfully downloaded.');
        }}
        onImport={(importedData) => updateData(importedData)}
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
        <header style={{ display: 'flex', padding: '1.5rem 3rem', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
          <div style={{ color: '#E50914', fontSize: '1.5rem', fontWeight: 'bold', marginRight: '2rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>haak3 STREAM</div>
          <nav style={{ display: 'flex', gap: '1.5rem', fontWeight: 500, textShadow: '1px 1px 2px rgba(0,0,0,0.8)', flex: 1 }}>
            <span>Startseite</span>
            <span style={{ fontWeight: 'bold' }}>Serien</span>
            <span>Klassenprojekte</span>
          </nav>
          <button 
            onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', cursor: 'pointer' }}
          >
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

            <div style={{ marginBottom: '2rem' }}>
              <button className="btn-play" onClick={() => setShowPresentation(true)}>
                <Play fill="black" size={24} /> {t.btnPlay}
              </button>
              <button className="btn-secondary">
                <Plus size={24} /> {t.myList}
              </button>
            </div>

            <div style={{ fontSize: '1rem', color: 'var(--color-text-dark-secondary)', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              <p><span style={{ color: 'white' }}>{t.castPrefix}</span> {data.cast}</p>
              <p><span style={{ color: 'white' }}>{t.genrePrefix}</span> {data.genre}</p>
            </div>
          </div>
        </section>

        <section style={{ padding: '0 3rem 3rem 3rem' }}>
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', paddingBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span 
              onClick={() => setActiveTab('EPISODEN')}
              style={{ cursor: 'pointer', borderTop: activeTab === 'EPISODEN' ? '4px solid #E50914' : '4px solid transparent', paddingTop: '1rem', marginTop: '-1rem', color: activeTab === 'EPISODEN' ? 'white' : 'var(--color-text-dark-secondary)' }}
            >
              {t.tabEpisodes}
            </span>
            <span 
              onClick={() => setActiveTab('DETAILS')}
              style={{ cursor: 'pointer', borderTop: activeTab === 'DETAILS' ? '4px solid #E50914' : '4px solid transparent', paddingTop: '1rem', marginTop: '-1rem', color: activeTab === 'DETAILS' ? 'white' : 'var(--color-text-dark-secondary)' }}
            >
              {t.tabBackground}
            </span>
            <span 
              onClick={() => setActiveTab('QUELLEN')}
              style={{ cursor: 'pointer', borderTop: activeTab === 'QUELLEN' ? '4px solid #E50914' : '4px solid transparent', paddingTop: '1rem', marginTop: '-1rem', color: activeTab === 'QUELLEN' ? 'white' : 'var(--color-text-dark-secondary)' }}
            >
              {t.tabSources}
            </span>
          </div>

          {activeTab === 'EPISODEN' && (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <select 
                  value={activeSeasonId}
                  onChange={(e) => setActiveSeasonId(e.target.value)}
                  style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px' }}
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
            <div style={{ color: 'var(--color-text-dark-secondary)' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Lernziele & Reflexion</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{data.reflection || t.noReflection}</p>
            </div>
          )}

          {activeTab === 'QUELLEN' && (
            <div style={{ color: 'var(--color-text-dark-secondary)' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Quellenverzeichnis</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{data.sources || t.noSources}</p>
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
