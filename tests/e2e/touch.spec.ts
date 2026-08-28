import { expect, test } from '@playwright/test';

// Runs only under the touch-enabled project (see playwright.config.ts).
// Everything here is driven with tap(), not click(), because the failure this
// guards against — an ancestor scrolling out from under the layout when a field
// takes focus and the virtual keyboard shrinks the viewport — only appears with
// real touch and focus behaviour.

async function shellMetrics(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const shell = document.querySelector('.app-shell')!;
    return {
      scrollLeft: shell.scrollLeft,
      scrollTop: shell.scrollTop,
      overflowsX: shell.scrollWidth > shell.clientWidth,
    };
  });
}

test('drives the editor by touch without stranding the layout', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => 'ontouchstart' in window)).toBe(true);

  await page.getByRole('button', { name: 'Preview', exact: true }).tap();
  await expect(page.locator('.preview-main')).toBeVisible();
  await page.getByRole('button', { name: 'Editor', exact: true }).tap();

  await page.getByRole('button', { name: '2. Episodes' }).tap();
  await page.getByRole('button', { name: 'Add Episode' }).tap();

  const field = page.locator('.editor-sidebar').getByLabel('Academic deepening');
  await field.tap();
  await field.fill('Typed with the on-screen keyboard open.');

  expect(await shellMetrics(page)).toEqual({ scrollLeft: 0, scrollTop: 0, overflowsX: false });

  // Approximate the viewport a virtual keyboard leaves behind.
  await page.setViewportSize({ width: 412, height: 420 });
  expect(await shellMetrics(page)).toEqual({ scrollLeft: 0, scrollTop: 0, overflowsX: false });
});

test('opens and dismisses the confirmation dialog by touch', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '2. Episodes' }).tap();
  await page.getByRole('button', { name: 'Rename Season' }).tap();

  const dialog = page.locator('dialog.confirm-dialog');
  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: 'Cancel' }).tap();
  await expect(dialog).toHaveCount(0);
});

test('keeps interactive controls large enough to tap', async ({ page }) => {
  await page.goto('/');

  const undersized = await page.evaluate(() => {
    const results: { label: string; w: number; h: number }[] = [];
    document.querySelectorAll('button, a[href], select').forEach((element) => {
      const style = getComputedStyle(element);
      // Visually hidden proxies (like the file input behind a styled button)
      // are not tap targets themselves.
      if (style.display === 'none' || element.classList.contains('visually-hidden')) return;
      const box = element.getBoundingClientRect();
      if (box.width < 1 || box.height < 1) return;
      if (box.width < 24 || box.height < 24) {
        results.push({
          label: (element.getAttribute('aria-label') || element.textContent || element.tagName).trim().slice(0, 30),
          w: Math.round(box.width),
          h: Math.round(box.height),
        });
      }
    });
    return results;
  });

  expect(undersized).toEqual([]);
});

test('collapses secondary actions behind a menu, keeping Save reachable', async ({ page }) => {
  await page.goto('/');

  const menu = page.locator('#header-actions-menu');
  // A closed popover must not render: it would sit over the toggle and eat taps.
  await expect(menu).toBeHidden();

  // Save is deliberately outside the menu — no accounts, no server copy.
  await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeVisible();

  const editorTop = await page.evaluate(() =>
    document.querySelector('.editor-sidebar')!.getBoundingClientRect().top / window.innerHeight);
  expect(editorTop, 'editor should start in the upper half of the viewport').toBeLessThan(0.55);

  await page.getByRole('button', { name: 'More actions' }).tap();
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('button', { name: 'New / Clear' })).toBeVisible();

  // Escape and light dismiss come from the native popover, not from our code.
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
});
