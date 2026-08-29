import { expect, type Page } from '@playwright/test';

/**
 * Click a header action, opening the overflow menu first when the viewport is
 * below the breakpoint. All seven actions only fit on one line from 1440px, so
 * at common laptop widths most of them live behind the menu — exactly as a
 * student would reach them.
 */
export async function clickHeaderAction(page: Page, name: string) {
  const toggle = page.locator('.header-actions__toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(page.locator('#header-actions-menu')).toBeVisible();
  }
  await page.getByRole('button', { name, exact: true }).click();
}
