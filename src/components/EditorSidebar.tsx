import { useState, useMemo, type ChangeEvent } from 'react';
import { Plus, Edit2, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { EpisodeEditor } from './EpisodeEditor';
import { useProjectStore } from '../store/useProjectStore';
import { fieldLimits, resourceLimits } from '../domain/constraints';
import { useTranslation } from '../i18n';
import { calculateProjectCompletion } from '../domain/completion';

interface Props {
  activeSeasonId: string;
  setActiveSeasonId: (id: string) => void;
  store: ReturnType<typeof useProjectStore>;
}

export function EditorSidebar({ activeSeasonId, setActiveSeasonId, store }: Props) {
  const { data, updateData, addEpisode, updateEpisode, removeEpisode, moveEpisode, updateSeason, removeSeason } = store;
  const [editorStep, setEditorStep] = useState<1 | 2 | 3>(1);
  const { t, locale } = useTranslation();

  const activeSeason = data.seasons.find(s => s.id === activeSeasonId) || data.seasons[0];
  const calculatedCompletion = useMemo(() => calculateProjectCompletion(data), [data]);
  const hasCustomCompletion = typeof data.completionOverride === 'number';
  const alertText = {
    unsupportedImage: locale === 'de' ? 'Bitte wähle ein PNG-, JPG- oder WebP-Bild.' : 'Choose a PNG, JPG, or WebP image.',
    imageReadFailed: locale === 'de' ? 'Das Bild konnte nicht gelesen werden.' : 'The image could not be read.',
    imageProcessFailed: locale === 'de' ? 'Das Bild konnte nicht verarbeitet werden.' : 'The image could not be processed.',
  };

  const handleCoverUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const resetInput = () => {
      event.target.value = '';
    };

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      alert(alertText.unsupportedImage);
      resetInput();
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        alert(alertText.imageReadFailed);
        resetInput();
        return;
      }

      const image = new Image();
      image.onload = () => {

        const canvas = document.createElement('canvas');
        let width = image.width;
        let height = image.height;

        if (width > resourceLimits.coverOutputWidth) {
          height = Math.round((height * resourceLimits.coverOutputWidth) / width);
          width = resourceLimits.coverOutputWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) {
          alert(alertText.imageProcessFailed);
          resetInput();
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        updateData({ coverUrl: canvas.toDataURL('image/jpeg', 0.78) });
        resetInput();
      };
      image.onerror = () => {
        alert(alertText.imageProcessFailed);
        resetInput();
      };
      image.src = reader.result;
    };
    reader.onerror = () => {
      alert(alertText.imageReadFailed);
      resetInput();
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className="editor-sidebar" style={{ padding: '2rem' }}>
      <h2>{t.editorTitle}</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
        {t.editorDesc}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {[1, 2, 3].map(step => (
          <div key={step} style={{ flex: 1, height: '4px', backgroundColor: editorStep >= step ? '#f97316' : 'var(--border-color)', borderRadius: '2px', transition: 'background-color 0.3s' }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button type="button" onClick={() => setEditorStep(1)} className={`ui-button editor-step-button${editorStep === 1 ? ' is-active' : ''}`}>{t.stepInfo}</button>
        <button type="button" onClick={() => setEditorStep(2)} className={`ui-button editor-step-button${editorStep === 2 ? ' is-active' : ''}`}>{t.stepEpisodes}</button>
        <button type="button" onClick={() => setEditorStep(3)} className={`ui-button editor-step-button${editorStep === 3 ? ' is-active' : ''}`}>{t.stepDetails}</button>
      </div>

      {editorStep === 1 && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblPreviewBrand}</label>
            <input 
              type="text" 
              value={data.previewBrand || ''} 
              onChange={(e) => updateData({ previewBrand: e.target.value })}
              maxLength={fieldLimits.previewBrand}
              placeholder="SeriesCreator"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblPreviewCategory}</label>
            <input 
              type="text" 
              value={data.previewCategory || ''} 
              onChange={(e) => updateData({ previewCategory: e.target.value })}
              maxLength={40}
              placeholder="z.B. Klassenprojekte"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
            />
          </div>
        </div>

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
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblCoverArt}</label>
          <div className="cover-art-field">
            <div className="cover-art-field__actions">
              <label className="ui-button cover-art-field__upload">
                <ImageIcon size={16} />
                <span>{t.btnChooseCover}</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleCoverUpload} />
              </label>
              {data.coverUrl && (
                <button
                  type="button"
                  className="ui-button ui-button--danger"
                  onClick={() => updateData({ coverUrl: undefined })}
                >
                  <X size={16} />
                  <span>{t.btnRemoveCover}</span>
                </button>
              )}
            </div>
            <div className="cover-art-field__preview">
              {data.coverUrl ? (
                <img src={data.coverUrl} alt={t.lblCoverArt} />
              ) : (
                <div className="cover-art-field__placeholder">
                  <ImageIcon size={22} />
                  <span>{t.noCover}</span>
                </div>
              )}
            </div>
          </div>
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

        <div style={{ maxWidth: '18rem' }}>
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

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblCompletion}</label>
          <div className="completion-control">
            <div className="completion-control__auto" aria-live="polite">
              <span>{t.lblCompletionAuto}</span>
              <strong>{calculatedCompletion}%</strong>
            </div>
            <label className="completion-control__toggle">
              <input
                type="checkbox"
                checked={hasCustomCompletion}
                onChange={(e) => updateData({ completionOverride: e.target.checked ? calculatedCompletion : undefined })}
              />
              <span>{t.lblCompletionUseCustom}</span>
            </label>
            {hasCustomCompletion && (
              <label className="completion-control__custom">
                <span>{t.lblCompletionCustom}</span>
                <input 
                  type="number" 
                  value={data.completionOverride} 
                  onChange={(e) => updateData({ completionOverride: Math.max(0, Math.min(100, Number(e.target.value))) })}
                  min="0"
                  max="100"
                  aria-label={t.lblCompletionCustom}
                />
              </label>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblGenre}</label>
            {(() => {
              const predefinedGenres = [
                "Dokumentation", "Erklärvideo", "Kurzfilm", "Reportage", 
                "Nachrichten", "Interview", "Hörspiel", "Podcast", 
                "Animationsfilm", "Stop-Motion", "Tutorial",
                "Drama", "Komödie", "Bühnenstück", "Gedichtverfilmung"
              ];
              const isStandard = predefinedGenres.includes(data.genre);
              const showSelect = isStandard || data.genre === '';
              
              if (showSelect) {
                return (
                  <select 
                    value={data.genre || predefinedGenres[0]} 
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        updateData({ genre: ' ' }); // Trigger custom input mode
                      } else {
                        updateData({ genre: e.target.value });
                      }
                    }}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }}
                  >
                    {predefinedGenres.map(g => <option key={g} value={g}>{g}</option>)}
                    <option value="__custom__">Eigene Eingabe...</option>
                  </select>
                );
              }
              
              return (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={data.genre.trim()} 
                    onChange={(e) => updateData({ genre: e.target.value })}
                    maxLength={40}
                    placeholder="Eigenes Genre..."
                    style={{ flex: 1, padding: '0.6rem', border: '1px solid var(--border-color)', width: '100%' }}
                    autoFocus
                  />
                  <button 
                    type="button" 
                    className="ui-icon-button"
                    onClick={() => updateData({ genre: predefinedGenres[0] })}
                    title="Zurück zur Auswahl"
                    style={{ flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })()}
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
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>{t.lblCustomConceptTitle}</label>
          <input 
            type="text"
            value={data.customConceptTitle || ''} 
            onChange={(e) => updateData({ customConceptTitle: e.target.value })}
            maxLength={60}
            placeholder={locale === 'de' ? 'z.B. Didaktischer Kommentar' : 'e.g. Didactic Commentary'}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', marginBottom: '1rem' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblCustomConceptText}</label>
          <textarea 
            value={data.customConceptText || ''} 
            onChange={(e) => updateData({ customConceptText: e.target.value })}
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
              type="button"
              onClick={() => {
                const newSeasonId = crypto.randomUUID();
                updateData({
                  seasons: [
                    ...data.seasons,
                    { id: newSeasonId, title: `Staffel ${data.seasons.length + 1}`, episodes: [] }
                  ]
                });
                setActiveSeasonId(newSeasonId);
              }}
              className="ui-icon-button"
              title={t.addSeason}
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                const currentTitle = activeSeason?.title || '';
                const newTitle = window.prompt(t.promptRename, currentTitle);
                if (newTitle && newTitle.trim() !== "") {
                  updateSeason(activeSeasonId, newTitle.trim());
                }
              }}
              className="ui-icon-button"
              title={t.renameSeason}
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
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
              className="ui-icon-button ui-icon-button--danger"
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
          type="button"
          onClick={() => activeSeason && addEpisode(activeSeason.id)}
          disabled={!activeSeason}
          className="ui-button ui-button--full ui-button--dashed"
        >
          <Plus size={16} /> {t.addEpisode}
        </button>
      </div>
      )}
    </aside>
  );
}
