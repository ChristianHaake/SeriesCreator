# Release record 2.0.0

Companion to `docs/manual-release-checks.md`. This record collects the
evidence and accepted limitations for the 2.0.0 release. It is intentionally
incomplete until the release candidate has passed its automated and manual
checks.

- **Version:** 2.0.0
- **Status:** in preparation
- **Date:** open
- **Review:** open
- **Commit:** filled in at tag time

## Scope

- Ordered text and image content blocks in episodes, including their outputs.
- Season-preserving presentation and standalone HTML views.
- Expanded German and English example projects that demonstrate content blocks
  in the gallery and importable project files.
- haak3 `1.1.0-draft` application shell and responsive editor/preview workflow;
  the dark streaming preview remains product-specific.
- Complete interface, content pages, start text, examples and output labels in
  German, English, French, Spanish and Dutch. Two importable examples per language.
- Direct `/beispiele` route and in-place navigation that preserves drafts even
  when local storage is unavailable.
- Accessible episode reordering with a verified live status announcement.

## Automated coverage

On 2026-10-19, `npm run verify` passed linting, type checking, example
generation, 63 unit tests and the production build. Browser tests passed in
Chromium (35 tests) and WebKit (33 tests; its two Chromium-only print checks
are intentionally skipped).

Firefox could not start in the local macOS sandbox: the operating system denied
`plugin-container.app`, after which Firefox timed out while mapping its software
compositor. Run the Firefox project in CI or on an unrestricted local machine
before release; this result does not establish browser compatibility.

On 2026-11-09, audit corrections passed lint, typecheck, example generation,
84 unit/component tests and the production build on Node 22.23.3. Chromium
passed 41 browser tests, WebKit passed 39 (two CDP-only PDF tests skipped), and
Mobile Chrome passed four. A fresh isolated npm ci and full dependency audit
passed with zero known vulnerabilities. Firefox still fails before application
startup in the local macOS environment; no Firefox pass is claimed. See
`audit-fixes-2026-11-09.md` for the changes, evidence and remaining limits.

On 2026-11-26, the redesign checkout passed `npm run lint`,
`npm run typecheck`, `npm run build:examples` (ten valid project files),
`npm test` (89 tests), `npm run build`, and `npm audit --audit-level=low`
(zero reported vulnerabilities). Playwright passed 106 tests in Chromium,
WebKit and Mobile Chrome; two WebKit PDF pixel checks are intentionally
skipped because they require Chromium CDP. The five-language editor,
examples and content pages passed axe checks in Chromium and WebKit.
Automated viewport checks covered 320, 360, 390, 768 and 1440 CSS pixels.
Local screenshots at 320, 768 and 1440 pixels were visually reviewed.

The full `npm run test:e2e` was attempted. Firefox timed out before app
startup with the local macOS `plugin-container.app` permission error and a
software-compositor mapping failure, as documented previously; Firefox
application behavior is therefore unverified here. Run the Firefox project
in CI or an unrestricted environment before release. The build currently
reports a size advisory for the 500.45 kB main JS chunk (155.26 kB gzip);
the build succeeds.

The follow-up implementation for issues #55–#58 adds the feedback route on
help/support in every language, renders existing statuses and editor errors in
the current locale, and preserves accented letters in export filenames. It
also uses the selected language for untitled imported episodes. Local checks
passed lint, typecheck, example generation, 93 unit tests, build, and dependency
audit (zero reported vulnerabilities). Playwright passed 106 tests in Chromium,
WebKit and Mobile Chrome; the two WebKit CDP-only PDF pixel checks remain
skipped. Wrangler accepted the Stage configuration in a dry run. Stage has not
yet been deployed or smoke-tested. The reviewed source commit and deployed
Worker version still need recording here.

## Manual checks

Use `docs/manual-release-checks.md` to record target devices, assistive
technology, exports, legal review and final production smoke results here.

The redesign candidate still needs a documented Stage URL, actual smartphone
and tablet checks, manual Safari/Firefox print checks, screenreader checks,
operator review of all legal translations, and a named rollback commit/artifact
with its compatible project-file and local-storage path. Production deployment
is not approved by the automated results alone.

## Accepted limitations

Add only limitations explicitly accepted for the 2.0.0 release.
