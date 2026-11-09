# Architecture

## Product

- App: `SeriesCreator`
- Live URL: https://seriescreator.haak3.de
- Repository: `https://github.com/ChristianHaake/SeriesCreator`
- Intended users: educators and learners creating fictional educational series
  concepts without account setup

## Stack

SeriesCreator uses React, TypeScript, Vite, `react-markdown`, `remark-gfm`, and
`lucide-react`. The app is deployed as static Cloudflare Workers Assets with SPA
fallback configured in `wrangler.jsonc`.

## Source structure

- `src/components`: application shell, editor, preview, print, and presentation
  components.
- `src/domain`: validation, project codec, bundled examples, and shared limits.
- `src/i18n`: locale context, provider, hook, and dictionaries.
- `src/content`: bundled Markdown pages for help, privacy, legal, educator, and
  responsible-use content.
- `src/store`: local project state and persistence.

## State

The active project is owned by `useProjectStore`. It autosaves to
`localStorage` under `series_creator_data`; the locale is stored under
`series-creator-locale`. Debounced writes flush on `pagehide` and when the document
becomes hidden. Storage access is optional, including a throwing getter. Reset
removes the recovery copy under `series_creator_data.unreadable`.

A changed stored snapshot or storage event pauses automatic writes in a stale
tab and exposes a conflict warning; it never replaces that tab's unsaved state.
Confirmed reset/import explicitly replaces the stored draft. This is conflict
detection, not collaborative editing: localStorage has no atomic compare-and-set.

Persisted project schema version: `3`. Schema-1 and schema-2 projects and
legacy JSON without `schemaVersion` are normalized forward, including missing
optional episode learning depth and content blocks. Future schema versions are
rejected without replacing the current project. Reset restores
`initialProjectData`.

## Project files

Editable backups use:

- extension: `.seriescreator`
- media type: `application/json`
- schema version: `3`
- import limit: 25 MB
- image upload limit: PNG, JPG/JPEG or WebP, at most 25 MB and 60 megapixels
- image output bounds: cover up to 1920 × 1920 px; episode images up to 800 × 800 px, preserving aspect ratio and reducing further to fit the 1,500,000-character data-URL limit
- structure limits: 1 to 20 seasons, up to 100 episodes per season

Imports are treated as untrusted input. A project replaces state only after full
runtime validation and normalization. JSON parsing and normalization run in a
dedicated module worker so valid but large project files do not block the editor;
older environments fall back to the same validated codec on the main thread.

The serialized `author` field is editable in the project information step and
is used in preview metadata and presentation credits. See
`docs/project-file-format.md` for the complete schema contract.

## Bundled examples

The app ships with school-themed climate and history examples. Loading one is a
state replacement guarded by confirmation, just like reset/import risk paths.
The examples intentionally exercise seasons, episode ordering, academic
deepening, text and image content blocks, reflection, sources, presentation,
HTML export, PDF/print, project-file export, social copy and image-generation
prompts.

The same examples are generated as importable `.seriescreator` files in
`examples/` via `npm run build:examples`. These artifacts embed generated cover
and episode JPEGs as data URLs and must parse through the normal project import
codec.

## Network and privacy

The app core has no account system, backend API, database, or server-side user
content storage. User-created content stays in the browser unless the user
downloads or shares an exported file. Production requests include the
Cloudflare-hosted app origin and Cloudflare Web Analytics endpoints declared in
`public/_headers`; users can also open outbound footer links.

## Deployment

- Cloudflare product: Workers Assets
- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: `not_found_handling: "single-page-application"`
- Security headers: `public/_headers`
- Cache policy: HTML and example assets revalidate; fingerprinted build assets are immutable

## Output safety

Image content blocks without nonblank alternative text remain editable and can
be saved in project backups, but presentation, HTML export and print require
those descriptions. Native print shows a recovery instruction instead of
incomplete content. The print tree is mounted synchronously for print media or
`beforeprint` and removed after printing, keeping it out of the editing DOM.

Pending image uploads are ignored after editor unmount/project replacement.
Image blocks append through the latest store state rather than captured arrays.
Closing the example gallery or confirming a later reset/import invalidates a
pending example load.

## Verification

- Vitest covers codec, persistence, examples, export mapping and component
  behavior.
- Playwright runs the production build in Chromium, Firefox, WebKit and Mobile
  Chrome and covers the primary workflow, portable downloads, presentation,
  direct content routes, touch behavior and 320 px responsive behavior.
- `scripts/smoke-production.mjs` verifies the live public routes and central
  security headers.
- GitHub Actions runs `npm run verify` on Node.js 22.23.3 (the supported minimum is 22.13 for ESLint/jsdom).

## Decisions and exceptions

See `docs/standard-conformance.md`.
