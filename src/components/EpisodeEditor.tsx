import React, { memo, useState } from 'react';
import type { Episode } from '../types';
import { ArrowUp, ArrowDown, Trash2, Image as ImageIcon } from 'lucide-react';
import { fieldLimits, resourceLimits } from '../domain/constraints';
import { useTranslation } from '../i18n';

interface Props {
  episode: Episode;
  seasonId: string;
  index: number;
  total: number;
  onUpdate: (seasonId: string, episodeId: string, updates: Partial<Episode>) => void;
  onRemove: (seasonId: string, episodeId: string) => void;
  onMove: (seasonId: string, episodeId: string, direction: 'up' | 'down') => void;
}

export const EpisodeEditor = memo(function EpisodeEditor({ episode, seasonId, index, total, onUpdate, onRemove, onMove }: Props) {
  const { t } = useTranslation();
  // Reported inline next to the control, the way the cover upload does it, so
  // the message reaches the student without a blocking dialog.
  const [imageError, setImageError] = useState('');
  const learningDepthLength = episode.learningDepth?.length ?? 0;
  const learningDepthCount = t.episodeLearningDepthCount
    .replace('{count}', String(learningDepthLength))
    .replace('{limit}', String(fieldLimits.episodeLearningDepth));
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError('');

    const fail = (message: string) => {
      setImageError(message);
      e.target.value = '';
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

      const img = new Image();
      img.onload = () => {
        if (img.width * img.height > resourceLimits.maxImageInputPixels) {
          fail(t.imageErrorTooLarge);
          return;
        }

        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > resourceLimits.episodeOutputWidth) {
          height = Math.round((height * resourceLimits.episodeOutputWidth) / width);
          width = resourceLimits.episodeOutputWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          fail(t.imageErrorProcess);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        onUpdate(seasonId, episode.id, { thumbnailUrl: compressedBase64 });
        setImageError('');
        e.target.value = '';
      };
      img.onerror = () => fail(t.imageErrorFormat);
      img.src = reader.result;
    };
    reader.onerror = () => fail(t.imageErrorRead);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--color-bg-workspace)', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0 }}>{t.lblEpisodeN}{index + 1}</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="button"
            onClick={() => onMove(seasonId, episode.id, 'up')} 
            disabled={index === 0}
            className="ui-icon-button"
            aria-label={t.episodeMoveUp}
          >
            <ArrowUp size={16} />
          </button>
          <button 
            type="button"
            onClick={() => onMove(seasonId, episode.id, 'down')} 
            disabled={index === total - 1}
            className="ui-icon-button"
            aria-label={t.episodeMoveDown}
          >
            <ArrowDown size={16} />
          </button>
          <button 
            type="button"
            onClick={() => onRemove(seasonId, episode.id)}
            className="ui-icon-button ui-icon-button--danger"
            aria-label={t.episodeDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor={`ep-title-${episode.id}`} style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 500 }}>{t.episodeTitleLabel}</label>
          <input
            id={`ep-title-${episode.id}`}
            type="text"
            value={episode.title}
            onChange={(e) => onUpdate(seasonId, episode.id, { title: e.target.value })}
            maxLength={fieldLimits.episodeTitle}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          />
        </div>

        <div>
          <label htmlFor={`ep-summary-${episode.id}`} style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 500 }}>{t.episodeDescriptionLabel}</label>
          <textarea
            id={`ep-summary-${episode.id}`}
            value={episode.summary}
            onChange={(e) => onUpdate(seasonId, episode.id, { summary: e.target.value })}
            rows={2}
            maxLength={fieldLimits.episodeSummary}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor={`ep-learning-depth-${episode.id}`} style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 500 }}>{t.episodeLearningDepthLabel}</label>
          <p className="field-hint" id={`ep-learning-depth-hint-${episode.id}`}>{t.episodeLearningDepthHint}</p>
          <textarea
            id={`ep-learning-depth-${episode.id}`}
            value={episode.learningDepth || ''}
            onChange={(e) => onUpdate(seasonId, episode.id, { learningDepth: e.target.value })}
            rows={5}
            maxLength={fieldLimits.episodeLearningDepth}
            aria-describedby={`ep-learning-depth-hint-${episode.id} ep-learning-depth-count-${episode.id}`}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'vertical' }}
          />
          <p className="field-hint" id={`ep-learning-depth-count-${episode.id}`}>
            {learningDepthCount}
          </p>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, padding: '0.6rem', border: '1px dashed var(--color-border)', borderRadius: '6px', justifyContent: 'center', backgroundColor: 'var(--color-bg-surface)', transition: 'background-color 0.2s', color: 'var(--color-text-primary)' }}>
            <ImageIcon size={18} /> {t.btnChooseThumbnail}
            <input
              type="file"
              accept="image/*"
              aria-label={t.btnChooseThumbnail}
              aria-describedby={imageError ? `ep-image-error-${episode.id}` : undefined}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </label>
          {imageError && (
            <p id={`ep-image-error-${episode.id}`} className="field-error" role="alert" style={{ marginTop: '0.5rem' }}>
              {imageError}
            </p>
          )}
          {episode.thumbnailUrl && (
            <div style={{ marginTop: '0.5rem' }}>
              <img src={episode.thumbnailUrl} alt={episode.altText || "Thumbnail Vorschau"} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
              <div style={{ marginTop: '0.5rem' }}>
                <label htmlFor={`ep-alt-${episode.id}`} style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 500 }}>{t.lblAltText}</label>
                <input
                  id={`ep-alt-${episode.id}`}
                  type="text"
                  value={episode.altText || ''}
                  onChange={(e) => onUpdate(seasonId, episode.id, { altText: e.target.value })}
                  maxLength={fieldLimits.altText}
                  placeholder={t.lblDescImage}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
