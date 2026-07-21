# SeriesCreator Example Files

These `.seriescreator` files are generated from the bundled app examples and can
be opened through the app's **Load** action.

## Files

- `de-Der-Klima-Code-der-Schule.seriescreator`
- `de-Die-Akte-Weimar.seriescreator`
- `en-The-School-Climate-Code.seriescreator`
- `en-The-Weimar-File.seriescreator`

Each file contains embedded JPEG data URLs for one cover image and six episode
thumbnails. No external image files are required after import.

## Image Assets

- `assets/source-sheets/`: AI-generated source sheets.
- `assets/generated/`: cropped 16:9 JPEG assets embedded by
  `npm run build:examples`.
- `../public/example-assets/`: runtime copies used by the in-app example
  gallery before the selected project is converted to embedded data URLs.

The final prompts used for image generation are also included in each example's
custom concept section.
