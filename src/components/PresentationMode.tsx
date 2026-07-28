import { useState, useEffect, useMemo } from 'react';
import type { ProjectData } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../i18n';

interface Props {
  data: ProjectData;
  onClose: () => void;
}

export function PresentationMode({ data, onClose }: Props) {
  const { t } = useTranslation();
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
    let enteredFullscreen = false;
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        enteredFullscreen = true;
      } else if (enteredFullscreen) {
        onClose();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.documentElement.requestFullscreen?.().catch(() => {
      // Fullscreen unsupported or denied (e.g. iOS Safari); presentation still works.
    });
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [onClose]);

  return (
    <div className="presentation-mode">
      <button 
        type="button"
        onClick={onClose}
        aria-label={t.ariaClosePresentation}
        className="presentation-close"
      >
        <X aria-hidden="true" size={24} />
      </button>

      <div className="presentation-content">
        
        {currentIndex === -1 ? (
          // Title Screen
          <div className="presentation-title-slide">
            {data.coverUrl && (
              <img
                className="presentation-cover"
                src={data.coverUrl}
                alt={t.lblCoverArt}
              />
            )}
            <h1 className="presentation-title">{data.title}</h1>
            <p className="presentation-description">{data.description}</p>
          </div>
        ) : currentIndex < allEpisodes.length ? (
          // Episode Screen
          <div className="presentation-episode">
            <div className="presentation-episode__media">
              {allEpisodes[currentIndex]?.thumbnailUrl ? (
                <img 
                  className="presentation-episode__image"
                  src={allEpisodes[currentIndex].thumbnailUrl} 
                  alt={allEpisodes[currentIndex].altText || allEpisodes[currentIndex].title} 
                />
              ) : (
                <div className="presentation-episode__placeholder">
                  <span>{t.noImage}</span>
                </div>
              )}
            </div>
            <div className="presentation-episode__text">
              <h2 className="presentation-kicker">{t.lblEpisodeN}{currentIndex + 1}</h2>
              <h1 className="presentation-episode__title">{allEpisodes[currentIndex]?.title}</h1>
              <p className="presentation-copy">{allEpisodes[currentIndex]?.summary}</p>
            </div>
          </div>
        ) : currentIndex === allEpisodes.length ? (
          // Details / Reflexion
          <div className="presentation-scroll-panel">
            <h1 className="presentation-section-title">{t.lblReflection}</h1>
            <p className="presentation-copy presentation-copy--preformatted">
              {data.reflection || t.noReflection}
            </p>
            {(data.customConceptTitle || data.customConceptText) && (
              <div className="presentation-custom-section">
                <h1 className="presentation-section-title">{data.customConceptTitle || t.lblCustomSection}</h1>
                <p className="presentation-copy presentation-copy--preformatted">
                  {data.customConceptText}
                </p>
              </div>
            )}
          </div>
        ) : currentIndex === allEpisodes.length + 1 ? (
          // Sources
          <div className="presentation-scroll-panel">
            <h1 className="presentation-section-title">{t.lblSources}</h1>
            <p className="presentation-copy presentation-copy--preformatted">
              {data.sources || t.noSources}
            </p>
          </div>
        ) : (
          // Credits
          <div className="presentation-scroll-panel presentation-credits">
            <h1 className="presentation-title">{data.title}</h1>
            
            <h2 className="presentation-kicker">{t.presentationBy}</h2>
            <p className="presentation-credit-value">
              {data.author || data.cast || t.presentationClassFallback}
            </p>
            
            <h2 className="presentation-kicker">{t.lblGenre}</h2>
            <p className="presentation-credit-value">{data.genre}</p>
            
            <div className="presentation-credit-brand">{data.previewBrand || 'SeriesCreator'}</div>
          </div>
        )}

      </div>

      <div className="presentation-navigation">
        <button 
          type="button"
          onClick={() => setCurrentIndex(prev => Math.max(prev - 1, -1))}
          disabled={currentIndex === -1}
          aria-label={t.ariaPrevSlide}
          className="presentation-navigation__button"
        >
          <ChevronLeft aria-hidden="true" size={36} />
        </button>
        <button 
          type="button"
          onClick={() => setCurrentIndex(prev => Math.min(prev + 1, maxIndex))}
          disabled={currentIndex === maxIndex}
          aria-label={t.ariaNextSlide}
          className="presentation-navigation__button"
        >
          <ChevronRight aria-hidden="true" size={36} />
        </button>
      </div>
    </div>
  );
}
