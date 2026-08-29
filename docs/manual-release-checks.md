# Manual release checks

Automated tests reduce regressions, but they do not replace target-device,
assistive-technology, legal or final production review.

## Target browsers and devices

- [ ] Chrome desktop: complete editor → save → HTML → print/PDF flow
- [ ] Firefox desktop: complete editor → save → HTML → print/PDF flow
- [ ] Safari desktop: complete editor → save → HTML → print/PDF flow
- [ ] iPad Safari: editor, image upload, presentation, download and print/PDF
- [ ] 320 px and 390 px phone widths: no horizontal page scroll or clipped actions
- [ ] Tablet portrait and landscape: editor/preview flow remains usable

WebKit automation is a Safari-engine proxy. It is not proof of Safari.app or
iPad behavior.

## Accessibility

- [ ] Keyboard-only: all project fields, reorder controls, examples and presentation
- [ ] VoiceOver or NVDA: labels, live status, dialog focus and dynamic editor changes
- [ ] 200-% browser zoom: no loss of content or controls
- [ ] Reduced motion enabled: no unnecessary movement
- [ ] Contrast checked for editor, streaming preview and focus indicators

## Export artifacts

- [ ] Project round-trip preserves text, images, order and locale
- [ ] Standalone HTML opens offline and navigates by keyboard
- [ ] PDF title, episodes, images and page breaks are readable in each target browser
- [ ] Long text and maximum-size projects do not clip essential content

## Legal and production

- [ ] Operator reviewed imprint, privacy and terms
- [ ] Production smoke passes on the final URL
- [ ] Cloudflare Web Analytics behavior matches the privacy notice
- [ ] Final deployment serves the intended version and current security headers

Record device/browser versions, reviewer, date and accepted limitations in a
release record next to this file, one per version. `release-record-1.5.0.md`
is the current one.
