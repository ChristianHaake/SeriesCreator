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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
      {episodes.map((ep, index) => (
        <div key={ep.id} style={{ backgroundColor: '#222', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', ':hover': { transform: 'scale(1.03)', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' } } as React.CSSProperties}>
          <div style={{ height: '180px', backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {ep.thumbnailUrl ? (
              <img src={ep.thumbnailUrl} alt={ep.altText || ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#9ca3af' }}>
                <ImageIcon size={32} />
                <span style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>Kein Bild</span>
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', backgroundColor: 'rgba(0,0,0,0.85)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}>
              {index + 1}
            </div>
          </div>
          <div style={{ padding: '1.2rem' }}>
            <h3 style={{ marginBottom: '0.6rem', fontSize: '1.15rem' }}>{index + 1}. {ep.title || "Ohne Titel"}</h3>
            <p style={{ color: 'var(--color-text-dark-secondary)', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
              {ep.summary || "Keine Beschreibung verfügbar."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
