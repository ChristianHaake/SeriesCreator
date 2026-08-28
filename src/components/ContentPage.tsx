import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { contentPages, type ContentPath } from '../content';
import { useTranslation } from '../i18n';

/**
 * Default-exported and loaded on demand: react-markdown and its remark/micromark
 * dependencies are only needed on the seven content routes, never in the editor
 * where students spend their time.
 */
export default function ContentPage({ pathname }: { pathname: ContentPath }) {
  const { locale, t } = useTranslation();
  const page = contentPages[locale][pathname];

  return (
    <main className="content-page">
      <a href="/" className="content-page__back">{t.backToApp}</a>
      <div className="markdown-content">
        <h1>{page.title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
      </div>
    </main>
  );
}
