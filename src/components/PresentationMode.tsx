import { useState, useEffect, useMemo, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { Episode, EpisodeContentBlock, ProjectData, Season } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../i18n';

interface Props {
  data: ProjectData;
  onClose: () => void;
}

type PresentationSlide =
  | { type: 'title' }
  | { type: 'season'; season: Season; seasonIndex: number }
  | { type: 'episode'; episode: Episode; episodeIndex: number }
  | { type: 'contentBlock'; block: EpisodeContentBlock }
  | { type: 'reflection' }
  | { type: 'sources' }
  | { type: 'credits' };

export function PresentationMode({ data, onClose }: Props) {
  const { t } = useTranslation();
  const slides = useMemo<PresentationSlide[]>(() => [
    { type: 'title' },
    ...data.seasons.flatMap((season, seasonIndex) => [
      { type: 'season' as const, season, seasonIndex },
      ...season.episodes.flatMap((episode, episodeIndex) => [
        { type: 'episode' as const, episode, episodeIndex },
        ...(episode.contentBlocks ?? []).map((block) => ({ type: 'contentBlock' as const, block })),
      ]),
    ]),
    { type: 'reflection' },
    { type: 'sources' },
    { type: 'credits' },
  ], [data.seasons]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const maxIndex = slides.length - 1;
  const slide = slides[currentIndex];
  const slideCount = slides.length;
  const slideNumber = currentIndex + 1;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (e.key === ' ') {
          // A focused button activates on space by itself. Without this the
          // slide would advance twice right after clicking the next arrow.
          if (e.target instanceof HTMLButtonElement) return;
          // Otherwise space would also scroll the reflection/sources panels.
          e.preventDefault();
        }
        setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maxIndex, onClose]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const controls = [...(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])];
    if (controls.length === 0) return;
    const first = controls[0];
    const last = controls.at(-1)!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

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
    <div ref={dialogRef} className="presentation-mode" role="dialog" aria-modal="true" aria-label={t.presentationDialogLabel} onKeyDown={handleDialogKeyDown}>
      <button 
        type="button"
        ref={closeButtonRef}
        onClick={onClose}
        aria-label={t.ariaClosePresentation}
        className="presentation-close"
      >
        <X aria-hidden="true" size={24} />
      </button>

      <div className="presentation-content">
        
        {slide.type === 'title' ? (
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
        ) : slide.type === 'season' ? (
          <section className="presentation-season-overview" aria-label={`${t.season} ${slide.seasonIndex + 1}`}>
            <p className="presentation-kicker">{t.season} {slide.seasonIndex + 1}</p>
            <h1 className="presentation-section-title">{slide.season.title}</h1>
            {slide.season.episodes.length > 0 ? (
              <ol className="presentation-season-overview__episodes">
                {slide.season.episodes.map((episode, episodeIndex) => (
                  <li key={episode.id}>
                    <span>{episodeIndex + 1}</span>
                    <div>
                      <h2>{episode.title}</h2>
                      <p>{episode.summary || t.lblNoDescription}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="presentation-copy">{t.lblNoEpisodes}</p>
            )}
          </section>
        ) : slide.type === 'episode' ? (
          // Episode Screen
          <div className="presentation-episode">
            <div className="presentation-episode__media">
              {slide.episode.thumbnailUrl ? (
                <img 
                  className="presentation-episode__image"
                  src={slide.episode.thumbnailUrl}
                  alt={slide.episode.altText || slide.episode.title}
                />
              ) : (
                <div className="presentation-episode__placeholder">
                  <span>{t.noImage}</span>
                </div>
              )}
            </div>
            <div className="presentation-episode__text">
              <h2 className="presentation-kicker">{t.lblEpisodeN}{slide.episodeIndex + 1}</h2>
              <h1 className="presentation-episode__title">{slide.episode.title}</h1>
              <p className="presentation-copy">{slide.episode.summary}</p>
              {slide.episode.learningDepth && (
                <section className="presentation-learning-depth">
                  <h2>{t.episodeLearningDepthLabel}</h2>
                  <p className="presentation-copy presentation-copy--preformatted">
                    {slide.episode.learningDepth}
                  </p>
                </section>
              )}
            </div>
          </div>
        ) : slide.type === 'contentBlock' ? (
          <section className="presentation-content-block">
            {slide.block.type === 'text' ? (
              <>
                {slide.block.title && <h1 className="presentation-section-title">{slide.block.title}</h1>}
                <p className="presentation-copy presentation-copy--preformatted">{slide.block.body}</p>
              </>
            ) : (
              <>
                <img className="presentation-content-block__image" src={slide.block.imageUrl} alt={slide.block.altText} />
                {slide.block.caption && <p className="presentation-copy">{slide.block.caption}</p>}
              </>
            )}
          </section>
        ) : slide.type === 'reflection' ? (
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
        ) : slide.type === 'sources' ? (
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
          onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          aria-label={t.ariaPrevSlide}
          className="presentation-navigation__button"
        >
          <ChevronLeft aria-hidden="true" size={36} />
        </button>
        <p className="presentation-navigation__counter" aria-live="polite">
          <span aria-hidden="true">{slideNumber} / {slideCount}</span>
          <span className="visually-hidden">
            {t.presentationSlideLabel}{slideNumber}{t.presentationSlideOf}{slideCount}
          </span>
        </p>
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
