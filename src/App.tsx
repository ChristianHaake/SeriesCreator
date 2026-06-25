import { useState, useEffect } from 'react';
import { useProjectStore } from './store/useProjectStore';
import { Play, Plus, Download, Edit2, Trash2 } from 'lucide-react';
import { EpisodeEditor } from './components/EpisodeEditor';
import { EpisodeGrid } from './components/EpisodeGrid';
import { PresentationMode } from './components/PresentationMode';
import { PrintLayout } from './components/PrintLayout';

import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { translations, type Language } from './translations';
import './index.css';

function ContentPage({ title }: { title: string }) {
  return (
    <div style={{ flex: 1, padding: '4rem', maxWidth: '800px', margin: '0 auto', color: 'var(--color-text)', overflowY: 'auto', width: '100%' }}>
      <a href="#" style={{ color: '#E50914', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block', fontWeight: 'bold' }}>← Zurück zur App</a>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>{title}</h1>
      <p style={{ lineHeight: 1.6, fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
        Hier entsteht in Kürze die inhaltliche Dokumentation. Laut Standard wird dieser Text später dynamisch aus einer Markdown-Datei geladen.
      </p>
    </div>
  );
}

function App() {
  const { data, updateData, addEpisode, updateEpisode, removeEpisode, moveEpisode, resetData, updateSeason, removeSeason } = useProjectStore();
  const [activeSeasonId, setActiveSeasonId] = useState(data.seasons[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'EPISODEN' | 'DETAILS' | 'QUELLEN'>('EPISODEN');
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [editorStep, setEditorStep] = useState<1 | 2 | 3>(1);
  const [lang, setLang] = useState<Language>('de');
  const t = translations[lang];

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  const activeSeason = data.seasons.find(s => s.id === activeSeasonId) || data.seasons[0];

  const handleExport = () => {
    window.print();
  };

  if (showPresentation) {
    return <PresentationMode data={data} onClose={() => setShowPresentation(false)} />;
  }

  if (currentHash === '#/hilfe') return <div className="app-shell"><AppHeader lang={lang} setLang={setLang} /><ContentPage title="Hilfe" /><AppFooter lang={lang} /></div>;
  if (currentHash === '#/ueber') return <div className="app-shell"><AppHeader lang={lang} setLang={setLang} /><ContentPage title="Über das Projekt" /><AppFooter lang={lang} /></div>;
  if (currentHash === '#/lehrkraefte') return <div className="app-shell"><AppHeader lang={lang} setLang={setLang} /><ContentPage title="Für Lehrkräfte" /><AppFooter lang={lang} /></div>;
  if (currentHash === '#/datenschutz') return <div className="app-shell"><AppHeader lang={lang} setLang={setLang} /><ContentPage title="Datenschutzerklärung" /><AppFooter lang={lang} /></div>;
  if (currentHash === '#/impressum') return <div className="app-shell"><AppHeader lang={lang} setLang={setLang} /><ContentPage title="Impressum" /><AppFooter lang={lang} /></div>;

  return (
    <div className="app-shell">
      <AppHeader 
        lang={lang}
        setLang={setLang}
        onExport={() => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${data.title || 'SeriesCreator_Projekt'}.json`;
          a.click();
          URL.revokeObjectURL(url);
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
      <aside className="editor-sidebar" style={{ padding: '2rem' }}>
        <h2>{t.editorTitle}</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
          {t.editorDesc}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {[1, 2, 3].map(step => (
            <div key={step} style={{ flex: 1, height: '4px', backgroundColor: editorStep >= step ? '#E50914' : 'var(--border-color)', borderRadius: '2px', transition: 'background-color 0.3s' }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <button onClick={() => setEditorStep(1)} style={{ flex: 1, padding: '0.5rem', background: editorStep === 1 ? 'var(--color-bg-surface)' : 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', color: editorStep === 1 ? 'white' : 'var(--color-text-muted)', cursor: 'pointer', fontWeight: editorStep === 1 ? 'bold' : 'normal' }}>{t.stepInfo}</button>
          <button onClick={() => setEditorStep(2)} style={{ flex: 1, padding: '0.5rem', background: editorStep === 2 ? 'var(--color-bg-surface)' : 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', color: editorStep === 2 ? 'white' : 'var(--color-text-muted)', cursor: 'pointer', fontWeight: editorStep === 2 ? 'bold' : 'normal' }}>{t.stepEpisodes}</button>
          <button onClick={() => setEditorStep(3)} style={{ flex: 1, padding: '0.5rem', background: editorStep === 3 ? 'var(--color-bg-surface)' : 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', color: editorStep === 3 ? 'white' : 'var(--color-text-muted)', cursor: 'pointer', fontWeight: editorStep === 3 ? 'bold' : 'normal' }}>{t.stepDetails}</button>
        </div>

        {editorStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblTitle}</label>
            <input 
              type="text" 
              value={data.title} 
              onChange={(e) => updateData({ title: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblDesc}</label>
            <textarea 
              value={data.description} 
              onChange={(e) => updateData({ description: e.target.value })}
              rows={4}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblAge}</label>
              <select 
                value={data.ageRating} 
                onChange={(e) => updateData({ ageRating: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }}
              >
                <option value="ab 0">ab 0</option>
                <option value="ab 6">ab 6</option>
                <option value="ab 12">ab 12</option>
                <option value="ab 16">ab 16</option>
                <option value="ab 18">ab 18</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblMatch}</label>
              <input 
                type="number" 
                value={data.matchPercentage} 
                onChange={(e) => updateData({ matchPercentage: Math.max(0, Math.min(100, Number(e.target.value))) })}
                min="0"
                max="100"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblGenre}</label>
              <select 
                value={data.genre} 
                onChange={(e) => updateData({ genre: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }}
              >
                <option value="Placeholder 1">Placeholder 1</option>
                <option value="Placeholder 2">Placeholder 2</option>
                <option value="Placeholder 3">Placeholder 3</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblCast}</label>
              <input 
                type="text" 
                value={data.cast} 
                onChange={(e) => updateData({ cast: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

        </div>
        )}

        {editorStep === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblReflection}</label>
            <textarea 
              value={data.reflection || ''} 
              onChange={(e) => updateData({ reflection: e.target.value })}
              rows={5}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>{t.lblSources}</label>
            <textarea 
              value={data.sources || ''} 
              onChange={(e) => updateData({ sources: e.target.value })}
              rows={5}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
            />
          </div>
        </div>
        )}

        {editorStep === 2 && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>{t.episodesTitle}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select 
                value={activeSeasonId} 
                onChange={(e) => setActiveSeasonId(e.target.value)}
                style={{ padding: '0.4rem', border: '1px solid var(--border-color)' }}
              >
                {data.seasons.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  const newSeasonId = `s${data.seasons.length + 1}`;
                  updateData({
                    seasons: [
                      ...data.seasons,
                      { id: newSeasonId, title: `Staffel ${data.seasons.length + 1}`, episodes: [] }
                    ]
                  });
                  setActiveSeasonId(newSeasonId);
                }}
                style={{ padding: '0.4rem', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}
                title={t.addSeason}
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => {
                  const currentTitle = activeSeason?.title || '';
                  const newTitle = window.prompt(t.promptRename, currentTitle);
                  if (newTitle && newTitle.trim() !== "") {
                    updateSeason(activeSeasonId, newTitle.trim());
                  }
                }}
                style={{ padding: '0.4rem', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-primary)' }}
                title={t.renameSeason}
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => {
                  if (activeSeason?.episodes.length > 0) {
                    alert(t.errorDeleteSeason);
                    return;
                  }
                  if (window.confirm(t.confirmDeleteSeason)) {
                    removeSeason(activeSeasonId);
                    setActiveSeasonId(data.seasons.find(s => s.id !== activeSeasonId)?.id || '');
                  }
                }}
                style={{ padding: '0.4rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', color: '#ef4444' }}
                title={t.deleteSeason}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          {activeSeason?.episodes.map((ep, index) => (
            <EpisodeEditor 
              key={ep.id} 
              episode={ep} 
              seasonId={activeSeason.id} 
              index={index} 
              total={activeSeason.episodes.length}
              onUpdate={updateEpisode}
              onRemove={removeEpisode}
              onMove={moveEpisode}
            />
          ))}

          <button 
            onClick={() => addEpisode(activeSeason.id)}
            style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--color-bg-surface)', border: '1px dashed var(--color-border)', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background-color 0.2s', color: 'var(--color-text-primary)' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-workspace)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)'}
          >
            <Plus size={16} /> {t.addEpisode}
          </button>
        </div>
        )}
      </aside>

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
      <AppFooter lang={lang} />
    </div>
  );
}

export default App;
