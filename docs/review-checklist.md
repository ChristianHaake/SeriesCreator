# Release Review

Checklist source:
https://github.com/ChristianHaake/haak3-webapp-standard/blob/main/docs/review-checklist.md

## Release

- Version: `1.5.0`
- Review date: `2026-08-30`
- Reviewer: `Claude Opus 5` (automatisiert), Freigabe: `Christian Haake`

## Product

- [x] Zielgruppen und schulischer Zweck sind explizit dokumentiert.
- [x] Der Kernworkflow funktioniert ohne Login und Backend.
- [x] Leere Zustände und Wiederherstellungspfade sind verständlich.
- [x] Reset, Import und Beispielauswahl schützen vorhandene Arbeit.
- [x] Release-Funktionen, Grenzen und Nicht-Ziele sind in `features.md` getrennt.

## Design and responsive behavior

- [x] Semantische Design-Tokens werden verwendet.
- [x] Header, Footer und Inhaltsseiten folgen der gemeinsamen Struktur.
- [x] Produktions-Browser-E2E deckt den Kernworkflow bei 320 px ab.
- [x] Editor und Vorschau erzeugen bei 320 px kein horizontales Seitenscrolling.
- [x] 390 px, Tablet-Porträt und -Querformat, Desktop und 200-%-Zoom geprüft.

## Accessibility

- [x] Der Kernworkflow ist per nativen Controls und Tastatur bedienbar.
- [x] Der Beispieldialog hält und restauriert den Fokus und schließt mit Escape.
- [x] Relevante Controls besitzen Namen und Labels.
- [x] Statusmeldungen werden in einer Live-Region ausgegeben.
- [x] Episodenreihenfolge besitzt Hoch-/Runter-Steuerung.
- [x] `prefers-reduced-motion` wird berücksichtigt.
- [x] Kontrast und 200-%-Zoom geprüft.
- [x] Axe-Prüfung von Editor, Vorschau, Bestätigungsdialog und Beispielgalerie ohne Befund.
- [ ] Manueller Screenreader-Test abgeschlossen.

## Data and privacy

- [x] Storage-Schlüssel und Projektschema sind versioniert und dokumentiert.
- [x] Importierte Daten werden vor Zustandsersetzung vollständig validiert.
- [x] Datei-, Bild-, Staffel- und Episodengrenzen sind fest definiert.
- [x] Fehlgeschlagene Importe erhalten das aktuelle Projekt.
- [x] Datenschutztext entspricht Local Storage, Cloudflare Workers und Web Analytics.

## Content and legal

- [x] Hilfe, Datenschutz und Impressum unterstützen direkte Navigation.
- [x] Footer verlinkt Pflichtseiten und Repository.
- [x] Markdown rendert kein unsicheres Raw HTML.
- [x] Deutsche und englische Pflichtseiten sind vorhanden.
- [ ] Rechtstexte wurden durch den Betreiber final geprüft.

## Engineering and release

- [x] Node-Version und reproduzierbarer `npm ci`-Pfad sind dokumentiert.
- [x] `npm run verify` umfasst Lint, Typprüfung, Beispiele, Unit-Tests, Build und Browser-E2E.
- [x] Chromium, Firefox, WebKit und Mobile Chrome prüfen den Produktions-Build.
- [x] GitHub Actions führt das Release-Gate aus.
- [x] Production-Smoke prüft öffentliche Routen, zentrale Security-Header und die ausgelieferte Version.
- [x] HTML revalidiert; gebaute Assets und Beispielbilder werden immutable gecacht.
- [x] README, Paketmetadaten und Lizenz nennen GPL-3.0-only.
- [x] Abhängigkeits-Audit meldet keine bekannte Schwachstelle.
- [x] Standard-Ausnahmen sind dokumentiert.
- [x] Druckränder und dunkles Drucklayout werden in Chromium automatisiert am echten PDF geprüft.
- [ ] Manueller PDF-/Drucktest in Firefox und Safari abgeschlossen.
- [ ] iPad Safari auf dem Gerät geprüft.

## Release verdict

Die automatisierten Gates sind die technische Freigabe. Die Veröffentlichung
bleibt blockiert, bis die offenen manuellen Punkte abgeschlossen oder durch den
Betreiber ausdrücklich als akzeptierte Einschränkung dokumentiert sind.

Offene manuelle Punkte und akzeptierte Einschränkungen stehen in
`release-record-1.5.0.md`.
