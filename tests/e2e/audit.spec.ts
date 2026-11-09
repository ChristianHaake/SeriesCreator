import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { clickHeaderAction } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 900 });
  await page.addInitScript(() => {
    if (!window.sessionStorage.getItem('audit-initialized')) {
      window.localStorage.clear();
      window.localStorage.setItem('series-creator-locale', 'en');
      window.sessionStorage.setItem('audit-initialized', 'true');
    }
  });
});

test('preserves a noisy portrait JPEG cover through a project export and import', async ({ page }) => {
  await page.goto('/');
  const jpeg = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 3200;
    const context = canvas.getContext('2d')!;
    const pixels = context.createImageData(canvas.width, canvas.height);
    let seed = 123456789;
    for (let index = 0; index < pixels.data.length; index += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      pixels.data[index] = seed & 255;
      pixels.data[index + 1] = (seed >>> 8) & 255;
      pixels.data[index + 2] = (seed >>> 16) & 255;
      pixels.data[index + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    return canvas.toDataURL('image/jpeg', 1).split(',')[1];
  });
  const noisyJpeg = Buffer.from(jpeg, 'base64');
  expect(noisyJpeg.length).toBeGreaterThan(1_500_000);
  await page.locator('#cover-upload-input').setInputFiles({
    name: 'noisy-portrait.jpg',
    mimeType: 'image/jpeg',
    buffer: noisyJpeg,
  });

  const cover = page.locator('.cover-art-field__preview img');
  await expect(cover).toBeVisible();
  const encoded = await cover.getAttribute('src');
  const encodedLength = encoded!.length;
  expect(encodedLength).toBeLessThanOrEqual(1_500_000);

  const projectDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  const projectPath = await (await projectDownload).path();
  const projectFile = await readFile(projectPath!);
  await page.getByRole('button', { name: 'New / Clear' }).click();
  await page.locator('dialog.confirm-dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await page.locator('input[type="file"][aria-label="Load"]').setInputFiles({
    name: 'noisy-portrait.seriescreator',
    mimeType: 'application/json',
    buffer: projectFile,
  });
  await page.locator('dialog.confirm-dialog').getByRole('button', { name: 'Load project file' }).click();
  await expect(page.locator('.cover-art-field__preview img')).toHaveAttribute('src', encoded!);
  expect(await page.locator('.cover-art-field__preview img').getAttribute('src').then((src) => src!.length))
    .toBeLessThanOrEqual(1_500_000);
});

test('keeps the last edit across immediate Help navigation and clears an unreadable backup on confirmed reset', async ({ page }) => {
  const corrupt = '{"title":"damaged project"';
  await page.goto('/');
  await page.evaluate((value) => window.localStorage.setItem('series_creator_data', value), corrupt);
  await page.reload();
  await expect(page.locator('.app-status')).toContainText('could not be opened');
  await page.getByLabel('Series Title').fill('Last edit before leaving');
  await page.getByRole('link', { name: 'Help' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Help');
  await page.goto('/');
  await expect(page.getByLabel('Series Title')).toHaveValue('Last edit before leaving');

  await page.getByRole('button', { name: 'New / Clear' }).click();
  await page.locator('dialog.confirm-dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('series_creator_data.unreadable'))).toBeNull();
});

test('keeps the editor usable when the localStorage getter is blocked', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() { throw new Error('storage blocked'); },
  }));
  await page.goto('/');
  await expect(page.getByLabel('Series Title')).toBeVisible();
  await page.getByLabel('Series Title').fill('Editable without storage');
  await expect(page.locator('.app-status')).toContainText('storage is blocked or full');
});

test('warns both tabs about an external edit and does not overwrite the other tab snapshot', async ({ page, context }) => {
  await page.goto('/');
  const otherPage = await context.newPage();
  await otherPage.setViewportSize({ width: 1500, height: 900 });
  await otherPage.goto('/');

  await page.getByLabel('Series Title').fill('First tab snapshot');
  await expect.poll(() => page.evaluate(() => {
    const value = window.localStorage.getItem('series_creator_data');
    return value ? JSON.parse(value).title : null;
  })).toBe('First tab snapshot');
  await expect(otherPage.locator('.app-status')).toContainText('changed in another tab');

  await otherPage.getByLabel('Series Title').fill('Later edit in conflicted tab');
  await page.waitForTimeout(700);
  await expect.poll(() => page.evaluate(() => {
    const value = window.localStorage.getItem('series_creator_data');
    return value ? JSON.parse(value).title : null;
  })).toBe('First tab snapshot');
  await otherPage.close();
});

test('opens an exported HTML file and advances once per Space press', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByLabel('Series Title').fill('Tokenizer export');
  await page.getByLabel('Description').fill('<!--<script>');
  await page.getByRole('button', { name: '2. Episodes' }).click();
  await page.getByRole('button', { name: 'Add Episode' }).click();
  await page.locator('.episode-row__open').first().click();
  await page.locator('dialog.episode-dialog').getByLabel('Title', { exact: true }).fill('Offline episode');
  await page.keyboard.press('Escape');

  const htmlDownload = page.waitForEvent('download');
  await clickHeaderAction(page, 'Download as HTML');
  const htmlPath = testInfo.outputPath('presentation.html');
  await (await htmlDownload).saveAs(htmlPath);
  const offline = await page.context().newPage();
  await offline.goto(pathToFileURL(htmlPath!).href);
  await expect(offline.locator('.series-overview__hero p')).toHaveText('<!--<script>');
  await expect(offline.locator('script')).toHaveCount(1);
  await offline.locator('#nextBtn').focus();
  await offline.keyboard.press('Space');
  await expect(offline.locator('.series-overview')).toHaveCount(0);
  await expect(offline.locator('.center-container')).toBeVisible();
  await offline.keyboard.press('Space');
  await expect(offline.locator('.episode-title')).toHaveText('Offline episode');
  await offline.close();
});

test('serves localized support pages with the outbound contribution link', async ({ page }) => {
  await page.goto('/');
  for (const [locale, title] of [
    ['en', 'Support'],
    ['de', 'Unterstützung'],
  ] as const) {
    await page.evaluate((value) => window.localStorage.setItem('series-creator-locale', value), locale);
    await page.goto('/');
    await page.goto('/unterstuetzung');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.locator('.markdown-content').getByRole('link', { name: /Buy Me a Coffee/i })).toHaveAttribute(
      'href',
      'https://buymeacoffee.com/haake',
    );
    expect(new URL(page.url()).pathname).toBe('/unterstuetzung');
  }
});
