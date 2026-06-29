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
- `src/domain`: validation, project codec, and shared limits.
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
- import limit: 2 MB
- image upload limit: PNG, JPG/JPEG, WebP up to 5 MB and 4096 px per edge
- structure limits: 1 to 20 seasons, up to 100 episodes per season

Imports are treated as untrusted input. A project replaces state only after full
runtime validation and normalization.

## Network and privacy

The app core has no account system, backend API, database, or server-side user
content storage. User-created content stays in the browser unless the user
downloads or shares an exported file. Production network destinations are the
Cloudflare-hosted app origin and outbound links opened by the user.

## Deployment

- Cloudflare product: Workers Assets
- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: `not_found_handling: "single-page-application"`
- Security headers: `public/_headers`
- Cache policy: HTML revalidates; fingerprinted assets are immutable

## Decisions and exceptions

See `docs/standard-conformance.md`.
