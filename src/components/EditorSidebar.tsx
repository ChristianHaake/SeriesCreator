import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { EpisodeEditor } from './EpisodeEditor';
import { useProjectStore } from '../store/useProjectStore';
import { fieldLimits } from '../domain/constraints';
import { useTranslation } from '../i18n';

interface Props {
  activeSeasonId: string;
  setActiveSeasonId: (id: string) => void;
}

export function EditorSidebar({ activeSeasonId, setActiveSeasonId }: Props) {
  const { data, updateData, addEpisode, updateEpisode, removeEpisode, moveEpisode, updateSeason, removeSeason } = useProjectStore();
  const [editorStep, setEditorStep] = useState<1 | 2 | 3>(1);
  const { t } = useTranslation();

  const activeSeason = data.seasons.find(s => s.id === activeSeasonId) || data.seasons[0];

  return (
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
            maxLength={fieldLimits.title}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblDesc}</label>
          <textarea 
            value={data.description} 
            onChange={(e) => updateData({ description: e.target.value })}
            rows={4}
            maxLength={fieldLimits.description}
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
              maxLength={fieldLimits.cast}
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
            maxLength={fieldLimits.reflection}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>{t.lblSources}</label>
          <textarea 
            value={data.sources || ''} 
            onChange={(e) => updateData({ sources: e.target.value })}
            rows={5}
            maxLength={fieldLimits.sources}
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
  );
}
