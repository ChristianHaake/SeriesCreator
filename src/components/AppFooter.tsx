export function AppFooter() {
  return (
    <footer className="app-footer">
      <span className="app-footer__privacy">Daten bleiben auf deinem Gerät</span>
      <div className="app-footer__right">
        <nav aria-label="Footer Navigation">
          <a href="/hilfe">Hilfe</a>
          <a href="/ueber">Über</a>
          <a href="/lehrkraefte">Lehrkräfte</a>
          <a href="/datenschutz">Datenschutz</a>
          <a href="/impressum">Impressum</a>
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
      </div>
    </footer>
  );
}
