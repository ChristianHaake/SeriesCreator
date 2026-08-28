import type { Episode } from '../types';
import { Image as ImageIcon } from 'lucide-react';
import { useTranslation } from '../i18n';

interface Props {
  episode: Episode;
  /** Zero-based; the card shows it one-based. */
  index: number;
}

/**
 * One episode as it appears in the streaming preview. Shared with the episode
 * editor dialog so the preview shown while writing is the real component
 * rather than a lookalike that can drift.
 */
export function EpisodeCard({ episode, index }: Props) {
  const { t } = useTranslation();

  return (
    <div className="episode-card">
      <div className="episode-card__media">
        {episode.thumbnailUrl ? (
          <img
            className="episode-card__image"
            src={episode.thumbnailUrl}
            alt={episode.altText || episode.title}
          />
        ) : (
          <div className="episode-card__placeholder">
            <ImageIcon aria-hidden="true" size={32} />
            <span>{t.noImage}</span>
          </div>
        )}
        <div className="episode-card__number">{index + 1}</div>
      </div>
      <div className="episode-card__content">
        <h3>{index + 1}. {episode.title || t.lblUntitled}</h3>
        <p>{episode.summary || t.lblNoDescription}</p>
        {episode.learningDepth && (
          <details className="episode-card__learning-depth">
            <summary>{t.episodeLearningDepthLabel}</summary>
            <p>{episode.learningDepth}</p>
          </details>
        )}
      </div>
    </div>
  );
}
