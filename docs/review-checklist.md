# Release Review

Checklist source:
https://git.2p4.org/Christian/Agent-Memory/src/branch/main/25_Development/standards/haak3-webapps/docs/review-checklist.md

## Release

- Version: `2.0.0` (in Vorbereitung)
- Review date: `2026-11-26` (Redesign-Prüfung in Vorbereitung)
- Reviewer: Codex (automatisierte Prüfung; manuelle Freigaben weiter offen)

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
- [x] 320, 360, 390, 768 und 1440 CSS-Pixel automatisiert auf Seitenüberlauf und zentrale Touchziele geprüft.
- [ ] Redesign auf echtem Tablet im Hoch- und Querformat sowie bei 200-%-Browserzoom geprüft.

## Accessibility

- [x] Der Kernworkflow ist per nativen Controls und Tastatur bedienbar.
- [x] Der Beispieldialog hält und restauriert den Fokus und schließt mit Escape.
- [x] Relevante Controls besitzen Namen und Labels.
- [x] Statusmeldungen werden in einer Live-Region ausgegeben.
- [x] Episodenreihenfolge besitzt Hoch-/Runter-Steuerung.
- [x] `prefers-reduced-motion` wird berücksichtigt.
- [x] Axe-Kontrastprüfung für fünf Sprachen im Editor und auf Inhaltsseiten ohne Befund.
- [ ] Manueller Kontrastcheck auf Bildhintergründen und 200-%-Browserzoom abgeschlossen.
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
- [x] Footer verlinkt Pflichtseiten einschließlich Unterstützung und Repository.
- [x] Unterstützung hat eine eigene Route, einen lokalisierten Anbieterlink und einen Datenschutzhinweis.
- [x] Hilfe und Unterstützung bieten in allen fünf Sprachen einen sichtbaren Feedbackkontakt per E-Mail.
- [x] Markdown rendert kein unsicheres Raw HTML.
- [x] Pflichtseiten sind in Deutsch, Englisch, Französisch, Spanisch und Niederländisch vorhanden; die Rechtstexte warten auf Betreiberprüfung.
- [ ] Rechtstexte wurden durch den Betreiber final geprüft.

## Engineering and release

- [x] Node-Version und reproduzierbarer `npm ci`-Pfad sind dokumentiert.
- [x] `npm run verify` umfasst Lint, Typprüfung, Beispiele, Unit-Tests, Build und Browser-E2E.
- [x] Die Playwright-Konfiguration prüft Chromium, Firefox, WebKit und Mobile Chrome gegen den Produktions-Build; lokale Firefox-Starts bleiben umgebungsbedingt blockiert.
- [x] GitHub Actions führt das Release-Gate aus.
- [x] Übersetzungsschlüssel, leere Werte und Platzhalter werden im Test-Gate geprüft.
- [x] Bereits sichtbare Status- und Fehlermeldungen wechseln mit der Oberflächensprache.
- [x] Stage-Deploy, Commit-Smoke und automatisierte fünfsprachige Stage-Flows abgeschlossen.
- [ ] Manuelle fünfsprachige Stage-Abnahme auf Zielgeräten abgeschlossen.
- [ ] Production-Smoke für den Redesign-Release auf der endgültigen URL bestanden.
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

Offene manuelle Punkte, Prüfergebnisse und akzeptierte Einschränkungen stehen
in `release-record-2.0.0.md`.
