# Release Review

Checklist source:
https://github.com/ChristianHaake/haak3-webapp-standard/blob/main/docs/review-checklist.md

## Release

- Version: `1.3.0`
- Review date: `2026-07-21`
- Reviewer: `Codex`

## Results

- [x] Product purpose and intended users are documented.
- [x] Core workflow works without login.
- [x] Imported project data is validated before state replacement.
- [x] Failed imports preserve current work.
- [x] Reset requires confirmation.
- [x] Help, privacy, imprint, and educator routes exist and support direct navigation.
- [x] Build, lint, typecheck, and unit/browser-like tests are exposed through `npm run verify`.
- [x] README, package metadata, and license file name GPL-3.0-only consistently.
- [x] CSP has no documented app-side exception.
- [x] Bundled school examples load into the normal project state.
- [x] Example gallery is visible inside the app and includes social copy, hashtags, and image prompts.
- [x] Generated `.seriescreator` example files exist in `examples/` and parse through the import codec.
- [x] Example project files include embedded cover and episode thumbnail images.
- [x] Chromium PDF/print smoke creates an A4 PDF containing title and episodes.
- [x] DOM accessibility smoke finds no relevant form controls without accessible names.
- [ ] Manual PDF/print output review completed on all target browsers.
- [ ] Manual screen-reader review completed.
- [x] Final production URL documented: https://seriescreator.haak3.de

## Notes

Automated release gates are green locally. Manual target-browser PDF review and
manual screen-reader review remain explicit release checks.
