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

## Manual checks

Use `docs/manual-release-checks.md` to record target devices, assistive
technology, exports, legal review and final production smoke results here.

## Accepted limitations

Add only limitations explicitly accepted for the 2.0.0 release.
