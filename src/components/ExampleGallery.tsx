import { Check, Play, X } from 'lucide-react';
import { useEffect, useRef, type KeyboardEvent } from 'react';
import type { ExampleProject, ExampleProjectId } from '../domain/exampleProjects';
import { useTranslation } from '../i18n';

interface Props {
  examples: ExampleProject[];
  onChoose: (id: ExampleProjectId) => void;
  onClose: () => void;
}

export function ExampleGallery({ examples, onChoose, onClose }: Props) {
  const { t } = useTranslation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeButtonRef.current?.focus();

    return () => {
      const previousFocus = previousFocusRef.current;
      window.setTimeout(() => previousFocus?.focus(), 0);
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) return;

    event.preventDefault();
    const currentIndex = focusable.indexOf(
      document.activeElement as HTMLElement,
    );
    const nextIndex = event.shiftKey
      ? (currentIndex - 1 + focusable.length) % focusable.length
      : (currentIndex + 1) % focusable.length;
    focusable[nextIndex].focus();
  }

  return (
    <div
      className="example-gallery"
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <section
        className="example-gallery__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="example-gallery-title"
        ref={dialogRef}
      >
        <header className="example-gallery__header">
          <div>
            <h2 id="example-gallery-title">{t.exampleGalleryTitle}</h2>
            <p>{t.exampleGalleryIntro}</p>
          </div>
          <button
            type="button"
            className="ui-icon-button"
            onClick={onClose}
            aria-label={t.exampleClose}
            title={t.exampleClose}
            ref={closeButtonRef}
          >
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <div className="example-gallery__list">
          {examples.map((example) => (
            <article key={example.id} className="example-card">
              <div className="example-card__main">
                <div className="example-card__eyebrow">
                  <span>{example.subject}</span>
                  <span>{example.grade}</span>
                </div>
                <h3>{example.title}</h3>
                <p className="example-card__subtitle">{example.subtitle}</p>
                <p>{example.summary}</p>

                <div className="example-card__features" aria-label={t.exampleFeatures}>
                  {example.featureHighlights.map((feature) => (
                    <span key={feature}>
                      <Check size={14} aria-hidden="true" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="example-card__material">
                <section>
                  <h4>{t.exampleSocialCopy}</h4>
                  <p>{example.socialCopy}</p>
                  <div className="example-card__hashtags">
                    {example.hashtags.map((hashtag) => (
                      <span key={hashtag}>{hashtag}</span>
                    ))}
                  </div>
                </section>

                <section>
                  <h4>{t.exampleImagePrompts}</h4>
                  <ol>
                    {example.imagePrompts.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ol>
                </section>
              </div>

              <footer className="example-card__actions">
                <button
                  type="button"
                  className="ui-button example-card__use"
                  onClick={() => onChoose(example.id)}
                >
                  <Play size={16} aria-hidden="true" />
                  <span>{t.btnUseExample}</span>
                </button>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
