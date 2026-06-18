import { useState, useEffect } from 'react';
import type { ProjectData } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  data: ProjectData;
  onClose: () => void;
}

export function PresentationMode({ data, onClose }: Props) {
  // Collect all episodes across seasons
  const allEpisodes = data.seasons.flatMap(s => s.episodes);
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 is the title screen

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentIndex(prev => Math.min(prev + 1, allEpisodes.length - 1));
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(prev - 1, -1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allEpisodes.length, onClose]);

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
        onClick={onClose}
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
        ) : (
          // Episode Screen
          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', maxWidth: '1000px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              {allEpisodes[currentIndex]?.thumbnailUrl ? (
                <img 
                  src={allEpisodes[currentIndex].thumbnailUrl} 
                  alt="Thumbnail" 
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
        )}

      </div>

      <div style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <button 
          onClick={() => setCurrentIndex(prev => Math.max(prev - 1, -1))}
          disabled={currentIndex === -1}
          style={{ background: 'transparent', border: 'none', color: currentIndex === -1 ? '#333' : 'white', cursor: currentIndex === -1 ? 'default' : 'pointer' }}
        >
          <ChevronLeft size={48} />
        </button>
        <button 
          onClick={() => setCurrentIndex(prev => Math.min(prev + 1, allEpisodes.length - 1))}
          disabled={currentIndex === allEpisodes.length - 1}
          style={{ background: 'transparent', border: 'none', color: currentIndex === allEpisodes.length - 1 ? '#333' : 'white', cursor: currentIndex === allEpisodes.length - 1 ? 'default' : 'pointer' }}
        >
          <ChevronRight size={48} />
        </button>
      </div>
    </div>
  );
}
