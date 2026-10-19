import type { Episode } from '../types';
import { EpisodeCard } from './EpisodeCard';
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
      {episodes.map((episode, index) => (
        <EpisodeCard key={episode.id} episode={episode} index={index} />
      ))}
    </div>
  );
}
