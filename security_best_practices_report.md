# Sicherheitsbericht: SeriesCreator

**Datum:** 28. August 2026  
**Prüfumfang:** React-/TypeScript-Client, Projektimport und -export, lokale Speicherung, statische Auslieferung, Content-Security-Policy, Abhängigkeiten und Produktionsheader.  
**Methode:** Quellcodeprüfung nach den JavaScript-/TypeScript-/React-Web-Sicherheitsvorgaben, Suche nach riskanten DOM- und Netzwerk-Schnittstellen, Abhängigkeitsaudit sowie Produktions-Smoke-Test.

## Management-Zusammenfassung

Es gibt keine bestätigten kritischen oder hohen Schwachstellen. Der Anwendungscode verarbeitet Projektinhalte grundsätzlich sicher: Importdateien werden begrenzt und normalisiert, Bilddaten sind auf Base64-PNG/JPEG/WebP beschränkt, React rendert Inhalte ohne Roh-HTML und der HTML-Export maskiert dynamische Inhalte.

Der wichtigste verbleibende Punkt ist ein bewusster Vertrauenskonflikt: Das externe Cloudflare-Analytics-Skript läuft im selben Origin wie die lokal gespeicherten Projektinhalte. Eine Kompromittierung dieses Drittanbieter-Skripts könnte diese Inhalte lesen. Für eine konsequent lokale Unterrichtsanwendung sollte Analytics deshalb entfernt oder dieses Restrisiko ausdrücklich akzeptiert werden.

## Umsetzungsstatus (28. August 2026)

- **SBP-001:** bewusst zurückgestellt.
- **SBP-002:** im Code behoben. Offline-HTML verwendet nun eine eigene Nonce-basierte CSP; der Schließen-Button nutzt keinen Inline-Event-Handler mehr.
- **SBP-003:** im Deployment-Header ergänzt; der Smoke-Test prüft die konkreten Headerwerte.
- **SBP-004:** im Code behoben. Import-JSON wird in einem Modulworker validiert; die bestehende Validierung bleibt die einzige fachliche Prüfstelle.

SBP-002 bis SBP-004 gelten erst nach der nächsten Auslieferung auch für die Live-Anwendung als abgeschlossen.

| Schweregrad | Anzahl |
| --- | ---: |
| Kritisch | 0 |
| Hoch | 0 |
| Mittel | 1 |
| Niedrig | 3 |

## Bestätigte Befunde

### SBP-001 — Externes Analytics-Skript kann lokale Projektinhalte lesen

**Schweregrad:** Mittel  
**Regelbereich:** JavaScript-/React-Supply-Chain und Datenschutz  
**Stellen:** `index.html:30`, `public/_headers:2`, `src/store/useProjectStore.ts:8-29`

**Beleg:** Cloudflare Web Analytics wird von `https://static.cloudflareinsights.com/beacon.min.js` als Modulsystem-Skript geladen. Die CSP erlaubt diese Quelle. Gleichzeitig liegen Projektinhalte unter `series_creator_data` im `localStorage` desselben Origins.

**Auswirkung:** Ein kompromittiertes oder unerwartet geändertes Analytics-Skript würde mit den Rechten der Anwendung laufen und könnte lokal gespeicherte Entwürfe auslesen und übertragen. Es gibt keinen Hinweis, dass das aktuell geschieht; dies ist ein Drittanbieter- und Datenschutzrisiko, kein Nachweis eines aktuellen Datenabflusses.

**Empfehlung:** Für eine strikt lokale Anwendung das Analytics-Skript entfernen. Falls Analytics beibehalten wird, das Restrisiko als bewusste Abhängigkeit dokumentieren und die Projektinhalte nicht als vertraulich behandeln.

**Mildernde Faktoren:** Kein Authentifizierungszustand, keine Zugangstoken und keine serverseitig gespeicherten Projekte wurden gefunden. Die Datenschutzerklärung benennt die lokale Speicherung und Analytics.

### SBP-002 — Offline-HTML-Export ohne eigene Content-Security-Policy

**Schweregrad:** Niedrig  
**Regelbereich:** CSP / Defense in Depth  
**Stellen:** `src/domain/exportHtml.ts:86-166`

**Beleg:** Die heruntergeladene Präsentation enthält Inline-Skript, Inline-Styles und verwendet `innerHTML`; die Produktions-CSP aus `public/_headers` gilt für eine lokal geöffnete HTML-Datei nicht.

**Auswirkung:** Ein zukünftig eingeführter Escape-Fehler im Export hätte keine zweite Schutzschicht. Der aktuelle Export maskiert die dynamischen Textfelder vor der `innerHTML`-Zuweisung und serialisiert Projektdaten mit neutralisiertem `</`; daher ist dies kein bestätigter XSS-Angriff.

**Empfehlung:** Beim späteren Umbau eine eigene Export-CSP mit Nonce/Hash einführen und Inline-Event-Handler durch registrierte Listener ersetzen. Alternativ den Renderer schrittweise auf DOM-APIs mit `textContent` umstellen.

