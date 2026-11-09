# Audit-Korrekturen — 9. November 2026

Bezieht sich auf [den ursprünglichen Audit](codebase-audit-2026-11-09.md).
Alle elf technischen Befunde sind im Arbeitsstand korrigiert. Der ursprüngliche
Bericht beschreibt weiterhin den vorgefundenen Stand und bleibt als Nachweis
erhalten. Die Änderungen sind nicht veröffentlicht oder deployt.

## Erledigte Befunde

| Befund | Korrektur und Nachweis |
| --- | --- |
| A01 Bild-Roundtrip | Gemeinsame Bildverarbeitung für Cover, Thumbnail und Bildblock; maximal 25 MB und 60 MP vor Decode; JPEG-Ausgabe wird bis zur gemeinsamen Importgrenze verkleinert. Echter detailreicher Bild-Upload → Download → Import erhält das Bild bytegleich in Chromium und WebKit. |
| A02 Stale Inhaltsblöcke | Bildblöcke werden funktional am aktuellen Episodenzustand angehängt. Tests erhalten Textänderungen während des Uploads und verhindern späte Änderungen nach Unmount. Ein inzwischen erreichtes Blocklimit meldet einen Fehler. |
| A03 Spätes Beispiel | Galerie-Schließen, Reset und bestätigter Import invalidieren laufende Beispiel-Ladevorgänge. Ein verzögerter Beispiel-Request überschreibt im Regressionstest keinen späteren Reset. |
| A04 Autosave-Lücke | Der aktuelle Zustand wird bei `pagehide` und verstecktem Dokument unmittelbar gesichert. Browserregression für Bearbeiten → sofort Hilfe → zurück besteht. |
| A05 Gesperrter Storage | Auch der Zugriff auf das Storage-Objekt ist abgesichert; Editor bleibt ohne Storage benutzbar und meldet fehlende Persistenz. Getter-, Schreib- und Browserregressionen bestehen. |
| A06 Recovery-Löschung | Bestätigter Reset entfernt die Recovery-Kopie und meldet Löschfehler. Datenschutztexte unterscheiden Projektinhalte und erhaltene Sprachpräferenz. Unit- und Browserprüfungen bestehen. |
| A07 HTML-Tokenizer | Alle `<` im eingebetteten JSON werden als Unicode-Escape ausgegeben. Vollständige HTML-Parser- und echte Offline-Dateiprüfungen mit `<!--<script>` bestehen. |
| A08 Space-Navigation | Button-Aktivierung wird dem Browser überlassen; Space außerhalb von Buttons verhindert Scrollen und navigiert einmal. Chromium/WebKit prüfen die tatsächlich heruntergeladene HTML-Datei. |
| A09 Entwicklungsabhängigkeiten | Vite 8.3.6, Zod 4.6.7 und minimatch 11.0.5; gesamter Online-Audit ohne Befund. Das notwendige minimatch-Override ist in der Konformitätsdokumentation erklärt. |
| A10 Bildbeschreibungen | Leere Beschreibungen werden im Episoden-Editor kenntlich gemacht. Präsentation, HTML und Druck verlangen Beschreibungen; bearbeitbare Projektdateien bleiben exportierbar. Native Druckaufrufe geben bei fehlenden Beschreibungen einen Hinweis aus. |
| A11 Druck-Performance | Der Druckbaum entsteht nur bei Druckaufruf/Print-Media und verschwindet danach. Native PDF- und Print-Media-Tests bestehen; Messung am identischen großen Projekt siehe unten. |

Zusätzlich erledigt:

- Support-Seite `/unterstuetzung` auf Deutsch und Englisch mit lokalisiertem
  Anbieterlink, Datenschutzhinweis und nichtfinanziellen Hilfsmöglichkeiten.
  Direkte Route, Footer und Axe-Prüfungen sind abgedeckt.
- Übersetzungs-Gate prüft Schlüssel, leere Werte und Platzhalter im regulären
  `npm test`-/`verify`-Pfad.
- Erkannte Änderungen aus anderen Tabs pausieren Autosave und warnen, ohne den
  lokalen Stand zu ersetzen. Vor jedem Autosave wird auch der gespeicherte
  Snapshot verglichen; die Browserregression verhindert das Überschreiben.
- Erfolgsstatus nach Import/Beispiel überschreibt keinen Speicherfehler mehr.
  Die Importregression bestätigt die sichtbare Fehlermeldung und behält den
  importierten Stand im Arbeitsspeicher.
