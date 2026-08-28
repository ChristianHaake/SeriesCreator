import { memo } from 'react';
import type { Episode } from '../types';
import { ArrowUp, ArrowDown, Trash2, Pencil } from 'lucide-react';
import { useTranslation } from '../i18n';

interface Props {
  episode: Episode;
  seasonId: string;
  index: number;
  total: number;
  onOpen: (episodeId: string) => void;
  onRemove: (seasonId: string, episodeId: string) => void;
  onMove: (seasonId: string, episodeId: string, direction: 'up' | 'down') => void;
}

/**
 * One line in the sidebar list. Editing happens in the dialog; ordering and
 * deletion stay here, where they act on the sequence rather than on content.
 */
export const EpisodeRow = memo(function EpisodeRow({
  episode, seasonId, index, total, onOpen, onRemove, onMove,
}: Props) {
  const { t } = useTranslation();
  const title = episode.title || t.lblUntitled;

  return (
    <div className="episode-row">
      <button
        type="button"
        className="episode-row__open"
        onClick={() => onOpen(episode.id)}
        aria-label={`${t.lblEpisodeN}${index + 1}: ${title}`}
      >
        <span className="episode-row__number">{index + 1}</span>
        {episode.thumbnailUrl ? (
          <img className="episode-row__thumb" src={episode.thumbnailUrl} alt="" />
        ) : (
          <span className="episode-row__thumb episode-row__thumb--empty" aria-hidden="true" />
        )}
        <span className="episode-row__text">
          <span className="episode-row__title">{title}</span>
          <span className="episode-row__meta">
            {episode.summary
              ? `${episode.summary.length} / ${t.charactersLabel}`
              : t.lblNoDescription}
          </span>
        </span>
        <Pencil aria-hidden="true" size={16} />
      </button>

      <div className="episode-row__actions">
        <button
          type="button"
          onClick={() => onMove(seasonId, episode.id, 'up')}
          disabled={index === 0}
          className="ui-icon-button"
          aria-label={t.episodeMoveUp}
          title={t.episodeMoveUp}
        >
          <ArrowUp size={16} />
        </button>
        <button
          type="button"
          onClick={() => onMove(seasonId, episode.id, 'down')}
          disabled={index === total - 1}
          className="ui-icon-button"
          aria-label={t.episodeMoveDown}
          title={t.episodeMoveDown}
        >
          <ArrowDown size={16} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(seasonId, episode.id)}
          className="ui-icon-button ui-icon-button--danger"
          aria-label={t.episodeDelete}
          title={t.episodeDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
});
