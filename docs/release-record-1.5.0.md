# Release record 1.5.0

Companion to `docs/manual-release-checks.md`. Records what was verified, by
what means, and which limitations are accepted for this release.

- **Version:** 1.5.0
- **Date:** 2026-08-30
- **Review:** Claude Opus 5 (automated), sign-off Christian Haake
- **Commit:** filled in at tag time

## Environment

| Component | Version |
| --- | --- |
| macOS | 26.5.2 (arm64) |
| Node.js | 26.7.0 |
| Playwright | 1.61.0 |
| Chromium (Chrome for Testing) | 149.0.7827.55 |
| Firefox | 151.0 |
| WebKit | 26.5 |
| Mobile emulation | Pixel 7 (Playwright device profile) |
| Safari.app (manual passes) | 26.5.2 |

## Automated coverage

`npm run verify`: lint, typecheck, example generation, 46 unit tests,
production build, 99 end-to-end tests across Chromium, Firefox, WebKit and
mobile Chrome. Zero failures.

Beyond the functional suite, these checklist items are asserted by tests
rather than by hand:

- Print margins and dark-layout fills, by parsing the content streams of a
  real `Page.printToPDF` output (Chromium only — CDP is not available in the
  other engines).
- Accessibility violations on the editor, preview, confirmation dialog and
  example gallery, via axe.
- Tap target sizes and on-screen keyboard behaviour, on a touch viewport.
- Project round-trip of text, images, order and locale.

## Manual checks

### Verified

| Check | Result |
| --- | --- |
| 320 px and 390 px phone widths | No horizontal scroll, no clipped actions |
| Tablet portrait 768×1024 and landscape 1024×768 | No overflow, editor usable |
| 200 % browser zoom | Emulated as halved viewports (640×400, 960×540, 683×384): no overflow, save, menu, editor and all three steps reachable |
| Reduced motion | `prefers-reduced-motion` honoured; transition duration 0 s, no animations |
| Contrast — editor, streaming preview, focus indicators | 20 colour pairs in both locales, all at or above WCAG AA |
| Keyboard-only | 31 controls in tab order; project fields, reorder controls, examples and presentation all reachable |
| Standalone HTML offline and by keyboard | Opens without network, arrow-key navigation works |
| Chrome desktop, full editor → save → HTML → print/PDF flow | Passes |
| Cloudflare Web Analytics vs privacy notice | Behaviour matches the notice |

### Open

| Check | Why it is still open |
| --- | --- |
| iPad Safari: editor, image upload, presentation, download, print | Needs the physical device. WebKit automation is an engine proxy, not proof of iPad behaviour. |
| VoiceOver or NVDA | Needs a human listening to the screen reader. |
| Safari desktop: save → HTML → print/PDF | Editor, dialog, presentation and routes were exercised in Safari.app; the download and print path was not. |
| Firefox desktop: full flow including print/PDF | Functional flow is covered by the Firefox e2e project; PDF readability is not, because the print assertions are CDP-only. |
| PDF readability in each target browser | Same reason: only Chromium output is machine-checked. |
| Long text and maximum-size projects | Limits are enforced and unit-tested; the visual result at the limit has not been reviewed by eye. |
| Operator reviewed imprint, privacy and terms | Operator decision, not an engineering one. |
| Production smoke on the final URL | Runs after deployment. |
| Final deployment serves the intended version and headers | Runs after deployment. The build now stamps `<meta name="app-version">` and the smoke test asserts it. |
| GitHub Actions release gate green on `stage` | The gate installed only Chromium and WebKit, so every Firefox test failed on a missing executable. Fixed in this release; needs one green run. |

## Accepted limitations

- Print output is machine-verified in Chromium only. Firefox and Safari print
  through the same stylesheet, but their rendering is unverified.
- The Cloudflare Web Analytics script shares an origin with locally stored
  project data (SBP-001 in `security_best_practices_report.md`). The residual
  risk is knowingly accepted; the alternative is removing analytics.
- SBP-002 through SBP-004 are fixed in the code and only count as closed for
  the live application once this release is deployed.
