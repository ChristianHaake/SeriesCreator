import React, { useEffect, useRef, useState } from 'react';
import type { Episode } from '../types';
import { Image as ImageIcon, X } from 'lucide-react';
import { fieldLimits, resourceLimits } from '../domain/constraints';
import { useTranslation } from '../i18n';
import { EpisodeCard } from './EpisodeCard';

interface Props {
  episode: Episode;
  seasonId: string;
  /** Zero-based position in the season. */
  index: number;
  onUpdate: (seasonId: string, episodeId: string, updates: Partial<Episode>) => void;
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
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog?.isConnected || dialog.open) return;
    dialog.showModal();
  }, []);

  const change = (updates: Partial<Episode>) => onUpdate(seasonId, episode.id, updates);

  const learningDepthCount = t.episodeLearningDepthCount
    .replace('{count}', String(episode.learningDepth?.length ?? 0))
    .replace('{limit}', String(fieldLimits.episodeLearningDepth));

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageError('');

    const fail = (message: string) => {
      setImageError(message);
      event.target.value = '';
    };

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      fail(t.imageErrorUnsupported);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        fail(t.imageErrorRead);
        return;
      }

      const image = new Image();
      image.onload = () => {
        if (image.width * image.height > resourceLimits.maxImageInputPixels) {
          fail(t.imageErrorTooLarge);
          return;
        }

        const canvas = document.createElement('canvas');
        let width = image.width;
        let height = image.height;

        if (width > resourceLimits.episodeOutputWidth) {
          height = Math.round((height * resourceLimits.episodeOutputWidth) / width);
          width = resourceLimits.episodeOutputWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) {
          fail(t.imageErrorProcess);
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        change({ thumbnailUrl: canvas.toDataURL('image/jpeg', 0.7) });
        setImageError('');
        event.target.value = '';
      };
      image.onerror = () => fail(t.imageErrorFormat);
      image.src = reader.result;
    };
    reader.onerror = () => fail(t.imageErrorRead);
    reader.readAsDataURL(file);
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
