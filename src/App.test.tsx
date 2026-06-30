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
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:test-download'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    });
  });

  it('renders keyboard-operable preview tabs', async () => {
    const user = userEvent.setup();
    renderApp();

    const backgroundTab = screen.getByRole('tab', { name: 'Concept' });
    await user.click(backgroundTab);

    expect(backgroundTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('No project journey or reflections entered yet.')).toBeInTheDocument();
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

    expect(screen.getByRole('heading', { name: 'The Netflix Method' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to app/i })).toHaveAttribute('href', '/');
  });

  it('adds a season, selects it, and updates the preview metadata', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '2. Episodes' }));
    await user.click(screen.getByRole('button', { name: 'Add Season' }));

    expect(screen.getAllByRole('option', { name: 'Season 2' }).length).toBeGreaterThan(0);
    expect(screen.getByText(/2 Seasons/)).toBeInTheDocument();
  });

  it('shows status messages for project, HTML, and PDF export actions', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('The project was successfully downloaded.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Download as HTML' }));
    expect(screen.getByText('HTML presentation download has been prepared.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Print / Save as PDF' }));
    expect(window.print).toHaveBeenCalled();
    expect(screen.getByText('Print dialog opened. Use it to save as PDF if needed.')).toBeInTheDocument();
  });

  it('exposes accessible cover upload controls and inline file errors', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const { container } = renderApp();

    expect(screen.getByRole('button', { name: 'Choose cover' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose cover from preview' })).toBeInTheDocument();

    const input = container.querySelector<HTMLInputElement>('#cover-upload-input');
    expect(input).not.toBeNull();
    await user.upload(input!, new File(['not image'], 'notes.txt', { type: 'text/plain' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Choose a PNG, JPG, or WebP image.');
  });
});
