import { useState, useEffect, useMemo } from 'react';
import type { ProjectData } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  data: ProjectData;
  onClose: () => void;
}

export function PresentationMode({ data, onClose }: Props) {
  // Collect all episodes across seasons
  const allEpisodes = useMemo(() => data.seasons.flatMap(s => s.episodes), [data.seasons]);
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 is the title screen

  const maxIndex = allEpisodes.length + 2;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(prev - 1, -1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maxIndex, onClose]);

  // Request fullscreen on mount
  useEffect(() => {
    document.documentElement.requestFullscreen().catch(() => {
      console.log('Fullscreen failed');
    });
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-bg-dark)', color: 'white', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
      <button 
        type="button"
        onClick={onClose}
        aria-label="Präsentation schließen"
        style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', zIndex: 110 }}
      >
        <X size={24} />
      </button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', position: 'relative' }}>
        
        {currentIndex === -1 ? (
          // Title Screen
          <div style={{ textAlign: 'center', maxWidth: '800px' }}>
            {data.coverUrl && (
              <img src={data.coverUrl} alt="Cover" style={{ maxWidth: '400px', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} />
            )}
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{data.title}</h1>
            <p style={{ fontSize: '1.5rem', color: 'var(--color-text-dark-secondary)' }}>{data.description}</p>
          </div>
        ) : currentIndex < allEpisodes.length ? (
          // Episode Screen
          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', maxWidth: '1000px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              {allEpisodes[currentIndex]?.thumbnailUrl ? (
                <img 
                  src={allEpisodes[currentIndex].thumbnailUrl} 
                  alt={allEpisodes[currentIndex].altText || "Thumbnail"} 
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} 
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#666', fontSize: '1.5rem' }}>Kein Bild</span>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-text-dark-secondary)', marginBottom: '0.5rem' }}>Episode {currentIndex + 1}</h2>
              <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem', lineHeight: 1.1 }}>{allEpisodes[currentIndex]?.title}</h1>
              <p style={{ fontSize: '1.5rem', lineHeight: 1.6 }}>{allEpisodes[currentIndex]?.summary}</p>
            </div>
          </div>
        ) : currentIndex === allEpisodes.length ? (
          // Details / Reflexion
          <div style={{ textAlign: 'center', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#fb923c' }}>Hintergrund & Lernziele</h1>
            <p style={{ fontSize: '1.5rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', textAlign: 'left' }}>
              {data.reflection || "Keine Reflexion hinterlegt."}
            </p>
          </div>
        ) : currentIndex === allEpisodes.length + 1 ? (
          // Sources
          <div style={{ textAlign: 'center', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#fb923c' }}>Quellenverzeichnis</h1>
            <p style={{ fontSize: '1.5rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', textAlign: 'left' }}>
              {data.sources || "Keine Quellen hinterlegt."}
            </p>
          </div>
        ) : (
          // Credits
          <div style={{ textAlign: 'center', maxWidth: '800px', animation: 'scrollUp 20s linear infinite' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '3rem' }}>{data.title}</h1>
            
            <h2 style={{ fontSize: '2rem', color: 'var(--color-text-dark-secondary)', marginBottom: '1rem' }}>Eine Produktion von</h2>
            <p style={{ fontSize: '2.5rem', marginBottom: '3rem', fontWeight: 'bold' }}>{data.cast || "Der Klasse"}</p>
            
            <h2 style={{ fontSize: '2rem', color: 'var(--color-text-dark-secondary)', marginBottom: '1rem' }}>Genre</h2>
            <p style={{ fontSize: '2.5rem', marginBottom: '3rem', fontWeight: 'bold' }}>{data.genre}</p>
            
            <div style={{ marginTop: '5rem', color: '#fb923c', fontWeight: 'bold', fontSize: '2rem' }}>{data.previewBrand || 'SeriesCreator'}</div>
          </div>
        )}

      </div>

      <div style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <button 
          type="button"
          onClick={() => setCurrentIndex(prev => Math.max(prev - 1, -1))}
          disabled={currentIndex === -1}
          aria-label="Vorherige Folie"
          style={{ background: 'transparent', border: 'none', color: currentIndex === -1 ? '#333' : 'white', cursor: currentIndex === -1 ? 'default' : 'pointer' }}
        >
          <ChevronLeft size={48} />
        </button>
        <button 
          type="button"
          onClick={() => setCurrentIndex(prev => Math.min(prev + 1, maxIndex))}
          disabled={currentIndex === maxIndex}
          aria-label="Nächste Folie"
          style={{ background: 'transparent', border: 'none', color: currentIndex === maxIndex ? '#333' : 'white', cursor: currentIndex === maxIndex ? 'default' : 'pointer' }}
        >
          <ChevronRight size={48} />
        </button>
      </div>
    </div>
  );
}
