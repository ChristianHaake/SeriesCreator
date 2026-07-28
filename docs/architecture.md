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
`series-creator-locale`.

Persisted project schema version: `1`. Legacy JSON without `schemaVersion` is
accepted only after normalization. Future schema versions are rejected without
replacing the current project. Reset restores `initialProjectData`.

## Project files

Editable backups use:

- extension: `.seriescreator`
- media type: `application/json`
- schema version: `1`
- import limit: 25 MB
- image upload limit: PNG, JPG/JPEG or WebP with at most 60 megapixels
- image output width: cover up to 1920 px; episode images up to 800 px
- structure limits: 1 to 20 seasons, up to 100 episodes per season

Imports are treated as untrusted input. A project replaces state only after full
runtime validation and normalization.

The serialized `author` field is editable in the project information step and
is used in preview metadata and presentation credits. See
`docs/project-file-format.md` for the complete schema contract.

## Bundled examples

The app ships with school-themed climate and history examples. Loading one is a
state replacement guarded by confirmation, just like reset/import risk paths.
The examples intentionally exercise seasons, episode ordering, reflection,
sources, presentation, HTML export, PDF/print, project-file export, social copy,
and image-generation prompts.

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
- Cache policy: HTML revalidates; fingerprinted and example assets are immutable

## Verification

- Vitest covers codec, persistence, examples, export mapping and component
  behavior.
- Playwright runs the production build in Chromium and WebKit and covers the
  primary workflow, portable downloads, presentation, direct content routes and
  320 px responsive behavior.
- `scripts/smoke-production.mjs` verifies the live public routes and central
  security headers.
- GitHub Actions runs `npm run verify` on Node.js 22.12.

## Decisions and exceptions

See `docs/standard-conformance.md`.
