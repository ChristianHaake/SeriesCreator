import { Check, Play, X } from 'lucide-react';
import type { ExampleProject, ExampleProjectId } from '../domain/exampleProjects';
import { useTranslation } from '../i18n';

interface Props {
  examples: ExampleProject[];
  onChoose: (id: ExampleProjectId) => void;
  onClose: () => void;
}

export function ExampleGallery({ examples, onChoose, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <div className="example-gallery" role="presentation">
      <section
        className="example-gallery__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="example-gallery-title"
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
          >
            <X size={18} />
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
