import { afterEach, describe, expect, it, vi } from 'vitest';
import { resourceLimits } from './constraints';
import { processImageUpload } from './imageUpload';

function pngHeader(width: number, height: number) {
  const bytes = new Uint8Array(24);
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82]);
  new DataView(bytes.buffer).setUint32(16, width);
  new DataView(bytes.buffer).setUint32(20, height);
  return bytes;
}

function imageFile(width = 2, height = 2) {
  return new File([pngHeader(width, height)], 'image.png', { type: 'image/png' });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('processImageUpload', () => {
  it('rejects files above the project file limit before reading them', async () => {
    const read = vi.spyOn(FileReader.prototype, 'readAsDataURL');
    const file = new File([new Uint8Array(resourceLimits.projectFileBytes + 1)], 'large.png', { type: 'image/png' });

    await expect(processImageUpload(file, 800, 0.7)).resolves.toEqual({ ok: false, error: 'imageErrorFileTooLarge' });
    expect(read).not.toHaveBeenCalled();
  });

  it('rejects oversized pixel dimensions from the file header before decoding', async () => {
    const imageConstructor = vi.fn();
    vi.stubGlobal('Image', imageConstructor);

    await expect(processImageUpload(imageFile(10_000, 10_000), 800, 0.7)).resolves.toEqual({ ok: false, error: 'imageErrorTooLarge' });
    expect(imageConstructor).not.toHaveBeenCalled();
  });

  it('reduces output dimensions until the encoded data URL is within its limit', async () => {
    vi.stubGlobal('Image', class {
      naturalWidth = 2000;
      naturalHeight = 1000;
      onload: (() => void) | null = null;
      set src(_value: string) { this.onload?.(); }
    });
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage } as unknown as CanvasRenderingContext2D);
    const toDataURL = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockReturnValueOnce(`data:image/jpeg;base64,${'A'.repeat(resourceLimits.dataUrlLength)}`)
      .mockReturnValueOnce('data:image/jpeg;base64,VALID');

    const result = await processImageUpload(imageFile(), 800, 0.7);

    expect(result).toEqual({ ok: true, url: 'data:image/jpeg;base64,VALID' });
    expect(toDataURL).toHaveBeenCalledTimes(2);
    expect(drawImage).toHaveBeenCalledTimes(2);
    expect(drawImage.mock.calls[1][3]).toBeLessThan(drawImage.mock.calls[0][3]);
  });

  it('returns read and decode failures as upload errors', async () => {
    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function (this: FileReader) {
      this.dispatchEvent(new ProgressEvent('error'));
    });
    await expect(processImageUpload(imageFile(), 800, 0.7)).resolves.toEqual({ ok: false, error: 'imageErrorRead' });

    vi.restoreAllMocks();
    vi.stubGlobal('Image', class {
      naturalWidth = 2;
      naturalHeight = 2;
      onerror: (() => void) | null = null;
      set src(_value: string) { this.onerror?.(); }
    });
    await expect(processImageUpload(imageFile(), 800, 0.7)).resolves.toEqual({ ok: false, error: 'imageErrorProcess' });
  });
});
