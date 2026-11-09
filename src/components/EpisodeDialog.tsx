import React, { useEffect, useRef, useState } from 'react';
import type { Episode, EpisodeContentBlock } from '../types';
import { ArrowDown, ArrowUp, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react';
import { fieldLimits, resourceLimits } from '../domain/constraints';
import { useTranslation } from '../i18n';
import { EpisodeCard } from './EpisodeCard';
import { processImageUpload } from '../domain/imageUpload';

interface Props {
  episode: Episode;
  seasonId: string;
  /** Zero-based position in the season. */
  index: number;
  onUpdate: (seasonId: string, episodeId: string, updates: Partial<Episode> | ((episode: Episode) => Partial<Episode>)) => boolean | void;
  onClose: () => void;
}

/**
 * The episode fields, with room to write. Built on the native <dialog>, so the
 * focus trap, Escape handling, inert background and top-layer stacking come
 * from the platform.
 *
 * Edits apply immediately, exactly as they did inline — there is deliberately
 * no Save or Cancel. Everything in this app autosaves, and a Cancel that
 * discarded an episode's work on a stray Escape would be a new way to lose it.
 */
export function EpisodeDialog({ episode, seasonId, index, onUpdate, onClose }: Props) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState('');
  const uploadLifecycle = useRef(0);
  const thumbnailRevision = useRef(0);
  useEffect(() => () => { uploadLifecycle.current += 1; }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog?.isConnected || dialog.open) return;
    dialog.showModal();
  }, []);

  const change = (updates: Partial<Episode>) => onUpdate(seasonId, episode.id, updates);

  const learningDepthCount = t.episodeLearningDepthCount
    .replace('{count}', String(episode.learningDepth?.length ?? 0))
    .replace('{limit}', String(fieldLimits.episodeLearningDepth));
  const contentBlocks = episode.contentBlocks ?? [];

  const updateContentBlocks = (nextBlocks: EpisodeContentBlock[]) => change({ contentBlocks: nextBlocks });
  const addTextBlock = () => {
    if (contentBlocks.length >= resourceLimits.maxContentBlocksPerEpisode) return;
    updateContentBlocks([
      ...contentBlocks,
      { id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, type: 'text', body: '' },
    ]);
  };
  const updateContentBlock = (blockId: string, updates: Partial<EpisodeContentBlock>) => {
    updateContentBlocks(contentBlocks.map((block) =>
      block.id === blockId ? { ...block, ...updates } as EpisodeContentBlock : block,
    ));
  };
  const removeContentBlock = (blockId: string) => {
    updateContentBlocks(contentBlocks.filter((block) => block.id !== blockId));
  };
  const moveContentBlock = (blockIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;
    if (targetIndex < 0 || targetIndex >= contentBlocks.length) return;
    const nextBlocks = [...contentBlocks];
    [nextBlocks[blockIndex], nextBlocks[targetIndex]] = [nextBlocks[targetIndex], nextBlocks[blockIndex]];
    updateContentBlocks(nextBlocks);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    const lifecycle = uploadLifecycle.current;
    const revision = ++thumbnailRevision.current;
    setImageError('');
    const result = await processImageUpload(file, resourceLimits.episodeOutputWidth, 0.7);
    if (lifecycle !== uploadLifecycle.current || revision !== thumbnailRevision.current) return;
    if (result.ok) change({ thumbnailUrl: result.url });
    else setImageError(t[result.error]);
    input.value = '';
  };

  const handleContentImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    const lifecycle = uploadLifecycle.current;
    setImageError('');
    const result = await processImageUpload(file, resourceLimits.episodeOutputWidth, 0.7);
    if (lifecycle !== uploadLifecycle.current) return;
    if (result.ok) {
      const id = `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const applied = onUpdate(seasonId, episode.id, (current) => {
        const blocks = current.contentBlocks ?? [];
        if (blocks.length >= resourceLimits.maxContentBlocksPerEpisode) return {};
        return { contentBlocks: [...blocks, { id, type: 'image', imageUrl: result.url, altText: '' }] };
      });
      if (applied === false) setImageError(t.contentBlocksLimit.replace('{count}', String(resourceLimits.maxContentBlocksPerEpisode)));
    } else setImageError(t[result.error]);
    input.value = '';
  };

  return (
    <dialog
      ref={dialogRef}
      className="episode-dialog"
      aria-labelledby="episode-dialog-title"
      onClose={onClose}
      onCancel={onClose}
    >
      <header className="episode-dialog__header">
        <h2 id="episode-dialog-title">{t.lblEpisodeN}{index + 1}</h2>
        <button
          type="button"
          className="ui-icon-button"
          onClick={onClose}
          aria-label={t.episodeDialogClose}
          title={t.episodeDialogClose}
        >
          <X aria-hidden="true" size={18} />
        </button>
      </header>

      <div className="episode-dialog__body">
        <div className="episode-dialog__fields">
          <div>
            <label htmlFor={`ep-title-${episode.id}`}>{t.episodeTitleLabel}</label>
            <input
              id={`ep-title-${episode.id}`}
              type="text"
              value={episode.title}
              onChange={(event) => change({ title: event.target.value })}
              maxLength={fieldLimits.episodeTitle}
            />
          </div>

          <div>
            <label htmlFor={`ep-summary-${episode.id}`}>{t.episodeDescriptionLabel}</label>
            <textarea
              id={`ep-summary-${episode.id}`}
              value={episode.summary}
              onChange={(event) => change({ summary: event.target.value })}
              rows={5}
              maxLength={fieldLimits.episodeSummary}
            />
          </div>

          <div>
            <label htmlFor={`ep-learning-depth-${episode.id}`}>{t.episodeLearningDepthLabel}</label>
            <p className="field-hint" id={`ep-learning-depth-hint-${episode.id}`}>
              {t.episodeLearningDepthHint}
            </p>
            <textarea
              id={`ep-learning-depth-${episode.id}`}
              value={episode.learningDepth || ''}
              onChange={(event) => change({ learningDepth: event.target.value })}
              rows={14}
              maxLength={fieldLimits.episodeLearningDepth}
              aria-describedby={`ep-learning-depth-hint-${episode.id} ep-learning-depth-count-${episode.id}`}
            />
            <p className="field-hint" id={`ep-learning-depth-count-${episode.id}`}>
              {learningDepthCount}
            </p>
          </div>

          <section className="episode-content-blocks" aria-labelledby={`ep-content-blocks-${episode.id}`}>
            <h3 id={`ep-content-blocks-${episode.id}`}>{t.episodeContentBlocks}</h3>
            <p className="field-hint">
              {t.contentBlocksLimit.replace('{count}', String(resourceLimits.maxContentBlocksPerEpisode))}
            </p>
            <ol>
              {contentBlocks.map((block, blockIndex) => (
                <li key={block.id} className="episode-content-blocks__item">
                  <div className="episode-content-blocks__actions">
                    <strong>{block.type === 'text' ? t.contentBlockText : t.contentBlockImage}</strong>
                    <button type="button" className="ui-icon-button" onClick={() => moveContentBlock(blockIndex, 'up')} disabled={blockIndex === 0} aria-label={t.moveContentBlockUp} title={t.moveContentBlockUp}>
                      <ArrowUp aria-hidden="true" size={16} />
                    </button>
                    <button type="button" className="ui-icon-button" onClick={() => moveContentBlock(blockIndex, 'down')} disabled={blockIndex === contentBlocks.length - 1} aria-label={t.moveContentBlockDown} title={t.moveContentBlockDown}>
                      <ArrowDown aria-hidden="true" size={16} />
                    </button>
                    <button type="button" className="ui-icon-button ui-icon-button--danger" onClick={() => removeContentBlock(block.id)} aria-label={t.deleteContentBlock} title={t.deleteContentBlock}>
                      <Trash2 aria-hidden="true" size={16} />
                    </button>
                  </div>
                  {block.type === 'text' ? (
                    <>
                      <label htmlFor={`block-title-${block.id}`}>{t.contentBlockTitle}</label>
                      <input id={`block-title-${block.id}`} value={block.title || ''} maxLength={fieldLimits.contentBlockTitle} onChange={(event) => updateContentBlock(block.id, { title: event.target.value || undefined })} />
                      <label htmlFor={`block-body-${block.id}`}>{t.contentBlockBody}</label>
                      <textarea id={`block-body-${block.id}`} value={block.body} maxLength={fieldLimits.contentBlockBody} rows={8} onChange={(event) => updateContentBlock(block.id, { body: event.target.value })} />
                    </>
                  ) : (
                    <>
                      <img src={block.imageUrl} alt={block.altText} />
                      <label htmlFor={`block-alt-${block.id}`}>{t.lblAltText} ({t.requiredField})</label>
                      <input id={`block-alt-${block.id}`} value={block.altText} maxLength={fieldLimits.altText} onChange={(event) => updateContentBlock(block.id, { altText: event.target.value })} required aria-invalid={!block.altText.trim()} aria-describedby={!block.altText.trim() ? `block-alt-error-${block.id}` : undefined} />
                      {!block.altText.trim() && <p id={`block-alt-error-${block.id}`} className="field-error">{t.imageAltRequired}</p>}
                      <label htmlFor={`block-caption-${block.id}`}>{t.contentBlockCaption}</label>
                      <input id={`block-caption-${block.id}`} value={block.caption || ''} maxLength={fieldLimits.contentBlockCaption} onChange={(event) => updateContentBlock(block.id, { caption: event.target.value || undefined })} />
                    </>
                  )}
                </li>
              ))}
            </ol>
            <div className="episode-content-blocks__add">
              <button type="button" className="ui-button" onClick={addTextBlock} disabled={contentBlocks.length >= resourceLimits.maxContentBlocksPerEpisode}>
                <Plus aria-hidden="true" size={16} /> {t.addTextBlock}
              </button>
              <button type="button" className="ui-button" onClick={() => contentImageInputRef.current?.click()} disabled={contentBlocks.length >= resourceLimits.maxContentBlocksPerEpisode}>
                <ImageIcon aria-hidden="true" size={16} /> {t.addImageBlock}
              </button>
              <input ref={contentImageInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="visually-hidden" aria-label={t.addImageBlock} onChange={handleContentImageUpload} />
            </div>
          </section>

          <div className="episode-dialog__image">
            <label className="ui-button ui-button--dashed episode-dialog__upload">
              <ImageIcon size={18} aria-hidden="true" />
              <span>{t.btnChooseThumbnail}</span>
              <input
                type="file"
                accept="image/*"
                aria-label={t.btnChooseThumbnail}
                aria-describedby={imageError ? `ep-image-error-${episode.id}` : undefined}
                className="visually-hidden"
                onChange={handleImageUpload}
              />
            </label>
            {imageError && (
              <p id={`ep-image-error-${episode.id}`} className="field-error" role="alert">
                {imageError}
              </p>
            )}
            {episode.thumbnailUrl && (
              <div>
                <label htmlFor={`ep-alt-${episode.id}`}>{t.lblAltText}</label>
                <input
                  id={`ep-alt-${episode.id}`}
                  type="text"
                  value={episode.altText || ''}
                  onChange={(event) => change({ altText: event.target.value })}
                  maxLength={fieldLimits.altText}
                  placeholder={t.lblDescImage}
                  required
                />
              </div>
            )}
          </div>
        </div>

        {/* The real preview component, so what is shown here cannot drift from
            what the streaming view renders. */}
        <aside className="episode-dialog__preview theme-streaming" aria-label={t.episodeDialogPreview}>
          <EpisodeCard episode={episode} index={index} />
        </aside>
      </div>
    </dialog>
  );
}
