import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { contentPages, type ContentPath } from '../content';
import { useTranslation } from '../i18n';

/**
 * Default-exported and loaded on demand: react-markdown and its remark/micromark
 * dependencies are only needed on the content routes, never in the editor
 * where students spend their time.
 */
export default function ContentPage({ pathname }: { pathname: ContentPath }) {
  const { locale, t } = useTranslation();
  const page = contentPages[locale][pathname];
  const isSupportPage = pathname === '/unterstuetzung';

  return (
    <main id="main-content" tabIndex={-1} className="content-page">
      <a href="/" className="content-page__back">{t.backToApp}</a>
      <div className={isSupportPage ? 'markdown-content support-content' : 'markdown-content'}>
        <h1>{page.title}</h1>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={isSupportPage ? {
            a: ({ href, title, children }) => href === 'https://buymeacoffee.com/haake'
              ? <a href={href} title={title} className="support-coffee" target="_blank" rel="noopener noreferrer">{children}</a>
              : <a href={href} title={title}>{children}</a>,
          } : undefined}
        >
          {page.content}
        </ReactMarkdown>
      </div>
    </main>
  );
}
