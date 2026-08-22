# SeriesCreator

SeriesCreator ist eine lokale, browserbasierte Arbeitsumgebung für schulische
Serienprojekte. Lernende strukturieren ein Thema als fiktive Streaming-Serie,
planen Staffeln und Episoden, dokumentieren Quellen und Reflexion und
präsentieren das Ergebnis.

[Live-App öffnen](https://seriescreator.haak3.de)

## Methode

Die didaktische Grundlage ist die Streaming-Serien-Methode: Lernende gliedern
ein Thema in Staffeln und Episoden und treffen dabei inhaltliche Entscheidungen
über Auswahl, Reihenfolge und Perspektive. Ablauf, Lernziele, Fachbeispiele und
Bewertungshinweise beschreibt
[Unterricht als Serie denken: Die Streaming-Serien-Methode](https://haak3.de/unterricht-als-serie-denken-die-streaming-serien-methode/).

## Release-Funktionen

| Bereich | Funktionsumfang |
| --- | --- |
| Projektplanung | Titel, Urheber:in, Beschreibung, Anbieter, Kategorie, Alters-/Klassenstufe, Genre, Mitwirkende und automatisch berechneter Projektstatus |
| Medien | Lokaler Upload von PNG, JPEG oder WebP; Cover und Episodenbilder werden im Browser geprüft und verkleinert; Alternativtexte für Episodenbilder |
| Struktur | 1–20 Staffeln, bis zu 100 Episoden je Staffel, Umbenennen, Löschen leerer Staffeln und barrierearme Hoch-/Runter-Steuerung für Episoden |
| Inhalt | Episodentitel und -beschreibungen, Projektverlauf/Reflexion, Quellen und eine frei benennbare Konzeptsektion |
| Vorschau | Sofort aktualisierte Streaming-Ansicht; mobil expliziter Wechsel zwischen Editor und Vorschau |
| Präsentation | In-App-Präsentation mit Vollbild-Fallback, Tastatursteuerung, Episoden, Reflexion, Quellen und Credits |
| Dateien | Versionierte `.seriescreator`-Projektdatei, eigenständige Offline-HTML-Präsentation und Browser-Druck/PDF |
| Beispiele | Zwei vollständige Schulprojekte zu Klima und Weimar, jeweils auf Deutsch und Englisch sowie mit eingebetteten Bildern |
| Sprache | Deutsche und englische Oberfläche, Startinhalte und Inhaltsseiten |
| Speicherung | Automatische lokale Sicherung in `localStorage`; kein Konto und keine serverseitige Speicherung von Projektinhalten |

Die verbindliche Definition mit Akzeptanzkriterien, Grenzen und Nicht-Zielen
steht in [docs/features.md](docs/features.md).

## Datenschutz und Speicherung

Projektinhalte und hochgeladene Bilder werden im Browser verarbeitet. Der
aktuelle Entwurf wird unter `series_creator_data`, die Sprache unter
`series-creator-locale` in `localStorage` gespeichert. Eine
`.seriescreator`-Datei ist das dauerhafte, nutzerkontrollierte Backup.

SeriesCreator hat keine Accounts, keine Inhaltsdatenbank und keinen
Upload-Endpunkt. Cloudflare verarbeitet technische Verbindungsdaten und
anonyme, cookielose Reichweitenstatistik. Details stehen in der
[Datenschutzerklärung](https://seriescreator.haak3.de/datenschutz).

## Projektdateien und Exporte

- `.seriescreator`: versioniertes JSON-Schema 1, maximal 25 MB
- Bilder: PNG/JPEG/WebP, maximal 60 Megapixel Eingangsgröße
- HTML: eigenständige Präsentationsdatei für lokale/offline Wiedergabe
- PDF: über den nativen Druckdialog des Browsers

Das vollständige Format ist in
[docs/project-file-format.md](docs/project-file-format.md) beschrieben.

## Entwicklung

Voraussetzungen:

- Node.js `>=22.12.0 <23`
- npm 10

```bash
npm ci
npx playwright install chromium webkit
npm run dev
```

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver starten |
| `npm run lint` | ESLint ausführen |
| `npm run typecheck` | TypeScript prüfen |
| `npm run build:examples` | Importierbare Beispieldateien erzeugen und validieren |
| `npm test` | Vitest-Tests ausführen |
| `npm run build` | Produktions-Build nach `dist/` erstellen |
| `npm run test:e2e:chromium` | Schnelle Browserprüfung in Chromium |
| `npm run test:e2e` | Release-Flows in Chromium und WebKit prüfen |
| `npm run verify` | Lint, Typprüfung, Beispiele, Unit-Tests, Build und Browser-E2E |
| `npm audit --audit-level=low` | Abhängigkeiten gegen bekannte Schwachstellen prüfen |
| `npm run smoke:production` | Live-Routen und zentrale Security-Header prüfen |

Für eine andere Ziel-URL:

```bash
npm run smoke:production -- https://example.workers.dev
```

## Deployment

- Ziel: Cloudflare Workers Assets
- Build: `npm run build`
- Ausgabe: `dist`
- SPA-Fallback: `single-page-application`
- Runtime-Header: `public/_headers`

Das automatisierte Release-Gate läuft in GitHub Actions. Manuelle
Zielbrowser-, Screenreader-, Rechts- und Endgeräteprüfungen bleiben getrennt in
[docs/manual-release-checks.md](docs/manual-release-checks.md) dokumentiert.

## Dokumentation

- [Streaming-Serien-Methode](https://haak3.de/unterricht-als-serie-denken-die-streaming-serien-methode/)
  (didaktischer Hintergrund)
- [Funktionsspezifikation](docs/features.md)
- [Architektur](docs/architecture.md)
- [UI-Konzept](docs/ui-concept.md)
- [Projektdateiformat](docs/project-file-format.md)
- [Release-Review](docs/review-checklist.md)
- [Standard-Konformität](docs/standard-conformance.md)
- [Changelog](CHANGELOG.md)

## Lizenz

SeriesCreator steht unter [GPL-3.0-only](LICENSE).
