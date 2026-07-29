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
    .getByLabel('Description', { exact: true })
    .fill('The class discovers the first source.');

  const preview = page.getByRole('main');
  await expect(preview.getByRole('heading', { name: 'Release Test Series' })).toBeVisible();
  await expect(preview.getByRole('heading', { name: /1\. The First Clue/ })).toBeVisible();
  await expect(preview.getByText('Created by: Class 8B', { exact: true })).toBeVisible();

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

  page.once('dialog', (dialog) => dialog.accept());
  await climateCard.getByRole('button', { name: 'Use example' }).click();

  await expect(page.getByText('Example project loaded.')).toBeVisible();
  await expect(page.locator('.streaming-title')).toHaveText('The School Climate Code');
  await expect(page.locator('.completion-score')).toHaveText('Project status 100%');
  await expect(page.locator('.streaming-facts')).toContainText('Created by: Class 8b');
  await expect(page.locator('.episode-card__image')).toHaveCount(3);

  await page.getByLabel('Select season').selectOption('climate-season-action');
  await expect(page.locator('.episode-card__image')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: '3. A Plan for Monday' })).toBeVisible();
});
