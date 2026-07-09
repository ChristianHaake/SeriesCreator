# SeriesCreator

SeriesCreator ist eine browserbasierte Simulationsumgebung für schulische
Streaming-Serienprojekte. Lernende planen fiktive Serien, strukturieren
Episoden, ergänzen Quellen und Reflexionsnotizen und präsentieren das Ergebnis
in einer Streaming-ähnlichen Oberfläche.

## Features

- **No Accounts, Full Privacy**: All data is processed and stored locally in your browser.
- **Interactive Editor**: Plan your series with titles, cast, genres, and reflection notes.
- **Seasons & Episodes**: Structure your content with seasons, episodes, and explicit reorder controls (up to 20 seasons and 100 episodes per season).
- **Automatic Image Handling**: Upload large images; they are automatically optimized and scaled locally to save space.
- **Presentation Mode**: Pitch your series using a sleek, streaming-style fullscreen interface.
- **Standalone HTML Export**: Download a fully playable presentation as a single `.html` file that works offline anywhere.
- **PDF & Project Exports**: Generate print-ready PDFs or save your editable state as a `.seriescreator` file.

## Status

- Live URL: https://seriescreator.haak3.de
- Repository: https://github.com/ChristianHaake/SeriesCreator
- Deployment: Cloudflare Workers Assets
- License: GPL-3.0-only

## Datenschutz und Speicherung

Die Kernfunktionen laufen ohne Login vollständig im Browser. SeriesCreator
speichert den aktuellen Entwurf und die Spracheinstellung in `localStorage`.
Projektbackups werden als versionierte `.seriescreator`-Dateien lokal
heruntergeladen und beim Import vollständig validiert, bevor sie den aktuellen
Entwurf ersetzen.

## Entwicklung

```bash
npm install
npm run dev
```

## Verifikation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify
npm audit --audit-level=low
```

`npm run verify` ist das lokale Release-Gate und führt Lint, Typecheck, Tests
und Build aus.

## Bekannte Grenzen

- PDF-Ausgabe nutzt die Druckfunktion des Browsers und muss vor einem Release
  manuell in Zielbrowsern geprüft werden.
- Die Content-Security-Policy erlaubt aktuell inline Styles, weil die
  bestehende React-Oberfläche noch umfangreich mit `style`-Props arbeitet.
  Diese Ausnahme ist in `docs/standard-conformance.md` dokumentiert.
