# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-07-21

### Added
- **In-app example gallery**: Added complete climate and Weimar classroom projects that load directly into the editor, preview, presentation, PDF, HTML, and project-file workflows.
- **Example material kit**: Each in-app example includes social media copy, hashtags, alt text, and image-generation prompts in the reusable project data.
- **Importable example files**: Added generated `.seriescreator` files in `examples/` for direct loading through the app's normal import flow.
- **Example visuals**: Added AI-generated cover and episode images to the example project files as embedded JPEG data URLs.
- **Example loading flow**: Added a guarded "Use example" action that replaces the current draft only after confirmation and uses the same project state as normal user work.

### Fixed
- **Print/PDF layout**: Print output no longer inherits the clipped app shell layout. Generated PDFs start at the page top and include episode cards instead of cropping after the hero area.
- **File input accessibility**: Hidden import, cover, and thumbnail file inputs now have explicit accessible names.
- **Release copy drift**: About/help/release documentation now describes SeriesCreator's streaming-series workflow instead of stale social-media creator wording.

### Verification
- `npm run verify` passes with lint, typecheck, tests, and production build.
- Browser PDF smoke confirms an A4 PDF with title and episode text.
- Browser DOM accessibility smoke confirms all relevant form controls have accessible names.

## [1.2.0] - 2026-07-17

### Changed
- **Accessibility**: Every editor field label is now associated with its control (`htmlFor`/`id`); season `<select>`s have `aria-label`; preview tabs are wired to their panels (`role=tabpanel`, `aria-controls`, `aria-labelledby`).
- **Export filenames**: `.seriescreator` and HTML export share one filename sanitizer — umlauts are kept (previously mangled to underscores in the HTML export), whitespace collapsed, 60-char cap.
- **Responsive layout**: Footer and navigation wrap on narrow viewports instead of clipping.

### Removed
- Dropped unused schema fields with no UI or read path (`Episode.notes`, `Episode.duration`, `ProjectData.subject`/`topic`/`learningObjectives`). Legacy imports carrying these keys now discard them instead of round-tripping them; in-app completion scoring is unchanged.

### Security
- **Content-Security-Policy**: Removed `'unsafe-inline'` from `style-src`. React's inline `style` props go through the CSSOM, not CSP-governed attributes, so the exception was unnecessary; verified empirically across editor, preview, presentation mode, and content routes.

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
