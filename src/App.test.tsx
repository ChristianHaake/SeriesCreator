import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { getExampleProjects } from './domain/exampleProjects';
import { parseProjectJson, serializeProject } from './domain/projectCodec';
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
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(new Uint8Array([255, 216, 255, 217]), {
        headers: { 'Content-Type': 'image/jpeg' },
        status: 200,
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it('keeps editor and file controls reachable by accessible name', async () => {
    const user = userEvent.setup();
    renderApp();

    expect(screen.getByLabelText('Load', { selector: 'input' })).toHaveAttribute('type', 'file');
    expect(screen.getByLabelText('Choose cover', { selector: 'input' })).toHaveAttribute('type', 'file');
    expect(screen.getByLabelText('Network / Brand')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Series Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Age Rating / Grade')).toBeInTheDocument();
    expect(screen.getByLabelText('Genre')).toBeInTheDocument();
    expect(screen.getByLabelText('Cast')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '2. Episodes' }));
    await user.click(screen.getByRole('button', { name: 'Add Episode' }));

    expect(screen.getAllByLabelText('Select season').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Description').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Choose thumbnail')).toHaveAttribute('type', 'file');

    await user.click(screen.getByRole('button', { name: '3. Details' }));

    expect(screen.getByLabelText('Project Journey & Reflection')).toBeInTheDocument();
    expect(screen.getByLabelText('Custom Section (Title)')).toBeInTheDocument();
    expect(screen.getByLabelText('Custom Section (Text)')).toBeInTheDocument();
    expect(screen.getByLabelText('Sources')).toBeInTheDocument();
  });

  it('shows example projects inside the app', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Examples' }));

    const dialog = screen.getByRole('dialog', { name: 'Examples in the app' });
    expect(within(dialog).getByRole('heading', { name: 'The School Climate Code' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'The Weimar File' })).toBeInTheDocument();
    expect(within(dialog).getAllByText('Social media copy').length).toBeGreaterThan(0);
    expect(within(dialog).getAllByText('Image prompts').length).toBeGreaterThan(0);
    expect(within(dialog).getAllByText(/#SeriesCreator/).length).toBeGreaterThan(0);

    await user.click(within(dialog).getByRole('button', { name: 'Close examples' }));
    expect(screen.queryByRole('dialog', { name: 'Examples in the app' })).not.toBeInTheDocument();
  });

  it('loads the school climate example into the editor and preview', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Examples' }));
    const dialog = screen.getByRole('dialog', { name: 'Examples in the app' });
    const climateCard = within(dialog).getByRole('heading', { name: 'The School Climate Code' }).closest('article');
    expect(climateCard).not.toBeNull();
    await user.click(within(climateCard!).getByRole('button', { name: 'Use example' }));

    expect(window.confirm).toHaveBeenCalledWith(
      'Load this example project? This will replace your current draft.',
    );
    expect(await screen.findByText('Example project loaded.')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'The School Climate Code' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: /1\. The Electricity Detective/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: /2\. Heat on the Run/ }).length).toBeGreaterThan(0);
    expect(document.querySelectorAll('.episode-card img[src^="data:image/jpeg;base64,"]').length).toBe(3);

    await user.click(screen.getByRole('tab', { name: 'Concept' }));
    expect(screen.getByText('Image prompts and social media kit')).toBeInTheDocument();
    expect(screen.getByText(/Class 8b turns energy data/)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Sources' }));
    expect(screen.getByText(/Class measurement log/)).toBeInTheDocument();
  });

  it('loads the Weimar example into the editor and preview', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Examples' }));
    const dialog = screen.getByRole('dialog', { name: 'Examples in the app' });
    const weimarCard = within(dialog).getByRole('heading', { name: 'The Weimar File' }).closest('article');
    expect(weimarCard).not.toBeNull();
    await user.click(within(weimarCard!).getByRole('button', { name: 'Use example' }));

    expect(await screen.findByText('Example project loaded.')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'The Weimar File' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: /1\. A New Start/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: /2\. Inflation in the Street/ }).length).toBeGreaterThan(0);
    expect(document.querySelectorAll('.episode-card img[src^="data:image/jpeg;base64,"]').length).toBe(3);

    await user.click(screen.getByRole('tab', { name: 'Concept' }));
    expect(screen.getByText('Image prompts and social media kit')).toBeInTheDocument();
    expect(screen.getByText(/Weimar Republic into a source-based investigation/)).toBeInTheDocument();
  });
});

describe('example projects', () => {
  it('ship as valid project files', () => {
    for (const locale of ['de', 'en'] as const) {
      for (const example of getExampleProjects(locale)) {
        const parsed = parseProjectJson(serializeProject(example.project));

        expect(parsed.ok).toBe(true);
        if (parsed.ok) {
          expect(parsed.data.seasons).toHaveLength(2);
          expect(parsed.data.seasons.flatMap((season) => season.episodes)).toHaveLength(6);
          expect(parsed.data.reflection).toBeTruthy();
          expect(parsed.data.sources).toBeTruthy();
          expect(parsed.data.customConceptText).toContain('16:9');
          expect(example.socialCopy).toBeTruthy();
          expect(example.imagePrompts.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
