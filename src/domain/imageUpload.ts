import { resourceLimits } from './constraints';
import { isImageWithinPixelLimit, parseImageDataUrlDimensions } from './imageDimensions';

export type ImageUploadError = 'imageErrorUnsupported' | 'imageErrorFileTooLarge' | 'imageErrorRead' | 'imageErrorTooLarge' | 'imageErrorProcess';
type ImageUploadResult = { ok: true; url: string } | { ok: false; error: ImageUploadError };

export async function processImageUpload(file: File, outputWidth: number, quality: number): Promise<ImageUploadResult> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return { ok: false, error: 'imageErrorUnsupported' };
  if (file.size > resourceLimits.projectFileBytes) return { ok: false, error: 'imageErrorFileTooLarge' };

  let source: string;
  try {
    source = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject();
      reader.onerror = () => reject();
      reader.onabort = () => reject();
      reader.readAsDataURL(file);
    });
  } catch {
    return { ok: false, error: 'imageErrorRead' };
  }

  const dimensions = parseImageDataUrlDimensions(source);
  if (!dimensions) return { ok: false, error: 'imageErrorProcess' };
  if (!isImageWithinPixelLimit(dimensions, resourceLimits.maxImageInputPixels)) return { ok: false, error: 'imageErrorTooLarge' };

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject();
      image.src = source;
    });
    if (!isImageWithinPixelLimit({ width: image.naturalWidth, height: image.naturalHeight }, resourceLimits.maxImageInputPixels)) {
      return { ok: false, error: 'imageErrorTooLarge' };
    }
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return { ok: false, error: 'imageErrorProcess' };
    // Bound both dimensions so tall images cannot exceed browser canvas limits.
    let scale = Math.min(1, outputWidth / image.naturalWidth, outputWidth / image.naturalHeight);
    while (true) {
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/jpeg', quality);
      if (!url.startsWith('data:image/jpeg;base64,')) return { ok: false, error: 'imageErrorProcess' };
      if (url.length <= resourceLimits.dataUrlLength) return { ok: true, url };
      if (canvas.width === 1 && canvas.height === 1) return { ok: false, error: 'imageErrorProcess' };
      scale *= 0.8;
    }
  } catch {
    return { ok: false, error: 'imageErrorProcess' };
  }
}
