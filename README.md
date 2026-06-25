# SeriesCreator

SeriesCreator ist eine browserbasierte Simulationsumgebung für schulische
Streaming-Serienprojekte. Lernende planen fiktive Serien, strukturieren
Episoden, ergänzen Quellen und Reflexionsnotizen und präsentieren das Ergebnis
in einer Streaming-ähnlichen Oberfläche.

## Status

- Live URL: noch nicht als finale Produktionsadresse dokumentiert
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
