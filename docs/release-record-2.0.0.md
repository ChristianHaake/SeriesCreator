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
application behavior is therefore unverified locally. The later CI run below
verifies Firefox. The build reports a size advisory for the 502.84 kB main
JS chunk (155.89 kB gzip); the build succeeds.

The follow-up implementation for issues #55–#58 adds the feedback route on
help/support in every language, renders existing statuses and editor errors in
the current locale, and preserves accented letters in export filenames. It
also uses the selected language for untitled imported episodes. Local checks
passed lint, typecheck, example generation, 93 unit tests, build, and dependency
audit (zero reported vulnerabilities). Playwright passed 106 tests in Chromium,
WebKit and Mobile Chrome; the two WebKit CDP-only PDF pixel checks remain
skipped. Wrangler accepted the Stage configuration in a dry run. The Stage
deployment and smoke results are recorded below.

## Stage candidate and rollback

- **Stage URL:** `https://stage.seriescreator.haak3.de/`
- **Source commit:** `ce9a3dfe134bc114c4d1a9c7d1b108b427304d1b`
- **Stage Worker version:** `e15920b7-2adb-4b02-8a99-74b2bc6250f7`
- **Stage smoke:** all ten direct routes, root security headers, example image
  and the exact commit marker passed on 2026-11-26.
- **Stage browser regression:** 108 passed in Chromium, WebKit and Mobile
  Chrome; two WebKit PDF pixel tests skipped by design. The suite covered all
  five locales, help, examples, statuses, errors and export artifacts.
- **CI:** [Verification run 90](https://github.com/ChristianHaake/SeriesCreator/actions/runs/45901885827)
  passed on Node 22.23.3: 93 unit tests, 159 browser tests including Firefox,
  four intentional skips, build and dependency audit.
- **Rollback artifact:** the pre-redesign production Worker version
  `0c8c949a-e7ac-4071-966a-88f4fa961dd0` was observed at 100% on
  2026-11-26. The prior source baseline is `1a269d506387567055505be3a199f8bffe368cea`.
  Both source baselines use project schema 3 and `series_creator_data`; the
  locale key remains `series-creator-locale`. Reconfirm the production Worker
  version immediately before a future production deployment.

The newly created Stage domain resolved through public DNS, but the local
macOS resolver returned `ENOTFOUND` during this run. The smoke assertions ran
with a process-only DNS override; the browser suite used a temporary local
HTTPS proxy forwarding unmodified Stage responses. The Stage artifact and
security headers were checked directly through Cloudflare. A direct browser
walkthrough on the public Stage URL remains open.

## Manual checks

Use `docs/manual-release-checks.md` to record target devices, assistive
technology, exports, legal review and final production smoke results here.

The redesign candidate still needs actual smartphone and tablet checks,
manual Safari/Firefox print checks, screenreader and zoom checks, a direct
Stage browser walkthrough, native-language review of all five translations,
operator review of all legal translations, and PR review. Zero of five
language versions have completed the manual release review. Production
deployment is not approved by the automated results alone.

## Accepted limitations

Add only limitations explicitly accepted for the 2.0.0 release.
