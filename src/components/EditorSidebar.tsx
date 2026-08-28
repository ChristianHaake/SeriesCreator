import { useRef, useState, useMemo, type ChangeEvent } from 'react';
import { Plus, Edit2, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { EpisodeRow } from './EpisodeRow';
import { EpisodeDialog } from './EpisodeDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { useProjectStore } from '../store/useProjectStore';
import { fieldLimits, resourceLimits } from '../domain/constraints';
import { useTranslation } from '../i18n';
import { calculateProjectCompletion } from '../domain/completion';

interface Props {
  activeSeasonId: string;
  setActiveSeasonId: (id: string) => void;
  store: ReturnType<typeof useProjectStore>;
}

// Localized preset genres. A genre stored in the other language falls through to
// the free-text input, so switching locale never silently mismatches the select.
const GENRE_OPTIONS: Record<'de' | 'en', string[]> = {
  de: [
    'Dokumentation', 'Erklärvideo', 'Kurzfilm', 'Reportage',
    'Nachrichten', 'Interview', 'Hörspiel', 'Podcast',
    'Animationsfilm', 'Stop-Motion', 'Tutorial',
    'Drama', 'Komödie', 'Bühnenstück', 'Gedichtverfilmung',
  ],
  en: [
    'Documentary', 'Explainer', 'Short film', 'Report',
    'News', 'Interview', 'Radio play', 'Podcast',
    'Animation', 'Stop motion', 'Tutorial',
    'Drama', 'Comedy', 'Stage play', 'Poem adaptation',
  ],
};

// FSK-style age ratings per locale.
const AGE_OPTIONS: Record<'de' | 'en', string[]> = {
  de: ['ab 0', 'ab 6', 'ab 12', 'ab 16', 'ab 18'],
  en: ['0+', '6+', '12+', '16+', '18+'],
};

export function EditorSidebar({ activeSeasonId, setActiveSeasonId, store }: Props) {
  const { data, updateData, addEpisode, updateEpisode, removeEpisode, moveEpisode, updateSeason, removeSeason } = store;
  const [editorStep, setEditorStep] = useState<1 | 2 | 3>(1);
  const [customGenreSelected, setCustomGenreSelected] = useState(false);
  const [coverError, setCoverError] = useState('');
  const [seasonError, setSeasonError] = useState('');
  // 'rename' opens the dialog in prompt mode; 'delete' as a confirmation.
  const [seasonDialog, setSeasonDialog] = useState<'rename' | 'delete' | null>(null);
  // Which episode is open in the editor dialog, if any.
  const [openEpisodeId, setOpenEpisodeId] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const { t, locale } = useTranslation();

  const activeSeason = data.seasons.find(s => s.id === activeSeasonId) || data.seasons[0];
  const calculatedCompletion = useMemo(() => calculateProjectCompletion(data), [data]);
  const hasCustomCompletion = typeof data.completionOverride === 'number';
  const seasonLimitReached = data.seasons.length >= resourceLimits.maxSeasons;
  const episodeLimitReached =
    (activeSeason?.episodes.length ?? 0) >= resourceLimits.maxEpisodesPerSeason;

  const handleCoverUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCoverError('');

    const resetInput = () => {
      event.target.value = '';
    };

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setCoverError(t.imageErrorUnsupported);
      resetInput();
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        setCoverError(t.imageErrorRead);
        resetInput();
        return;
      }

      const image = new Image();
      image.onload = () => {
        if (image.width * image.height > resourceLimits.maxImageInputPixels) {
          setCoverError(t.imageErrorTooLarge);
          resetInput();
          return;
        }

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
          setCoverError(t.imageErrorProcess);
          resetInput();
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        updateData({ coverUrl: canvas.toDataURL('image/jpeg', 0.78) });
        setCoverError('');
        resetInput();
      };
      image.onerror = () => {
        setCoverError(t.imageErrorProcess);
        resetInput();
      };
      image.src = reader.result;
    };
    reader.onerror = () => {
      setCoverError(t.imageErrorRead);
      resetInput();
    };
    reader.readAsDataURL(file);
  };

  const openCoverDialog = () => {
    coverInputRef.current?.click();
  };

  return (
    <aside className="editor-sidebar" id="editor-panel" tabIndex={-1} aria-labelledby="editor-panel-heading" style={{ padding: '2rem' }}>
      <h2 id="editor-panel-heading">{t.editorTitle}</h2>
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
            <label htmlFor="field-brand" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblPreviewBrand}</label>
            <input
              id="field-brand"
              type="text"
              value={data.previewBrand || ''}
              onChange={(e) => updateData({ previewBrand: e.target.value })}
              maxLength={fieldLimits.previewBrand}
              placeholder="SeriesCreator"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="field-category" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblPreviewCategory}</label>
            <input
              id="field-category"
              type="text"
              value={data.previewCategory || ''}
              onChange={(e) => updateData({ previewCategory: e.target.value })}
              maxLength={fieldLimits.previewCategory}
              placeholder={t.categoryPlaceholder}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="field-title" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblTitle}</label>
          <input
            id="field-title"
            type="text"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            maxLength={fieldLimits.title}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
          />
        </div>

        <div>
          <label htmlFor="field-author" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblAuthor}</label>
          <input
            id="field-author"
            type="text"
            value={data.author}
            onChange={(e) => updateData({ author: e.target.value })}
            maxLength={fieldLimits.author}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblCoverArt}</label>
          <div className="cover-art-field">
            <div className="cover-art-field__actions">
              <button
                type="button"
                className="ui-button cover-art-field__upload"
                onClick={openCoverDialog}
                aria-describedby={coverError ? 'cover-upload-error' : undefined}
              >
                <ImageIcon size={16} />
                <span>{t.btnChooseCover}</span>
              </button>
              <input
                ref={coverInputRef}
                id="cover-upload-input"
                className="visually-hidden"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                aria-label={t.btnChooseCover}
                tabIndex={-1}
                onChange={handleCoverUpload}
              />
              {data.coverUrl && (
                <button
                  type="button"
                  className="ui-button ui-button--danger"
                  onClick={() => {
                    setCoverError('');
                    updateData({ coverUrl: undefined });
                  }}
                >
                  <X size={16} />
                  <span>{t.btnRemoveCover}</span>
                </button>
              )}
            </div>
            <button
              type="button"
              className="cover-art-field__preview"
              onClick={openCoverDialog}
              aria-label={data.coverUrl ? t.btnReplaceCoverFromPreview : t.btnChooseCoverFromPreview}
              aria-describedby={coverError ? 'cover-upload-error' : undefined}
            >
              {data.coverUrl ? (
                <img src={data.coverUrl} alt={t.lblCoverArt} />
              ) : (
                <div className="cover-art-field__placeholder">
                  <ImageIcon size={22} />
                  <span>{t.noCover}</span>
                </div>
              )}
            </button>
            {coverError && (
              <p id="cover-upload-error" className="field-error" role="alert">
                {coverError}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="field-desc" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblDesc}</label>
          <textarea
            id="field-desc"
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            rows={4}
            maxLength={fieldLimits.description}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
          />
        </div>

        <div style={{ maxWidth: '18rem' }}>
            <label htmlFor="field-age" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblAge}</label>
            <select
              id="field-age"
              value={data.ageRating}
              onChange={(e) => updateData({ ageRating: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }}
            >
              {(AGE_OPTIONS[locale].includes(data.ageRating)
                ? AGE_OPTIONS[locale]
                : [data.ageRating, ...AGE_OPTIONS[locale]]
              ).map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
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
            <label htmlFor="field-genre" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblGenre}</label>
            {(() => {
              const predefinedGenres = GENRE_OPTIONS[locale];
              const isStandard = predefinedGenres.includes(data.genre);
              // Custom input shows when the user explicitly picked it, or when the
              // stored genre is free text (e.g. saved under the other locale).
              const showCustom = customGenreSelected || (!isStandard && data.genre.trim() !== '');

              if (!showCustom) {
                return (
                  <select
                    id="field-genre"
                    value={isStandard ? data.genre : predefinedGenres[0]}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setCustomGenreSelected(true);
                        updateData({ genre: '' });
                      } else {
                        updateData({ genre: e.target.value });
                      }
                    }}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }}
                  >
                    {predefinedGenres.map(g => <option key={g} value={g}>{g}</option>)}
                    <option value="__custom__">{t.customGenre}</option>
                  </select>
                );
              }

              return (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    id="field-genre"
                    type="text"
                    value={data.genre}
                    onChange={(e) => updateData({ genre: e.target.value })}
                    maxLength={fieldLimits.genre}
                    placeholder={t.customGenre}
                    style={{ flex: 1, padding: '0.6rem', border: '1px solid var(--border-color)', width: '100%' }}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="ui-icon-button"
                    onClick={() => {
                      setCustomGenreSelected(false);
                      updateData({ genre: predefinedGenres[0] });
                    }}
                    title={t.lblBackToSelection}
                    style={{ flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })()}
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="field-cast" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblCast}</label>
            <input
              id="field-cast"
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
          <label htmlFor="field-reflection" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblReflection}</label>
          <textarea
            id="field-reflection"
            value={data.reflection || ''}
            onChange={(e) => updateData({ reflection: e.target.value })}
            rows={5}
            maxLength={fieldLimits.reflection}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
          />
        </div>
        <div>
          <label htmlFor="field-concept-title" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>{t.lblCustomConceptTitle}</label>
          <input
            id="field-concept-title"
            type="text"
            value={data.customConceptTitle || ''}
            onChange={(e) => updateData({ customConceptTitle: e.target.value })}
            maxLength={fieldLimits.customConceptTitle}
            placeholder={t.customConceptTitlePlaceholder}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', marginBottom: '1rem' }}
          />
        </div>
        
        <div>
          <label htmlFor="field-concept-text" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t.lblCustomConceptText}</label>
          <textarea
            id="field-concept-text"
            value={data.customConceptText || ''}
            onChange={(e) => updateData({ customConceptText: e.target.value })}
            rows={5}
            maxLength={fieldLimits.customConceptText}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', resize: 'vertical' }}
          />
        </div>
        <div>
          <label htmlFor="field-sources" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem' }}>{t.lblSources}</label>
          <textarea
            id="field-sources"
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>{t.episodesTitle}</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={activeSeasonId}
              onChange={(e) => setActiveSeasonId(e.target.value)}
              aria-label={t.selSeasonLabel}
              style={{ padding: '0.4rem', border: '1px solid var(--border-color)' }}
            >
              {data.seasons.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                if (seasonLimitReached) return;
                const newSeasonId = crypto.randomUUID();
                updateData({
                  seasons: [
                    ...data.seasons,
                    { id: newSeasonId, title: `${t.lblSeasonN}${data.seasons.length + 1}`, episodes: [] }
                  ]
                });
                setActiveSeasonId(newSeasonId);
              }}
              className="ui-button season-action-button"
              disabled={seasonLimitReached}
              aria-label={t.addSeason}
              title={t.addSeason}
            >
              <Plus size={16} />
              <span>{t.addSeason}</span>
            </button>
            {seasonLimitReached && (
              <span className="field-hint" role="status">
                {t.seasonLimitReached.replace(
                  '{count}',
                  String(resourceLimits.maxSeasons),
                )}
              </span>
            )}
            <button
              type="button"
              onClick={() => setSeasonDialog('rename')}
              className="ui-icon-button"
              aria-label={t.renameSeason}
              title={t.renameSeason}
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeSeason?.episodes.length > 0) {
                  setSeasonError(t.errorDeleteSeason);
                  return;
                }
                setSeasonError('');
                setSeasonDialog('delete');
              }}
              className="ui-icon-button ui-icon-button--danger"
              aria-label={t.deleteSeason}
              title={t.deleteSeason}
            >
              <Trash2 size={16} />
            </button>
          </div>
          {seasonError && (
            <p className="field-error" role="alert">{seasonError}</p>
          )}
          {seasonDialog === 'rename' && (
            <ConfirmDialog
              message={t.promptRename}
              defaultValue={activeSeason?.title || ''}
              confirmLabel={t.btnRename}
              onConfirm={(name) => { updateSeason(activeSeasonId, name); setSeasonDialog(null); }}
              onCancel={() => setSeasonDialog(null)}
            />
          )}
          {seasonDialog === 'delete' && (
            <ConfirmDialog
              message={t.confirmDeleteSeason}
              confirmLabel={t.btnDelete}
              destructive
              onConfirm={() => {
                removeSeason(activeSeasonId);
                setActiveSeasonId(data.seasons.find(s => s.id !== activeSeasonId)?.id || '');
                setSeasonDialog(null);
              }}
              onCancel={() => setSeasonDialog(null)}
            />
          )}
        </div>
        {activeSeason?.episodes.map((ep, index) => (
          <EpisodeRow
            key={ep.id}
            episode={ep}
            seasonId={activeSeason.id}
            index={index}
            total={activeSeason.episodes.length}
            onOpen={setOpenEpisodeId}
            onRemove={removeEpisode}
            onMove={moveEpisode}
          />
        ))}

        {/* One dialog for whichever episode is open, rather than one per row. */}
        {activeSeason && openEpisodeId && (() => {
          const openIndex = activeSeason.episodes.findIndex((ep) => ep.id === openEpisodeId);
          if (openIndex === -1) return null;
          return (
            <EpisodeDialog
              episode={activeSeason.episodes[openIndex]}
              seasonId={activeSeason.id}
              index={openIndex}
              onUpdate={updateEpisode}
              onClose={() => setOpenEpisodeId(null)}
            />
          );
        })()}

        <button
          type="button"
          onClick={() => activeSeason && addEpisode(activeSeason.id)}
          disabled={!activeSeason || episodeLimitReached}
          className="ui-button ui-button--full ui-button--dashed"
        >
          <Plus size={16} /> {t.addEpisode}
        </button>
        {episodeLimitReached && (
          <p className="field-hint" role="status">
            {t.episodeLimitReached.replace(
              '{count}',
              String(resourceLimits.maxEpisodesPerSeason),
            )}
          </p>
        )}
      </div>
      )}
    </aside>
  );
}
