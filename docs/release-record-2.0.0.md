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

## Manual checks

Use `docs/manual-release-checks.md` to record target devices, assistive
technology, exports, legal review and final production smoke results here.

## Accepted limitations

Add only limitations explicitly accepted for the 2.0.0 release.