**Mildernde Faktoren:** `escapeHtml()` maskiert die in die Ausgabe übernommenen Text- und Bildattribute; Projektbild-URLs werden bereits beim Import auf eng erlaubte Bild-Data-URLs begrenzt.

### SBP-003 — CSP schützt Inline-Event-Attribute nur implizit

**Schweregrad:** Niedrig  
**Regelbereich:** CSP-Härtung  
**Stelle:** `public/_headers:2`

**Beleg:** Die CSP definiert `script-src`, aber nicht explizit `script-src-attr 'none'`.

**Auswirkung:** Der derzeitige `script-src`-Fallback blockiert Inline-Event-Attribute bereits; der Befund ist eine Absicherung gegen spätere Änderungen, keine aktuell ausnutzbare Lücke.

**Empfehlung:** `script-src-attr 'none'` ergänzen und `unsafe-inline` weiterhin nicht erlauben.

**Mildernde Faktoren:** Im Anwendungsshell wurden keine Inline-Event-Attribute oder `dangerouslySetInnerHTML`-Nutzungen gefunden. (Der Offline-Export ist hiervon getrennt, da er nicht unter diesen Headern läuft.)

### SBP-004 — Große, gültige Projektdateien können die Oberfläche kurz blockieren

**Schweregrad:** Niedrig  
**Regelbereich:** Ressourcenbegrenzung / Verfügbarkeit  
**Stellen:** `src/domain/projectCodec.ts:147-156`, `src/domain/constraints.ts`

**Beleg:** Der Import begrenzt Dateien auf 25 MB und normalisiert anschließend deren vollständigen JSON-Inhalt im Hauptthread.

**Auswirkung:** Eine maximal große, formal gültige Projektdatei kann besonders auf Schulgeräten kurzfristige UI-Blockaden verursachen. Der Import führt keinen Code aus.

**Empfehlung:** Bei beobachtbaren Problemen den JSON-Import in einen Web Worker verlagern oder die Obergrenze reduzieren.

**Mildernde Faktoren:** Strikte Größen-, Struktur-, Text- und Bilddatenlimits begrenzen den Aufwand und verwerfen ungültige Inhalte.

## Verifizierte Schutzmaßnahmen

- **Importschutz:** Projektdateien werden auf Größe, Schema, Struktur und Textlängen geprüft. Bildquellen akzeptieren ausschließlich begrenzte Base64-PNG/JPEG/WebP-Data-URLs (`src/domain/projectCodec.ts:25-33`).
- **Ausgabeschutz:** React rendert Projektinhalte ohne `dangerouslySetInnerHTML`. Die Markdown-Seiten nutzen `react-markdown` ohne Roh-HTML-Erweiterung (`src/App.tsx:29-40`).
- **HTML-Export:** Dynamische Textwerte werden vor der HTML-Ausgabe maskiert; die in das Skript eingebetteten Projektdaten ersetzen jedes `</` durch `<\\/` (`src/domain/exportHtml.ts:3-19, 109-154`).
- **Downloadschutz:** Exportdateien verwenden Blob-URLs und bereinigte Dateinamen (`src/App.tsx:99-109`, `src/domain/projectCodec.ts:174-187`).
- **Produktionsheader:** Der Live-Smoke-Test bestätigte am 28. August 2026 für `/`, `/hilfe`, `/datenschutz` und `/impressum` erfolgreiche Antworten sowie CSP, Referrer-Policy und `X-Content-Type-Options`. Konfiguriert sind zusätzlich HSTS, COOP, CORP, `X-Frame-Options: DENY` und eine restriktive Permissions-Policy (`public/_headers`).
- **Abhängigkeiten:** `npm audit --omit=dev --audit-level=low` meldete 0 bekannte Schwachstellen. Die CI verwendet `npm ci`, den Release-Gate und einen Audit-Schritt (`.github/workflows/ci.yml:22-32`).
- **Funktionsprüfung:** `npm run verify` bestand vollständig: Linting, Typecheck, Beispiel-Validierung, 32 Unit-Tests, Produktions-Build und sechs End-to-End-Tests in Chromium und WebKit.

## Gegenprüfung eines verworfenen Befunds

Ein zunächst gemeldeter möglicher Script-Breakout über ein gemischt geschriebenes `</SCRIPT>` im HTML-Export ist **nicht** bestätigbar: Die vorhandene Ersetzung sucht nur nach den Zeichen `</`, nicht nach dem Wort `script`, und erfasst deshalb auch Groß- und Kleinschreibung gleichermaßen. Der resultierende String `<\\/SCRIPT>` beendet ein HTML-Skriptelement nicht.

## Nicht geprüft

- Schutz auf physischen Schulgeräten und in restriktiven Schulnetzwerken.
- Sicherheitsverhalten von Cloudflare selbst und des externen Analytics-Dienstes.
- Angriffe durch lokal installierte Browser-Erweiterungen oder kompromittierte Endgeräte.
