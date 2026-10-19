import zlib from 'node:zlib';
import { expect, test } from '@playwright/test';
import { clickHeaderAction } from './helpers';

// Playwright's page.pdf() injects its own margins and ignores CSS @page, so the
// margin rule cannot be checked through it. Raw CDP with no margin parameters
// honours the stylesheet, which is what a student's print dialog does too.
test.skip(({ browserName }) => browserName !== 'chromium', 'Page.printToPDF is CDP-only');

const A4_WIDTH_PT = 595.276;
const PT_PER_CM = 28.3465;

/** Decompressed content stream of each page. */
function contentStreams(pdf: Buffer): string[] {
  const streams: string[] = [];
  let index = 0;
  while ((index = pdf.indexOf('stream', index)) !== -1) {
    let start = index + 'stream'.length;
    if (pdf[start] === 0x0d) start += 1;
    if (pdf[start] === 0x0a) start += 1;
    const end = pdf.indexOf('endstream', start);
    if (end === -1) break;
    try {
      streams.push(zlib.inflateSync(pdf.subarray(start, end)).toString('latin1'));
    } catch {
      // Not a deflate stream (fonts, images); skip it.
    }
    index = end + 'endstream'.length;
  }
  return streams;
}

const rectangles = (stream: string) =>
  [...stream.matchAll(/([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) re/g)]
    .map((m) => ({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] }));

/** Greyscale fill values used on the page, as numbers. */
const greyFills = (stream: string) =>
  [...stream.matchAll(/([\d.]+) ([\d.]+) ([\d.]+) rg/g)]
    .filter((m) => m[1] === m[2] && m[2] === m[3])
    .map((m) => parseFloat(m[1]));

async function printExample(page: import('@playwright/test').Page) {
  await page.goto('/');
  await clickHeaderAction(page, 'Examples');
  await page.getByRole('dialog').getByRole('button', { name: 'Use example' }).first().click();
  await page.locator('dialog.confirm-dialog').getByRole('button', { name: 'Load example' }).click();
  await expect(page.locator('.streaming-title')).toHaveText('The School Climate Code');
  await expect(page.locator('.episode-card__image').first()).toBeVisible();

  const cdp = await page.context().newCDPSession(page);
  // No margin parameters, so @page decides. printBackground defaults to false —
  // the same state a student's print dialog starts in.
  const { data } = await cdp.send('Page.printToPDF', { preferCSSPageSize: true });
  return Buffer.from(data, 'base64');
}

test('prints every page with the margin the stylesheet asks for', async ({ page }) => {
  const pdf = await printExample(page);
  const pages = contentStreams(pdf)
    .map(rectangles)
    .filter((rects) => rects.length > 0)
    // The largest rectangle on a page is its clip box; its origin is the margin.
    .map((rects) => rects.reduce((a, b) => (a.w * a.h >= b.w * b.h ? a : b)));

  expect(pages.length).toBeGreaterThan(1);

  for (const [index, clip] of pages.entries()) {
    // Self-calibrating: the clip plus its two margins spans the full page, so
    // the PDF's internal scale can be derived rather than hard-coded.
    const unitsPerPt = (clip.w + clip.x * 2) / A4_WIDTH_PT;
    const marginCm = clip.x / unitsPerPt / PT_PER_CM;
    expect(marginCm, `page ${index + 1} left margin`).toBeGreaterThan(1.8);
    expect(marginCm, `page ${index + 1} left margin`).toBeLessThan(2.2);
    // Pages after the first are the regression: container padding applies once,
    // so only a real @page margin reaches them.
    expect(clip.y, `page ${index + 1} top margin`).toBeGreaterThan(0);
  }
});

test('prints the dark layout even with background graphics turned off', async ({ page }) => {
  const pdf = await printExample(page);
  const pages = contentStreams(pdf).filter((s) => rectangles(s).length > 0);

  expect(pages.length).toBeGreaterThan(1);

  for (const [index, stream] of pages.entries()) {
    // Without print-color-adjust: exact the dark fills are dropped and the white
    // body text prints onto blank paper.
    const darkest = Math.min(...greyFills(stream), 1);
    expect(darkest, `page ${index + 1} should carry a dark fill`).toBeLessThan(0.2);
  }
});
