import React from 'react';
import type { Episode } from '../types';
import { ArrowUp, ArrowDown, Trash2, Image as ImageIcon } from 'lucide-react';

interface Props {
  episode: Episode;
  seasonId: string;
  index: number;
  total: number;
  onUpdate: (seasonId: string, episodeId: string, updates: Partial<Episode>) => void;
  onRemove: (seasonId: string, episodeId: string) => void;
  onMove: (seasonId: string, episodeId: string, direction: 'up' | 'down') => void;
}

export function EpisodeEditor({ episode, seasonId, index, total, onUpdate, onRemove, onMove }: Props) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(seasonId, episode.id, { thumbnailUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--color-bg-workspace)', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0 }}>Episode {index + 1}</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => onMove(seasonId, episode.id, 'up')} 
            disabled={index === 0}
            style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.2rem', borderRadius: '4px', cursor: index === 0 ? 'not-allowed' : 'pointer' }}
          >
            <ArrowUp size={16} />
          </button>
          <button 
            onClick={() => onMove(seasonId, episode.id, 'down')} 
            disabled={index === total - 1}
            style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.2rem', borderRadius: '4px', cursor: index === total - 1 ? 'not-allowed' : 'pointer' }}
          >
            <ArrowDown size={16} />
          </button>
          <button 
            onClick={() => onRemove(seasonId, episode.id)}
            style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.2rem', borderRadius: '4px' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Titel</label>
          <input 
            type="text" 
            value={episode.title}
            onChange={(e) => onUpdate(seasonId, episode.id, { title: e.target.value })}
            style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Beschreibung</label>
          <textarea 
            value={episode.summary}
            onChange={(e) => onUpdate(seasonId, episode.id, { summary: e.target.value })}
            rows={2}
            style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', padding: '0.4rem', border: '1px dashed var(--border-color)', borderRadius: '4px', justifyContent: 'center', backgroundColor: '#fff' }}>
            <ImageIcon size={16} /> Thumbnail wählen
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          </label>
          {episode.thumbnailUrl && (
            <img src={episode.thumbnailUrl} alt="Thumbnail preview" style={{ width: '100%', height: '80px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '4px' }} />
          )}
        </div>
      </div>
    </div>
  );
}
