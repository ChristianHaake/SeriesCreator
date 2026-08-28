import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.localStorage.setItem('series-creator-locale', 'en');
  });
});

test('completes the primary workflow and downloads both portable formats', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Series Title').fill('Release Test Series');
  await page.getByLabel('Created by').fill('Class 8B');
  await page.getByRole('button', { name: '2. Episodes' }).click();
  await page.getByRole('button', { name: 'Add Episode' }).click();

  const editor = page.locator('.editor-sidebar');
  await editor.getByLabel('Title', { exact: true }).fill('The First Clue');
  await editor
    .getByLabel('Short description', { exact: true })
    .fill('The class discovers the first source.');
  await editor
    .getByLabel('Academic deepening', { exact: true })
    .fill('The class distinguishes an observation from evidence and records a supporting source.');

  const preview = page.getByRole('main');
  await expect(preview.getByRole('heading', { name: 'Release Test Series' })).toBeVisible();
  await expect(preview.getByRole('heading', { name: /1\. The First Clue/ })).toBeVisible();
  await expect(preview.getByText('Created by: Class 8B', { exact: true })).toBeVisible();
  await preview.getByText('Academic deepening', { exact: true }).click();
  await expect(preview.getByText('The class distinguishes an observation from evidence and records a supporting source.')).toBeVisible();

  const projectDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  expect((await projectDownload).suggestedFilename()).toBe(
    'Release-Test-Series.seriescreator',
  );

  const htmlDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download as HTML' }).click();
  expect((await htmlDownload).suggestedFilename()).toBe('Release-Test-Series.html');

  await page.getByRole('button', { name: 'Present' }).click();
  const presentation = page.locator('.presentation-mode');
  await expect(presentation).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(
    presentation.getByRole('heading', { name: 'Episode 1', exact: true }),
  ).toBeVisible();
  await expect(presentation.getByText('The class distinguishes an observation from evidence and records a supporting source.')).toBeVisible();
  await presentation.getByRole('button', { name: 'Close Presentation' }).click();
  await expect(presentation).toBeHidden();
});

test('supports direct content routes and narrow responsive editing', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/');

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.locator('.preview-main')).toBeVisible();

  await page.goto('/hilfe');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Help');
  await expect(page.getByRole('link', { name: /Back to App/i })).toHaveAttribute('href', '/');
});

test('loads a complete current example through the gallery', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Examples' }).click();

  const gallery = page.getByRole('dialog', { name: 'Examples in the app' });
  const climateCard = gallery
    .getByRole('heading', { name: 'The School Climate Code' })
    .locator('xpath=ancestor::article');

  await climateCard.getByRole('button', { name: 'Use example' }).click();
  await page
    .locator('dialog.confirm-dialog')
    .getByRole('button', { name: 'Load example' })
    .click();

  await expect(page.getByText('Example project loaded.')).toBeVisible();
  await expect(page.locator('.streaming-title')).toHaveText('The School Climate Code');
  await expect(page.locator('.completion-score')).toHaveText('Project status 100%');
  await expect(page.locator('.streaming-facts')).toContainText('Created by: Class 8b');
  await expect(page.locator('.episode-card__image')).toHaveCount(3);

  await page.getByLabel('Select season').selectOption('climate-season-action');
  await expect(page.locator('.episode-card__image')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: '3. A Plan for Monday' })).toBeVisible();
});

test('imports a project through the background validator', async ({ page }) => {
  await page.goto('/');

  await page.locator('input[type="file"][aria-label="Load"]').setInputFiles({
    name: 'import.seriescreator',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      schemaVersion: 2,
      title: 'Imported Series',
      description: 'Validated away from the main UI thread.',
      seasons: [{ id: 's1', title: 'Season 1', episodes: [] }],
    })),
  });

  await expect(page.getByText('Project file loaded.')).toBeVisible();
  await expect(page.locator('.streaming-title')).toHaveText('Imported Series');
});

test('renders the print layout with backgrounds and the full details step', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Series Title').fill('Print Test Series');
  await page.getByRole('button', { name: '3. Details' }).click();
  await page.getByLabel('Sources').fill('Class measurement log; school archive.');

  const printLayout = page.locator('#print-layout-container');

  // Hidden on screen: it must not be announced or take part in the layout.
  await expect(printLayout).toBeHidden();

  await page.emulateMedia({ media: 'print' });

  await expect(printLayout).toBeVisible();
  await expect(printLayout).toContainText('Print Test Series');
  await expect(printLayout).toContainText('Class measurement log; school archive.');

  // Without this the dark fills are dropped and white text prints onto blank paper.
  await expect(printLayout).toHaveCSS('print-color-adjust', 'exact');

  await page.emulateMedia({ media: 'screen' });
});

test('advances presentation slides once per keypress and tracks position', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Series Title').fill('Keyboard Test');
  await page.getByRole('button', { name: '2. Episodes' }).click();
  for (const title of ['First', 'Second']) {
    await page.getByRole('button', { name: 'Add Episode' }).click();
    await page.locator('.editor-sidebar').getByLabel('Title', { exact: true }).last().fill(title);
  }

  await page.getByRole('button', { name: 'Present' }).click();
  const counter = page.locator('.presentation-navigation__counter');

  // Title + 2 episodes + reflection + sources + credits.
  await expect(counter).toContainText('1 / 6');

  // Clicking the arrow leaves focus on it; space must then advance exactly once,
  // not twice (the window handler plus the button's own activation).
  await page.getByRole('button', { name: 'Next Slide' }).click();
  await expect(counter).toContainText('2 / 6');
  await page.keyboard.press('Space');
  await expect(counter).toContainText('3 / 6');

  // Space away from a button still advances, and must not scroll the panel.
  await page.locator('.presentation-content').click();
  await page.keyboard.press('Space');
  await expect(counter).toContainText('4 / 6');

  await page.keyboard.press('ArrowLeft');
  await expect(counter).toContainText('3 / 6');
});

