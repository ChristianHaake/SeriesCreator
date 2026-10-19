import { describe, expect, it } from 'vitest';
import { isImageWithinPixelLimit, parseImageDataUrlDimensions } from './imageDimensions';

function pngDataUrl(width: number, height: number) {
  const bytes = new Uint8Array(24);
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82]);
  bytes.set([(width >>> 24) & 255, (width >>> 16) & 255, (width >>> 8) & 255, width & 255], 16);
  bytes.set([(height >>> 24) & 255, (height >>> 16) & 255, (height >>> 8) & 255, height & 255], 20);
  return `data:image/png;base64,${btoa(String.fromCharCode(...bytes))}`;
}

function dataUrl(type: string, bytes: number[]) {
  return `data:image/${type};base64,${btoa(String.fromCharCode(...bytes))}`;
}

describe('image dimension headers', () => {
  it('reads PNG dimensions without decoding the image', () => {
    expect(parseImageDataUrlDimensions(pngDataUrl(10_000, 6_000))).toEqual({ width: 10_000, height: 6_000 });
  });

  it('reads JPEG and WebP container dimensions', () => {
    const jpeg = dataUrl('jpeg', [
      255, 216, 255, 224, 0, 4, 0, 0,
      255, 192, 0, 8, 8, 0, 2, 0, 3, 1, 17, 0, 255, 217,
    ]);
    const webp = dataUrl('webp', [
      82, 73, 70, 70, 22, 0, 0, 0, 87, 69, 66, 80,
      86, 80, 56, 88, 10, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0,
    ]);

    expect(parseImageDataUrlDimensions(jpeg)).toEqual({ width: 3, height: 2 });
    expect(parseImageDataUrlDimensions(webp)).toEqual({ width: 3, height: 2 });
  });

  it('rejects malformed headers and avoids pixel multiplication overflow', () => {
    expect(parseImageDataUrlDimensions('data:image/png;base64,AAAA')).toBeNull();
    expect(isImageWithinPixelLimit({ width: 10_000, height: 6_000 }, 60_000_000)).toBe(true);
    expect(isImageWithinPixelLimit({ width: 10_000, height: 6_001 }, 60_000_000)).toBe(false);
  });
});
