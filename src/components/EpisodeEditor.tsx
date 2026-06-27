import React, { memo } from 'react';
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
  const { t, locale } = useTranslation();
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      alert(locale === 'de' ? 'Bitte wähle ein PNG-, JPG- oder WebP-Bild.' : 'Choose a PNG, JPG, or WebP image.');
      e.target.value = '';
      return;
    }

    if (file.size > resourceLimits.imageFileBytes) {
      alert(locale === 'de' ? 'Das Bild ist zu groß. Maximal erlaubt sind 5 MB.' : 'The image is too large. Maximum size is 5 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        alert(locale === 'de' ? 'Das Bild konnte nicht gelesen werden.' : 'The image could not be read.');
        e.target.value = '';
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (
          img.width > resourceLimits.imageMaxEdge ||
          img.height > resourceLimits.imageMaxEdge
        ) {
          alert(locale === 'de' ? 'Das Bild ist zu groß. Maximal erlaubt sind 4096 Pixel pro Kante.' : 'The image is too large. Maximum size is 4096 pixels per edge.');
          e.target.value = '';
          return;
        }

        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > resourceLimits.imageOutputWidth) {
          height = Math.round((height * resourceLimits.imageOutputWidth) / width);
          width = resourceLimits.imageOutputWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          alert(locale === 'de' ? 'Das Bild konnte nicht verarbeitet werden.' : 'The image could not be processed.');
          e.target.value = '';
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        onUpdate(seasonId, episode.id, { thumbnailUrl: compressedBase64 });
        e.target.value = '';
      };
      img.onerror = () => {
        alert(locale === 'de' ? 'Das Bildformat konnte nicht verarbeitet werden.' : 'The image format could not be processed.');
        e.target.value = '';
      };
      img.src = reader.result;
    };
    reader.onerror = () => {
      alert(locale === 'de' ? 'Das Bild konnte nicht gelesen werden.' : 'The image could not be read.');
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--color-bg-workspace)', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0 }}>Episode {index + 1}</h4>
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
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 500 }}>{t.episodeTitleLabel}</label>
          <input 
            type="text" 
            value={episode.title}
            onChange={(e) => onUpdate(seasonId, episode.id, { title: e.target.value })}
            maxLength={fieldLimits.episodeTitle}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 500 }}>{t.episodeDescriptionLabel}</label>
          <textarea 
            value={episode.summary}
            onChange={(e) => onUpdate(seasonId, episode.id, { summary: e.target.value })}
            rows={2}
            maxLength={fieldLimits.episodeSummary}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, padding: '0.6rem', border: '1px dashed var(--color-border)', borderRadius: '6px', justifyContent: 'center', backgroundColor: 'var(--color-bg-surface)', transition: 'background-color 0.2s', color: 'var(--color-text-primary)' }}>
            <ImageIcon size={18} /> {t.btnChooseThumbnail}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          </label>
          {episode.thumbnailUrl && (
            <div style={{ marginTop: '0.5rem' }}>
              <img src={episode.thumbnailUrl} alt={episode.altText || "Thumbnail Vorschau"} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 500 }}>Alternativtext (Barrierefreiheit)</label>
                <input 
                  type="text" 
                  value={episode.altText || ''}
                  onChange={(e) => onUpdate(seasonId, episode.id, { altText: e.target.value })}
                  maxLength={fieldLimits.altText}
                  placeholder="Beschreibe das Bild in max. 125 Zeichen..."
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
