import { useTranslation } from '../i18n';

export function AppFooter() {
  const { t } = useTranslation();
  return (
    <footer className="app-footer">
      <span className="app-footer__privacy">{t.footerPrivacy}</span>
      <div className="app-footer__right" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <nav className="app-footer__nav" aria-label="Footer Navigation">
          <a href="/hilfe">{t.footerHelp}</a>
          <a href="/ueber">{t.footerAbout}</a>
          <a href="/lehrkraefte">{t.footerTeachers}</a>
          <a href="/datenschutz">{t.footerPrivacyPolicy}</a>
          <a href="/impressum">{t.footerImprint}</a>
          <a
            className="github-link"
            href="https://github.com/ChristianHaake/SeriesCreator"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.9 4.8 19 5.1 19 5.1c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.7c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
            </svg>
            <span>GitHub</span>
          </a>
        </nav>
        <a
          className="app-footer__coffee"
          href="https://buymeacoffee.com/christianhaake"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: '#FFDD00', fontWeight: 'bold' }}
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm-2 5h-2V5h2v3zM4 19h16v2H4z"/>
          </svg>
          <span>{t.coffee}</span>
        </a>
      </div>
    </footer>
  );
}
