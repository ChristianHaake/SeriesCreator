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
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800;
          
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            onUpdate(seasonId, episode.id, { thumbnailUrl: compressedBase64 });
          }
        };
        img.src = reader.result as string;
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
            style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.3rem', borderRadius: '6px', cursor: index === 0 ? 'not-allowed' : 'pointer', color: 'var(--color-text-muted)', transition: 'all 0.2s' }}
          >
            <ArrowUp size={16} />
          </button>
          <button 
            onClick={() => onMove(seasonId, episode.id, 'down')} 
            disabled={index === total - 1}
            style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.3rem', borderRadius: '6px', cursor: index === total - 1 ? 'not-allowed' : 'pointer', color: 'var(--color-text-muted)', transition: 'all 0.2s' }}
          >
            <ArrowDown size={16} />
          </button>
          <button 
            onClick={() => onRemove(seasonId, episode.id)}
            style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '0.3rem', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 500 }}>Titel</label>
          <input 
            type="text" 
            value={episode.title}
            onChange={(e) => onUpdate(seasonId, episode.id, { title: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 500 }}>Beschreibung</label>
          <textarea 
            value={episode.summary}
            onChange={(e) => onUpdate(seasonId, episode.id, { summary: e.target.value })}
            rows={2}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, padding: '0.6rem', border: '1px dashed var(--color-border)', borderRadius: '6px', justifyContent: 'center', backgroundColor: 'var(--color-bg-surface)', transition: 'background-color 0.2s', color: 'var(--color-text-primary)' }}>
            <ImageIcon size={18} /> Thumbnail wählen
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
                  maxLength={125}
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
}
