import { useState, useEffect } from 'react';
import { useProjectStore } from './store/useProjectStore';
import { Play, Plus, Download } from 'lucide-react';
import { EpisodeEditor } from './components/EpisodeEditor';
import { EpisodeGrid } from './components/EpisodeGrid';
import { PresentationMode } from './components/PresentationMode';
import { PrintLayout } from './components/PrintLayout';

import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
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
  const { data, updateData, addEpisode, updateEpisode, removeEpisode, moveEpisode } = useProjectStore();
  const [activeSeasonId, setActiveSeasonId] = useState(data.seasons[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'EPISODEN' | 'DETAILS' | 'QUELLEN'>('EPISODEN');
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

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

  if (currentHash === '#/hilfe') return <div className="app-shell"><AppHeader /><ContentPage title="Hilfe" /><AppFooter /></div>;
  if (currentHash === '#/ueber') return <div className="app-shell"><AppHeader /><ContentPage title="Über das Projekt" /><AppFooter /></div>;
  if (currentHash === '#/lehrkraefte') return <div className="app-shell"><AppHeader /><ContentPage title="Für Lehrkräfte" /><AppFooter /></div>;
  if (currentHash === '#/datenschutz') return <div className="app-shell"><AppHeader /><ContentPage title="Datenschutzerklärung" /><AppFooter /></div>;
  if (currentHash === '#/impressum') return <div className="app-shell"><AppHeader /><ContentPage title="Impressum" /><AppFooter /></div>;

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
        }}
        onImport={(importedData) => updateData(importedData)}
      />
      <div className="app-main-content">
        {/* Hidden layout purely used for the high-res PDF snapshot */}
        <PrintLayout data={data} />

      {/* Sidebar Editor */}
      <aside className="editor-sidebar" style={{ padding: '2rem' }}>
        <h2>SeriesCreator Editor</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
          Bearbeite die Metadaten deiner Serie.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Serientitel</label>
            <input 
              type="text" 
              value={data.title} 
              onChange={(e) => updateData({ title: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Beschreibung</label>
            <textarea 
              value={data.description} 
              onChange={(e) => updateData({ description: e.target.value })}
              rows={4}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Klassenstufe</label>
              <input 
                type="text" 
                value={data.ageRating} 
                onChange={(e) => updateData({ ageRating: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Match %</label>
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
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Genre</label>
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
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Cast (Mitwirkende)</label>
              <input 
                type="text" 
                value={data.cast} 
                onChange={(e) => updateData({ cast: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>Lernziele & Reflexion (Hintergrund)</label>
            <textarea 
              value={data.reflection || ''} 
              onChange={(e) => updateData({ reflection: e.target.value })}
              rows={3}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>Quellenverzeichnis</label>
            <textarea 
              value={data.sources || ''} 
              onChange={(e) => updateData({ sources: e.target.value })}
              rows={3}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Episoden</h3>
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
                title="Staffel hinzufügen"
              >
                <Plus size={16} />
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
            <Plus size={16} /> Episode hinzufügen
          </button>
        </div>
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
            Als PDF speichern
          </button>
        </header>

        <section className="streaming-hero" style={{ backgroundImage: data.coverUrl ? `url(${data.coverUrl})` : 'none', backgroundColor: data.coverUrl ? 'transparent' : '#222' }}>
          <div className="streaming-hero-content">
            <h1 className="streaming-title">{data.title || "Titel der Serie"}</h1>
            
            <div className="streaming-meta">
              <span className="match-score">{data.matchPercentage}% Match</span>
              <span>{new Date().getFullYear()}</span>
              <span className="age-rating">{data.ageRating || "Klasse"}</span>
              <span>{data.seasons.length} {data.seasons.length === 1 ? 'Staffel' : 'Staffeln'}</span>
            </div>

            <p className="streaming-desc">
              {data.description || "Füge eine spannende Beschreibung hinzu..."}
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <button className="btn-play" onClick={() => setShowPresentation(true)}>
                <Play fill="black" size={24} /> Präsentieren
              </button>
              <button className="btn-secondary">
                <Plus size={24} /> Meine Liste
              </button>
            </div>

            <div style={{ fontSize: '1rem', color: 'var(--color-text-dark-secondary)', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              <p><span style={{ color: 'white' }}>Mitwirkende:</span> {data.cast}</p>
              <p><span style={{ color: 'white' }}>Genre:</span> {data.genre}</p>
            </div>
          </div>
        </section>

        <section style={{ padding: '0 3rem 3rem 3rem' }}>
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', paddingBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span 
              onClick={() => setActiveTab('EPISODEN')}
              style={{ cursor: 'pointer', borderTop: activeTab === 'EPISODEN' ? '4px solid #E50914' : '4px solid transparent', paddingTop: '1rem', marginTop: '-1rem', color: activeTab === 'EPISODEN' ? 'white' : 'var(--color-text-dark-secondary)' }}
            >
              EPISODEN
            </span>
            <span 
              onClick={() => setActiveTab('DETAILS')}
              style={{ cursor: 'pointer', borderTop: activeTab === 'DETAILS' ? '4px solid #E50914' : '4px solid transparent', paddingTop: '1rem', marginTop: '-1rem', color: activeTab === 'DETAILS' ? 'white' : 'var(--color-text-dark-secondary)' }}
            >
              HINTERGRUND
            </span>
            <span 
              onClick={() => setActiveTab('QUELLEN')}
              style={{ cursor: 'pointer', borderTop: activeTab === 'QUELLEN' ? '4px solid #E50914' : '4px solid transparent', paddingTop: '1rem', marginTop: '-1rem', color: activeTab === 'QUELLEN' ? 'white' : 'var(--color-text-dark-secondary)' }}
            >
              QUELLEN
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
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{data.reflection || "Noch keine Lernziele oder Reflexionen eingetragen."}</p>
            </div>
          )}

          {activeTab === 'QUELLEN' && (
            <div style={{ color: 'var(--color-text-dark-secondary)' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Quellenverzeichnis</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{data.sources || "Noch keine Quellen eingetragen."}</p>
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
