import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { clickHeaderAction } from './helpers';

// Every content route, plus the app itself. These are the surfaces the release
// suite already exercises, so a violation here is a real regression.
const CONTENT_ROUTES = [
  '/hilfe',
  '/ueber',
  '/lehrkraefte',
  '/verantwortungsvoll',
  '/nutzungsbedingungen',
  '/datenschutz',
  '/impressum',
];

function audit(page: Parameters<typeof AxeBuilder>[0]['page']) {
  return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
}

for (const locale of ['en', 'de'] as const) {
  test.describe(`locale ${locale}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => {
        window.localStorage.clear();
        window.localStorage.setItem('series-creator-locale', value);
      }, locale);
    });

    test('the editor has no accessibility violations', async ({ page }) => {
      await page.goto('/');
      const results = await audit(page).analyze();
      expect(results.violations).toEqual([]);
    });

    test('the editor with a loaded example has no accessibility violations', async ({ page }) => {
      await page.goto('/');
      await clickHeaderAction(page, locale === 'de' ? 'Beispiele' : 'Examples');
      await page
        .getByRole('dialog')
        .getByRole('button', { name: locale === 'de' ? 'Beispiel verwenden' : 'Use example' })
        .first()
        .click();
      await page
        .locator('dialog.confirm-dialog')
        .getByRole('button', { name: locale === 'de' ? 'Beispiel laden' : 'Load example' })
        .click();
      await expect(page.locator('.streaming-title')).not.toBeEmpty();

      const results = await audit(page).analyze();
      expect(results.violations).toEqual([]);
    });

    test('the content pages have no accessibility violations', async ({ page }) => {
      for (const route of CONTENT_ROUTES) {
        await page.goto(route);
        const results = await audit(page).analyze();
        expect(results.violations, `${route} (${locale})`).toEqual([]);
      }
    });
  });
}

// Surfaces that only exist after an interaction, so a route sweep never sees
// them. axe cannot judge contrast over the hero's background image and reports
// those nodes as "incomplete" rather than failing — that case is covered by the
// pixel-sampled measurement recorded in the click-test.
test.describe('interactive surfaces', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem('series-creator-locale', 'en');
    });
    await page.goto('/');
  });

  test('presentation mode has no accessibility violations', async ({ page }) => {
    await page.getByRole('button', { name: 'Present' }).click();
    await expect(page.locator('.presentation-mode')).toBeVisible();

    const results = await audit(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test('the confirmation dialog has no accessibility violations', async ({ page }) => {
    await clickHeaderAction(page, 'New / Clear');
    await expect(page.locator('dialog.confirm-dialog')).toBeVisible();

    const results = await audit(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test('the episode editor dialog has no accessibility violations', async ({ page }) => {
    await page.getByRole('button', { name: '2. Episodes' }).click();
    await page.getByRole('button', { name: 'Add Episode' }).click();
    await page.locator('.episode-row__open').first().click();
    await expect(page.locator('dialog.episode-dialog')).toBeVisible();

    const results = await audit(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test('the example gallery has no accessibility violations', async ({ page }) => {
    await clickHeaderAction(page, 'Examples');
    await expect(page.getByRole('dialog', { name: 'Examples in the app' })).toBeVisible();

    const results = await audit(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test('the editor has no accessibility violations on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();

    const results = await audit(page).analyze();
    expect(results.violations).toEqual([]);
  });
});
