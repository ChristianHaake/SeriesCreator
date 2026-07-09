# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-07-09

### Added
- **Cloudflare Web Analytics**: Anonymous, cookieless reach measurement (no fingerprinting, no cross-device profiles).
- **Locale-aware starter content**: A fresh project now uses German or English defaults based on the selected language.
- **Localized genre & age options**: Genre presets and FSK-style age ratings are now available in German and English.

### Changed
- **Header brand**: Replaced the raster logo with an inline SVG wordmark (crisp at any size, no asset dependency).
- **Privacy policy**: Expanded (DE/EN) with dedicated Cloudflare Web Analytics, international-transfer, and retention sections.
- **Social/SEO metadata**: Absolute Open Graph / Twitter Card URLs and a brand SVG favicon.
- **Content-Security-Policy**: Scoped to allow the analytics beacon (`script-src`/`connect-src` for Cloudflare Insights) while keeping the strict baseline.

### Fixed
- Corrected the header logo, which previously showed the wrong wordmark.
- Age-rating default now matches an available select option (no more silent value mismatch); legacy values are preserved.
- A failed `localStorage` save (e.g. quota exceeded) now surfaces a warning instead of losing work silently.

### Security
- Hardened image data-URL validation to reject any non-base64 payload, preventing injection into inline `background-image` values.
- Added an input-pixel cap on image uploads to guard against decompression-bomb tab crashes.

## [1.0.0] - 2026-06-29

### Added
- **Local-first Editor**: Browser-based environment to simulate streaming series projects without accounts or servers.
- **Project Structure**: Support for custom seasons, episodes, cast, genre, and age ratings.
- **Smart Image Scaling**: Automatic local downsizing for cover images (max 1920px) and episode thumbnails (max 800px).
- **Presentation Mode**: Fullscreen, interactive pitching interface with keyboard navigation.
- **Offline HTML Export**: Download presentations as a self-contained HTML file for offline playback on any device.
- **PDF Export**: Print or save the project overview via the browser's native print dialog.
- **Save & Load**: Export and import progress via `.seriescreator` files.
- **Bilingual**: Full German and English support.
