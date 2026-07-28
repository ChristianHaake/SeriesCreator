
import type { Episode } from '../types';
import { Image as ImageIcon } from 'lucide-react';
import { useTranslation } from '../i18n';

interface Props {
  episodes: Episode[];
}

export function EpisodeGrid({ episodes }: Props) {
  const { t } = useTranslation();

  if (episodes.length === 0) {
    return (
      <div className="episode-grid__empty">
        {t.lblNoEpisodes}
      </div>
    );
  }

  return (
    <div className="episode-grid">
      {episodes.map((ep, index) => (
        <div key={ep.id} className="episode-card">
          <div className="episode-card__media">
            {ep.thumbnailUrl ? (
              <img
                className="episode-card__image"
                src={ep.thumbnailUrl}
                alt={ep.altText || ep.title}
              />
            ) : (
              <div className="episode-card__placeholder">
                <ImageIcon aria-hidden="true" size={32} />
                <span>{t.noImage}</span>
              </div>
            )}
            <div className="episode-card__number">
              {index + 1}
            </div>
          </div>
          <div className="episode-card__content">
            <h3>{index + 1}. {ep.title || t.lblUntitled}</h3>
            <p>
              {ep.summary || t.lblNoDescription}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