test('gives every content page one h1, a matching tab title and a localized description', async ({ page }) => {
  for (const path of ['/hilfe', '/ueber', '/lehrkraefte', '/datenschutz', '/impressum']) {
    await page.goto(path);
    const headings = page.locator('.markdown-content h1');
    await expect(headings).toHaveCount(1);
    const heading = (await headings.innerText()).trim();
    await expect(page).toHaveTitle(`${heading} · SeriesCreator`);
  }

  await page.goto('/');
  await expect(page).toHaveTitle('SeriesCreator');
  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute('content', /Plan fictional classroom series/);

  await page.getByRole('button', { name: 'DE', exact: true }).click();
  await expect(description).toHaveAttribute('content', /Plane fiktive Unterrichtsserien/);
});

test('labels the season icon buttons for assistive tech', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '2. Episodes' }).click();

  await expect(page.getByRole('button', { name: 'Rename Season' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete Season' })).toBeVisible();
});

test('reports image upload problems inline instead of in a blocking dialog', async ({ page }) => {
  const nativeDialogs: string[] = [];
  page.on('dialog', (dialog) => { nativeDialogs.push(dialog.message()); void dialog.dismiss(); });

  await page.goto('/');
  await page.getByRole('button', { name: '2. Episodes' }).click();
  await page.getByRole('button', { name: 'Add Episode' }).click();

  const thumbnail = page.locator('.editor-sidebar input[type="file"]').last();
  await thumbnail.setInputFiles({
    name: 'notes.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  });

  await expect(page.getByRole('alert')).toHaveText('Choose a PNG, JPG, or WebP image.');
  expect(nativeDialogs).toEqual([]);
});

test('confirms destructive actions in an in-app dialog', async ({ page }) => {
  const nativeDialogs: string[] = [];
  page.on('dialog', (dialog) => { nativeDialogs.push(dialog.message()); void dialog.dismiss(); });

  await page.goto('/');
  await page.getByLabel('Series Title').fill('Keep this draft');

  const dialog = page.locator('dialog.confirm-dialog');
  await page.getByRole('button', { name: 'New / Clear' }).click();
  await expect(dialog).toBeVisible();

  // Escape must cancel and leave the draft untouched.
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByLabel('Series Title')).toHaveValue('Keep this draft');

  await page.getByRole('button', { name: 'New / Clear' }).click();
  await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByLabel('Series Title')).not.toHaveValue('Keep this draft');

  expect(nativeDialogs).toEqual([]);
});

test('offers a skip link and labelled landmarks', async ({ page }) => {
  await page.goto('/');

  const skipLink = page.getByRole('link', { name: 'Skip to editor' });

  // It must come first in the tab order. Asserted from DOM order rather than by
  // pressing Tab, because Safari does not move focus to links unless the user
  // has switched on "Press Tab to highlight each item".
  await expect
    .poll(() => page.evaluate(() => {
      const focusable = document.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      return focusable[0]?.className ?? '';
    }))
    .toContain('skip-link');

  await skipLink.focus();
  // Hidden until focused, so it must be on screen once it is.
  await expect(skipLink).toBeInViewport();

  await page.keyboard.press('Enter');
  await expect(page.locator('#editor-panel')).toBeFocused();

  await expect(page.getByRole('main')).toHaveAccessibleName('Preview');
  await expect(page.getByRole('complementary')).toHaveAccessibleName('SeriesCreator Editor');
  // The streaming chrome imitates a nav bar; only the footer nav is real.
  await expect(page.getByRole('navigation')).toHaveCount(1);
});

test('shows a not-found page for unknown routes', async ({ page }) => {
  await page.goto('/definitely-not-a-page');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: /Back to App/i })).toHaveAttribute('href', '/');
  // The editor must not be what a dead link renders.
  await expect(page.locator('.editor-sidebar')).toHaveCount(0);
});

test('serves content routes from a lazily loaded chunk', async ({ page }) => {
  const chunks: string[] = [];
  page.on('response', (response) => {
    const url = response.url();
    if (url.includes('/assets/') && url.endsWith('.js')) chunks.push(url.split('/').pop()!);
  });

  await page.goto('/');
  expect(chunks.some((name) => name.startsWith('ContentPage'))).toBe(false);

  await page.goto('/hilfe');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Help');
  expect(chunks.some((name) => name.startsWith('ContentPage'))).toBe(true);
});

test('keeps a project that cannot be restored, instead of overwriting it', async ({ page }) => {
  const original = '{"title":"Six weeks of work","seasons":[';
  await page.addInitScript((data) => {
    window.localStorage.setItem('series_creator_data', data);
  }, original);

  await page.goto('/');
  await expect(page.locator('.app-status')).toContainText('could not be opened');

  // The autosave must not have replaced the only copy while the student read that.
  await page.waitForTimeout(1200);
  const storage = await page.evaluate(() => ({
    backup: window.localStorage.getItem('series_creator_data.unreadable'),
    main: window.localStorage.getItem('series_creator_data'),
  }));
  expect(storage.backup).toBe(original);
  expect(storage.main).toBe(original);
});

test('still autosaves normally after a clean load', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Series Title').fill('Autosave still works');

  await expect.poll(async () => page.evaluate(() => {
    const raw = window.localStorage.getItem('series_creator_data');
    return raw ? JSON.parse(raw).title : null;
  })).toBe('Autosave still works');

  // Nothing was mistaken for an unreadable load.
  expect(await page.evaluate(() => window.localStorage.getItem('series_creator_data.unreadable'))).toBeNull();
});
