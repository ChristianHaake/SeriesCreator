# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2026-08-30

### Added

- Full-size episode editor in a native dialog with a live preview card, so
  writing an episode is no longer confined to the narrow sidebar column.
- Compact episode rows in the sidebar with reorder and delete controls.
- Overflow menu for secondary header actions built on the native Popover API.
  Save stays outside the menu and is always reachable.
- Error boundary with localized recovery copy, replacing the blank page a
  render failure used to leave behind.
- Corrupt-save protection: an unreadable stored project is copied to
  `series_creator_data.unreadable` and the first autosave is suppressed, so a
  student's only copy is no longer overwritten within half a second of load.
- Skip link, editor landmark and labelled preview region for keyboard and
  screen-reader users.
- Slide counter in presentation mode, announced to assistive technology.
- Explicit not-found handling for unknown routes.
- Localized import error messages. Validation returns stable error codes that
  survive the worker boundary and are translated in the UI.
- Automated accessibility (axe), touch and print/PDF test suites, plus a
  mobile Playwright project running on a Pixel 7 viewport.

### Changed

- Project import validation runs in a module worker, keeping large or
  malformed files off the main thread (SBP-004).
- Content pages load as a lazy chunk, keeping the editor bundle small.
- Header actions collapse into the overflow menu below 1440 px, the width the
  full toolbar needs in the longer German labels.
- `New / Clear` moved to the end of the action list, after the non-destructive
  actions.
- Episode rows show the episode summary instead of character counts.
- Blocking `window.confirm` and `window.alert` replaced by an in-app dialog;
  image upload problems are reported inline instead of interrupting.
- Standalone HTML export uses a nonce-based content security policy and no
  inline event handler (SBP-002).
- Deployment headers and the production smoke test now assert concrete header
  values (SBP-003).

### Fixed

- Printing produced white text on blank paper whenever background graphics
  were off, which is the default state of the browser print dialog.
  `print-color-adjust: exact` keeps the dark layout intact.
- The 2 cm page margin only applied to the first page; container padding was
  standing in for a real `@page` margin.
- The print layout was rendered into the app shell, duplicating every episode
  for assistive technology and forcing horizontal scrolling at 375 px.
- Header actions wrapped into seven stacked rows on desktop.
- The overflow menu stayed open after an action was chosen, so dialogs opened
  behind it.
- Space advanced two presentation slides at once and scrolled the page.
- Focus restore in the example gallery raced with its own timer.
- Example image attachment requested a `-undefined.jpg` thumbnail when a
  project had no bundled images.
- Long student-supplied words overflowed titles and cards instead of wrapping.
- Contrast failures on the light editor surface and the dark preview surface,
  including link, accent and secondary text colours.

### Removed

- The inline episode editor, replaced by the dialog editor.

### Verification

- `npm run verify` passes: lint, typecheck, example generation, 46 unit tests,
  production build and 99 end-to-end tests across Chromium, Firefox, WebKit
  and mobile Chrome.
- Print margins and dark-layout fills are asserted by parsing real PDF content
  streams, replacing the former manual print check.
- Manual device, screen-reader and legal checks remain open; see the release
  record for accepted limitations.

## [1.4.0] - 2026-08-22

### Added

- Canonical release feature specification with acceptance criteria, technical
  limits and explicit non-goals.
- Dedicated 1200×630 Open Graph and Twitter preview image plus a 180 px touch
  icon, with image dimensions and alternative text in the social metadata.
- `robots.txt` for the public site.
- Versioned project-file format documentation and a separate manual release
  checklist.
- Production-preview E2E coverage in Chromium and WebKit for the primary
  editing, project export, HTML export, presentation, direct-route and 320 px
  workflows.
- GitHub Actions release gate, pinned Node.js version and production smoke
  command for public routes and security headers.
- Editable project author field, carried into preview, print and presentation
  credits.

### Changed

- README, UI concept, architecture and release review now describe the
  implemented SeriesCreator product instead of the former MVP concept.
- `npm run verify` now includes the production browser suite.
- Example assets now receive the same immutable cache policy as fingerprinted
  build assets.
- Example images now carry a visible `KI-generiert` marker so AI-generated
  classroom material is recognisable in the app, the exports and the
  importable example files.

### Fixed

- The editor now enforces the documented limits of 20 seasons and 100 episodes
  per season instead of allowing projects that its own import codec rejects.
- Presentation, print and standalone HTML use episode alternative text instead
  of generic thumbnail labels.
- Social metadata now describes the actual fictional-series workflow without
  claiming unsupported output types.

### Removed

- Unreferenced historical design screenshots, unused public logo/icon assets
  and local-only Claude launch and permission settings.
- The redundant project plan; current scope lives in `docs/features.md` and
  release criteria in `docs/review-checklist.md`.
- The 805 kB square logo that served as favicon, touch icon and social preview
  at once; purpose-built assets replace it and shrink the deployed bundle from
  2.5 MB to 1.8 MB.

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
