# SeriesCreator

SeriesCreator ist eine browserbasierte Simulationsumgebung für schulische
Streaming-Serienprojekte. Lernende planen fiktive Serien, strukturieren
Episoden, ergänzen Quellen und Reflexionsnotizen und präsentieren das Ergebnis
in einer Streaming-ähnlichen Oberfläche.

## Features

- **No Accounts, Local-First**: Your series content is processed and stored only in your browser — no login, no server-side storage. Reach is measured with anonymous, cookieless Cloudflare Web Analytics.
- **Interactive Editor**: Plan your series with titles, cast, genres, and reflection notes.
- **Seasons & Episodes**: Structure your content with seasons, episodes, and explicit reorder controls (up to 20 seasons and 100 episodes per season).
- **In-App Example Gallery**: Load complete school projects for climate education and history with seasons, episodes, reflection notes, sources, social copy, and image-generation prompts.
- **Importable Example Files**: Ready-made `.seriescreator` files are generated in `examples/` with embedded cover and episode images and can be opened through the app's **Load** action.
- **Automatic Image Handling**: Upload large images; they are automatically optimized and scaled locally to save space.
- **Presentation Mode**: Pitch your series using a sleek, streaming-style fullscreen interface.
- **Standalone HTML Export**: Download a fully playable presentation as a single `.html` file that works offline anywhere.
- **PDF & Project Exports**: Generate print-ready PDFs or save your editable state as a `.seriescreator` file.
- **Bilingual (DE / EN)**: Full German and English UI, including locale-specific starter content.

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

Zur anonymen Reichweitenmessung wird Cloudflare Web Analytics ohne Cookies und
ohne Fingerprinting eingesetzt. Nutzinhalte verlassen das Gerät dabei nicht.
Details: [Datenschutz](https://seriescreator.haak3.de/datenschutz).

## Entwicklung

```bash
npm install
npm run dev
```

## Verifikation

```bash
npm run lint
npm run typecheck
npm run build:examples
npm run test
npm run build
npm run verify
npm audit --audit-level=low
```

`npm run verify` ist das lokale Release-Gate und führt Lint, Typecheck,
Beispieldatei-Generierung, Tests und Build aus.

## Release-Status

- Version: `1.3.0`
- Stand: 2026-07-21
- Lokales Release-Gate: `npm run verify`
- Zusätzliche Release-Checks: `npm audit --audit-level=low`, Chromium-PDF-Smoke,
  DOM-Check für Accessible Names

## Bekannte Grenzen

- Ein echter Screenreader-Review mit VoiceOver/NVDA bleibt ein manueller
  Zielsystem-Check.
- PDF-Ausgabe nutzt die Druckfunktion des Browsers. Der Chromium-Smoke ist
  geprüft; finale Zielbrowser sollten vor Veröffentlichung manuell geprüft
  werden.
