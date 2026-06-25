import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { LocaleProvider } from './i18n';

function renderApp(path = '/') {
  window.history.pushState({}, '', path);
  window.localStorage.setItem('series-creator-locale', 'en');

  return render(
    <LocaleProvider>
      <App />
    </LocaleProvider>,
  );
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'print').mockImplementation(() => undefined);
  });

  it('renders keyboard-operable preview tabs', async () => {
    const user = userEvent.setup();
    renderApp();

    const backgroundTab = screen.getByRole('tab', { name: 'BACKGROUND' });
    await user.click(backgroundTab);

    expect(backgroundTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('No learning objectives or reflections entered yet.')).toBeInTheDocument();
  });

  it('uses path routing for the educator link', () => {
    renderApp();

    expect(screen.getByRole('link', { name: 'For Teachers' })).toHaveAttribute(
      'href',
      expect.stringContaining('/lehrkraefte'),
    );
  });

  it('does not render the dead list action', () => {
    renderApp();

    expect(screen.queryByRole('button', { name: /my list/i })).not.toBeInTheDocument();
  });

  it('renders direct content routes', () => {
    renderApp('/lehrkraefte');

    expect(screen.getByRole('heading', { name: 'Suitable classroom uses' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /zurück zur app/i })).toHaveAttribute('href', '/');
  });
});