- Die Node-Mindestversion ist auf `>=22.13.0 <23` korrigiert, passend zu den
  tatsächlichen ESLint-/jsdom-Anforderungen. Die CI nutzt getestetes Node 22.23.3.
- Dokumentation, Hilfeseiten, Datenschutztexte, Changelog und Review-Checkliste
  sind an den tatsächlichen Ablauf angepasst. Die Projekt-Schemaversion bleibt 3.

## Prüfung

Laufzeit: Node 22.23.3, npm 10.9.9.

| Prüfung | Ergebnis |
| --- | --- |
| Frisches `npm ci` | In isoliertem `/tmp`-Verzeichnis mit aktualisiertem Manifest und Lockfile erfolgreich; keine Schwachstellen gemeldet |
| Lint | Bestanden |
| Typecheck | Bestanden |
| Beispiele | Vier Dateien erzeugt und validiert; keine Änderung der getrackten Beispiele |
| Unit-/Komponententests | 84 bestanden in 13 Dateien, einschließlich Übersetzungs-Gate |
| Produktionsbuild | Bestanden |
| Chromium | 41 Browsertests bestanden, einschließlich tatsächlicher PDF- und Offline-HTML-Dateien |
| WebKit | 39 Browsertests bestanden; 2 CDP-spezifische PDF-Tests erwartungsgemäß übersprungen |
| Mobile Chrome | 4 Browsertests bestanden |
| `npm audit` | Null bekannte Schwachstellen im vollständigen Abhängigkeitsbaum |
| Unabhängiger Diff-Review | Keine verbleibenden relevanten Regressionen gefunden; ein während des Reviews gefundener Blocklimit-Randfall wurde ebenfalls korrigiert |
| Firefox | Lokal weiterhin Startfehler, auch bei begrenztem Wiederholungsversuch; kein App-Test ausgeführt |

Browserkommando:

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/seriescreator-audit-browsers npm run test:e2e -- \
  --project=chromium --project=webkit --project=mobile-chrome --max-failures=1
```

Der Firefox-Versuch scheitert beim Prozessstart mit
`sandbox_extension_issue_file_to_process ... Operation not permitted` und
`RenderCompositorSWGL failed mapping default framebuffer`. Eine temporäre
Anpassung der Sandbox-/Grafikumgebung nur für den isolierten Probeprozess löste
das nicht. Die Repository-Konfiguration deaktiviert keine Browser-Sandbox und
überspringt Firefox nicht: Die CI führt weiterhin alle vier Projekte aus.

## Performancevergleich

Identisches gültiges Projekt wie im Audit: 20 Staffeln, 2.000 Episoden, 40.000
kurze Textblöcke, 2.355.569 Byte. Lokales Chromium ohne CPU-Drosselung, sieben
Titeländerungen mit jeweils zwei `requestAnimationFrame`-Grenzen.

| Messwert | Vorher | Nachher |
| --- | ---: | ---: |
| DOM-Elemente insgesamt | 97.681 | 5.658 |
| Versteckte Druckelemente während der Bearbeitung | 92.023 | 0 |
| Median der gemessenen Aktualisierung | 50 ms | 17 ms |

Dies ist ein lokaler relativer Vergleich einschließlich Frame-Wartezeit, kein
garantierter Latenzwert auf Schulgeräten. Tatsächliches Drucken baut den
vollständigen Baum weiterhin auf, damit keine Inhalte wegfallen.

## Verbleibende Grenzen

- Die Änderungen sind nicht deployt; die Live-App enthält noch den vorherigen Stand.
- Firefox muss in CI oder einer geeigneten lokalen Umgebung vollständig laufen.
  Das vollständige Release-Gate wird deshalb hier nicht als bestanden bezeichnet.
- Reale iPad-/Safari-Geräte, manuelle Screenreader- und finale Rechtsprüfungen
  bleiben offen. Automatisierte WebKit-/Axe-Tests ersetzen sie nicht.
- localStorage bietet keinen atomaren Vergleich-und-Schreibvorgang. Der Schutz
  erkennt normale Mehrtabkonflikte; eine extrem enge gleichzeitige Schreib-Race
  lässt sich ohne Transaktionsspeicher nicht ausschließen. Gemeinsame Bearbeitung
  wird weiterhin nicht zugesagt.
- Bei Browser-/OS-Abstürzen ohne Lifecycle-Event oder gesperrtem/vollem Speicher
  kann Autosave keine verlustfreie Sicherung garantieren. Projektdateien bleiben
  der nutzerkontrollierte Backup-Pfad.

Keine manuellen Freigaben wurden als erledigt markiert und keine unbekannte
Fehlerfreiheit zugesichert.
