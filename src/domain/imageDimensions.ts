export interface ImageDimensions {
  width: number;
  height: number;
}

function readU16(bytes: Uint8Array, offset: number) {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function readU24LittleEndian(bytes: Uint8Array, offset: number) {
  return bytes[offset] + (bytes[offset + 1] << 8) + (bytes[offset + 2] << 16);
}

function readU32(bytes: Uint8Array, offset: number) {
  return bytes[offset] * 0x1000000 + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3];
}

function readU32LittleEndian(bytes: Uint8Array, offset: number) {
  return bytes[offset] + bytes[offset + 1] * 0x100 + bytes[offset + 2] * 0x10000 + bytes[offset + 3] * 0x1000000;
}

function valid(width: number, height: number): ImageDimensions | null {
  return Number.isInteger(width) && Number.isInteger(height) && width > 0 && height > 0
    ? { width, height }
    : null;
}

function parsePng(bytes: Uint8Array) {
  if (bytes.length < 24 || ![137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)) return null;
  if (readU32(bytes, 8) !== 13 || String.fromCharCode(...bytes.slice(12, 16)) !== 'IHDR') return null;
  return valid(readU32(bytes, 16), readU32(bytes, 20));
}

function parseJpeg(bytes: Uint8Array) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset++] !== 0xff) return null;
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset++];
    if (marker === 0xd9 || marker === 0xda || marker === undefined) return null;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > bytes.length) return null;
    const length = readU16(bytes, offset);
    if (length < 2 || offset + length > bytes.length) return null;
    const isStartOfFrame = (marker >= 0xc0 && marker <= 0xc3)
      || (marker >= 0xc5 && marker <= 0xc7)
      || (marker >= 0xc9 && marker <= 0xcb)
      || (marker >= 0xcd && marker <= 0xcf);
    if (isStartOfFrame) {
      if (length < 8) return null;
      return valid(readU16(bytes, offset + 5), readU16(bytes, offset + 3));
    }
    offset += length;
  }
  return null;
}

function parseWebp(bytes: Uint8Array) {
  if (bytes.length < 20 || String.fromCharCode(...bytes.slice(0, 4)) !== 'RIFF' || String.fromCharCode(...bytes.slice(8, 12)) !== 'WEBP') return null;
  if (readU32LittleEndian(bytes, 4) + 8 > bytes.length) return null;
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const type = String.fromCharCode(...bytes.slice(offset, offset + 4));
    const size = readU32LittleEndian(bytes, offset + 4);
    const data = offset + 8;
    const end = data + size;
    if (end > bytes.length) return null;
    if (type === 'VP8X' && size >= 10) return valid(readU24LittleEndian(bytes, data + 4) + 1, readU24LittleEndian(bytes, data + 7) + 1);
    if (type === 'VP8 ' && size >= 10 && bytes[data + 3] === 0x9d && bytes[data + 4] === 0x01 && bytes[data + 5] === 0x2a) {
      return valid(readU16(bytes, data + 6) & 0x3fff, readU16(bytes, data + 8) & 0x3fff);
    }
    if (type === 'VP8L' && size >= 5 && bytes[data] === 0x2f) {
      const packed = bytes[data + 1] | (bytes[data + 2] << 8) | (bytes[data + 3] << 16) | (bytes[data + 4] << 24);
      return valid((packed & 0x3fff) + 1, ((packed >> 14) & 0x3fff) + 1);
    }
    offset = end + (size % 2);
  }
  return null;
}

/** Reads only image container headers; it never invokes an image decoder. */
export function parseImageDataUrlDimensions(dataUrl: string): ImageDimensions | null {
  const match = /^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/]+={0,2})$/i.exec(dataUrl);
  if (!match) return null;
  try {
    const binary = atob(match[2]);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const type = match[1].toLowerCase();
    if (type === 'png') return parsePng(bytes);
    if (type === 'jpeg' || type === 'jpg') return parseJpeg(bytes);
    return parseWebp(bytes);
  } catch {
    return null;
  }
}

export function isImageWithinPixelLimit({ width, height }: ImageDimensions, limit: number) {
  return width <= Math.floor(limit / height);
}
