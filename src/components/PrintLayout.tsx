import React from 'react';
import type { ProjectData } from '../types';

interface Props {
  data: ProjectData;
}

// This component is rendered hidden in the DOM purely for the PDF export
export const PrintLayout = React.memo(function PrintLayout({ data }: Props) {
  const allEpisodes = data.seasons.flatMap(s => s.episodes);

  return (
    <div 
      id="print-layout-container" 
      style={{ 
        position: 'absolute', 
        left: 0, 
        top: 0,
        zIndex: -1, // Keep it behind everything
        opacity: 0, // Make it invisible but still part of the layout tree for html-to-image
        pointerEvents: 'none',
        width: '1200px', // Fixed high-res width
        backgroundColor: '#141414', // Dark mode background
        color: '#ffffff',
        fontFamily: 'sans-serif',
        padding: '60px',
        boxSizing: 'border-box'
      }}
    >
      {/* Header / Hero */}
      <div style={{ display: 'flex', gap: '40px', marginBottom: '60px' }}>
        {data.coverUrl ? (
          <img src={data.coverUrl} alt="Cover" style={{ width: '400px', height: '600px', objectFit: 'cover', borderRadius: '8px' }} />
        ) : (
          <div style={{ width: '400px', height: '600px', backgroundColor: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#666', fontSize: '24px' }}>Kein Cover</span>
          </div>
        )}
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '64px', margin: '0 0 20px 0', fontWeight: 'bold' }}>{data.title}</h1>
          
          <div style={{ display: 'flex', gap: '20px', fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', alignItems: 'center' }}>
            <span style={{ color: '#46d369' }}>{data.matchPercentage}% Match</span>
            <span>{new Date().getFullYear()}</span>
            <span style={{ border: '2px solid #a3a3a3', padding: '4px 10px', borderRadius: '4px' }}>{data.ageRating}</span>
          </div>
          
          <p style={{ fontSize: '28px', lineHeight: '1.4', marginBottom: '40px' }}>{data.description}</p>
          
          <div style={{ fontSize: '24px', color: '#a3a3a3' }}>
            <p style={{ margin: '10px 0' }}><strong style={{ color: 'white' }}>Starring:</strong> {data.cast}</p>
            <p style={{ margin: '10px 0' }}><strong style={{ color: 'white' }}>Genre:</strong> {data.genre}</p>
          </div>
        </div>
      </div>

      {/* Episodes Grid */}
      <h2 style={{ fontSize: '48px', borderBottom: '4px solid #E50914', display: 'inline-block', paddingBottom: '10px', marginBottom: '40px' }}>Episoden</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
        {allEpisodes.map((ep, index) => (
          <div key={ep.id} style={{ display: 'flex', gap: '20px', backgroundColor: '#222', padding: '20px', borderRadius: '8px' }}>
            <div style={{ width: '200px', height: '112px', flexShrink: 0, backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              {ep.thumbnailUrl ? (
                <img src={ep.thumbnailUrl} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Kein Bild</div>
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>{index + 1}. {ep.title}</h3>
              <p style={{ fontSize: '20px', color: '#a3a3a3', margin: 0, lineHeight: '1.4' }}>{ep.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
