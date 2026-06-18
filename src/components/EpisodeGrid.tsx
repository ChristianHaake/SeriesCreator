import React from 'react';
import type { Episode } from '../types';
import { Image as ImageIcon } from 'lucide-react';

interface Props {
  episodes: Episode[];
}

export function EpisodeGrid({ episodes }: Props) {
  if (episodes.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-dark-secondary)' }}>
        Noch keine Episoden vorhanden.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {episodes.map((ep, index) => (
        <div key={ep.id} style={{ backgroundColor: '#222', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.02)' } } as React.CSSProperties}>
          <div style={{ height: '160px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {ep.thumbnailUrl ? (
              <img src={ep.thumbnailUrl} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666' }}>
                <ImageIcon size={32} />
                <span style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Kein Bild</span>
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', backgroundColor: 'rgba(0,0,0,0.7)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {index + 1}
            </div>
          </div>
          <div style={{ padding: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{index + 1}. {ep.title || "Ohne Titel"}</h3>
            <p style={{ color: 'var(--color-text-dark-secondary)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {ep.summary || "Keine Beschreibung verfügbar."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
