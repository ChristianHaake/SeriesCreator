# Codebase-Audit — 9. November 2026

Die nachfolgenden Befunde dokumentieren den ursprünglichen Stand. Die inzwischen
umgesetzten Korrekturen und deren Verifikation stehen in
[Audit-Korrekturen](audit-fixes-2026-11-09.md).

Geprüfter Commit: `078413239b22b2c62ea8aea19450997c4487e178` (Version 2.0.0).
Audit ohne Änderungen am Anwendungscode. Dieser Bericht ist keine Release-Freigabe.

Ergebnis: 11 priorisierte Befunde — 2 hoch, 8 mittel, 1 niedrig. Hinzu kommen
Konformitäts- und Testlücken. Ein kritischer Befund wurde nicht bestätigt.

## Umfang und Methode

Geprüft wurden Anwendungsshell, Store und Wiederherstellung, Schema-Migrationen,
Import-Worker, Bildverarbeitung, Editor und Dialoge, Vorschau, Präsentation,
HTML-Export, Druck, Übersetzungen, Inhaltsseiten, Konfiguration, CI und
Abhängigkeiten. Drei delegierte Untersuchungen behandelten Sicherheit,
Zustandsintegrität sowie UI/Performance. Befunde wurden anhand von Aufrufern,
Tests und gezielten Reproduktionen gegengeprüft.

Grundlagen: README, Architektur, Funktionsspezifikation, Projektdateiformat,
Release-Checklisten und der lokal verfügbare `haak3-webapp-standard`.
Vergleichspfade für Persistenz und Downloads wurden in SocialMediaCreator,
Feedbackbogen-Generator und StoryboardCreator untersucht. Ein Verzeichnis
`StoryboardDesigner` liegt lokal nicht vor; StoryboardCreator wurde als
verfügbarer Vergleich verwendet.

Die folgenden Schweregrade bewerten Auswirkungen und Auslöser. Beim
Abhängigkeitsbefund stammt „hoch“ aus dem Advisory; das ist kein Nachweis einer
ausnutzbaren Schwachstelle in der ausgelieferten statischen App.

## Befunde

### A01 — Hoch: Akzeptierte Bilder gehen beim Projekt-Roundtrip verloren

Stellen: `src/components/EditorSidebar.tsx:149`,
`src/components/EpisodeDialog.tsx:116` und `:160`,
`src/domain/projectCodec.ts:42–45` und `:71–82`.

Die Uploads begrenzen Pixelzahl und Breite, aber nicht die Größe der erzeugten
JPEG-Data-URL. Der Import akzeptiert hingegen höchstens 1.500.000 Zeichen je
Bild. Die App kann deshalb selbst Dateien erzeugen, die sie verlustbehaftet oder
gar nicht wieder einliest.

**Reproduktion in Chromium:** Ein gültiges, detailreiches JPEG mit 1920 × 3200
Pixeln und etwa 7,2 MB wurde als Cover ohne Fehler akzeptiert. Die erzeugte URL
hatte 4.553.195 Zeichen. Die heruntergeladene Projektdatei war 4.553.612 Byte groß,
also deutlich unter 25 MB. Nach regulärem Import und Bestätigung war das Cover
verschwunden. Bei einem entsprechend großen Bildinhaltsblock führt dieselbe
Grenze laut Validator zur Ablehnung des gesamten Projekts; dieser zweite Fall
wurde nicht zusätzlich durch die Browseroberfläche reproduziert.

**Korrektur:** Jede erzeugte Bild-URL vor der Zustandsänderung gegen dieselben
Formatgrenzen prüfen; bei Überschreitung weiter verkleinern oder eine klare
Fehlermeldung anzeigen. Vorhandene Bilder bis zum erfolgreichen Abschluss behalten.
Regressionstest: echter Upload → Projektdatei → Import, einschließlich hoher und
detailreicher Bilder sowie Bildinhaltsblöcken.

### A02 — Mittel: Bildinhaltsblock-Upload überschreibt zwischenzeitliche Änderungen

Stelle: `src/components/EpisodeDialog.tsx:157–161`.

Der asynchrone Callback übernimmt `contentBlocks` vom Uploadstart und ersetzt
später das gesamte Array durch diesen alten Stand plus Bild. Währenddessen
hinzugefügte oder bearbeitete Blöcke verschwinden; gelöschte Blöcke können
wiederkehren und Sortierungen zurückspringen.

**Reproduktion:** Ein temporärer Komponententest verzögerte `Image.onload`,
fügte nach Uploadbeginn einen Textblock hinzu und beendete danach die
Bildverarbeitung. Der Textblock verschwand. Der Test wurde nach der Prüfung entfernt.

**Korrektur:** Den neuen Bildblock am aktuellen Zustand anhängen, beispielsweise
über einen funktionalen Store-Updater. Auch die Höchstzahl am aktuellen Zustand
prüfen. Regressionstest mit verzögertem Decode und zwischenzeitlicher Bearbeitung.

### A03 — Mittel: Spätes Beispiel-Laden macht einen bestätigten Reset rückgängig

Stelle: `src/App.tsx:177–185`.

Nach Bestätigung lädt `attachExampleImages` mehrere Dateien asynchron. Die
Galerie lässt sich währenddessen schließen. Ein danach bestätigter Reset
invalidiert den laufenden Ladevorgang nicht; dessen Abschluss ersetzt das Projekt
erneut durch das Beispiel. Auch neue Eingaben nach dem Reset sind dadurch gefährdet.

**Reproduktion:** Ein temporärer App-Test hielt die Beispielbild-Requests an,
schloss die Galerie, bestätigte den Reset und gab anschließend die Requests frei.
Aus „My New Series“ wurde ohne neue Bestätigung „The School Climate Code“.

**Korrektur:** Laufende Projekt-Ersetzungen bei späteren Ersetzungen invalidieren
oder den Ladevorgang abbrechen. Ein Regressionstest muss die Reihenfolge der
Operationen gezielt vertauschen.

### A04 — Mittel: Schnelle Navigation verliert die letzte Änderung

Stelle: `src/store/useProjectStore.ts:87–95`; Aufrufer unter anderem
`src/components/AppFooter.tsx:10–14`.

Autosave schreibt erst nach 500 ms. Für `pagehide` oder einen entsprechenden
Navigationsschutz gibt es keinen Abschluss des ausstehenden Schreibvorgangs.
Interne Links sind normale Dokumentnavigationen. Ein Reload oder Linkklick kurz
nach dem Bearbeiten verliert deshalb die letzte Änderung.

**Reproduktion in Chromium:** Titel speichern lassen, Titel erneut bearbeiten,
sofort „Help“ öffnen und zur App zurückkehren. Wiederhergestellt wurde der alte
Titel. Ein zusätzlicher Hook-Test bestätigte den Verlust bei sofortigem Unmount.

**Korrektur:** Den jüngsten Zustand beim Verlassen zuverlässig sichern und für
nicht sicherbare Änderungen einen geeigneten Schutz vorsehen. Den normalen
Debounce beibehalten. Regressionstest für Navigation vor Ablauf der 500 ms.

### A05 — Mittel: Vollständig gesperrter Local Storage verhindert den App-Start

Stelle: `src/store/useProjectStore.ts:71–73`; weitere Zugriffe in `:90`, `:195`, `:208`.

`loadStoredProject` fängt Fehler von `getItem` ab, aber der Zugriff auf
`window.localStorage` erfolgt schon vor diesem Schutz. Wirft bereits der Getter
eine `SecurityError`, erreicht die App nur ihre Fehlerseite. Der in F-07
zugesagte Fallback auf ein frisches Projekt funktioniert dann nicht.

**Reproduktion:** Temporärer Hook-Test und isoliertes Chromium-Profil mit einem
werfenden `localStorage`-Getter. Ergebnis im Browser: „Something went wrong“;
kein Editor. Die Sprachermittlung hat für diesen Fall bereits einen Catch.

**Korrektur:** Auch den Zugriff auf das Storage-Objekt absichern. Laden,
Autosave, Reset und Import müssen ohne verfügbaren Storage weiter bedienbar sein
und fehlende Persistenz verständlich melden.

### A06 — Mittel: „Neu / Löschen“ lässt private Recovery-Daten zurück

Stellen: `src/store/useProjectStore.ts:46–49` und `:191–200`;
`src/content/datenschutz.md:25–28`, ebenso englischer Datenschutztext.

Beim fehlerhaften Restore wird der vollständige ursprüngliche Inhalt unter
`series_creator_data.unreadable` gesichert. Reset überschreibt ausschließlich den
aktiven Entwurf und entfernt diese Kopie nicht. Das widerspricht der
Löschzusage und ist insbesondere auf gemeinsam genutzten Schulgeräten relevant.

**Reproduktion in Chromium:** Beschädigten Entwurf mit einem eindeutigen privaten
Text hinterlegen, App laden, „New / Clear“ und „Delete“ bestätigen. Der private
Text war anschließend unverändert im Recovery-Schlüssel vorhanden.

**Korrektur:** Beim ausdrücklich bestätigten Löschen auch Recovery-Daten
entfernen; Fehler dabei melden. Sprachpräferenz und Projektinhalte in der
Dokumentation präzise unterscheiden. Regressionstest für alle projektbezogenen
Storage-Schlüssel. Dies ist ein technischer Befund, keine rechtliche Bewertung.

### A07 — Mittel: Bestimmter Text erzeugt eine leere HTML-Präsentation

Stelle: `src/domain/exportHtml.ts:26`.

Die JSON-Einbettung neutralisiert nur `</`. Die Zeichenfolge `<!--<script>` in
beliebigem Projekttext versetzt den HTML-Parser jedoch in einen weiteren
Script-Tokenizerzustand. Dadurch wird das tatsächliche Script-Ende nicht wie
beabsichtigt erkannt und die Präsentation nicht initialisiert.

**Reproduktion in Chromium:** Beschreibung auf `<!--<script>` setzen und die
erzeugte HTML-Datei laden. `#content` bleibt leer. JSDOM reproduzierte ebenfalls
den Defekt. Es wurde damit keine Ausführung fremden JavaScripts nachgewiesen.

**Korrektur:** Alle `<` im eingebetteten JSON als `\u003c` ausgeben.
Regressionstest muss die vollständige erzeugte Datei durch einen echten
HTML-Parser laden; ein Regex-Extrakt mit `new Function` entdeckt diesen Fehler nicht.

### A08 — Mittel: Leertaste überspringt Folien im HTML-Export

Stelle: `src/domain/exportHtml.ts:260–262`.

Der globale Keydown-Handler navigiert bei Space, verhindert aber nicht die
native Aktivierung eines fokussierten Buttons. Ein Tastendruck kann daher zwei
Navigationsaktionen auslösen. Auf anderen fokussierten Buttons führt Space
ebenfalls zu unbeabsichtigter zusätzlicher Foliennavigation.

**Reproduktion in Chromium:** Den Next-Button fokussieren und einmal Space
drücken. Die Ansicht springt von der Übersicht direkt zu Episode 1 und lässt die
Titelfolie aus. `PresentationMode.tsx:48–56` berücksichtigt diesen Fall bereits.

**Korrektur:** Die vorhandene Behandlung der In-App-Präsentation entsprechend
übernehmen. Regressionstest für Space auf Next, Previous und Inhaltsbuttons
sowie außerhalb von Buttons.

### A09 — Hoch laut Advisory: Bekannte Schwachstellen im Entwicklungswerkzeugbaum

Stellen: `package-lock.json:4113`, `:5122`, `:5418`.

Der Online-Audit meldete 12 betroffene Paketknoten: 2 hoch und 10 mittel.
Das sind nicht 12 unabhängige Schwachstellen; mehrere Meldungen entstehen durch
dieselbe transitive Abhängigkeit. `npm audit --omit=dev --json` meldete null.

| Installiert | Meldung | Einordnung |
| --- | --- | --- |
| Vite 8.0.16 | Mehrere Advisories, darunter Command Injection und Dateizugriff außerhalb erlaubter Pfade | Entwicklungsserver/Editorintegration; kein Vite-Server in der statischen Produktion |
| Zod 4.4.3 | Speichererschöpfung bei übergroßen begrenzten Collections | Transitiv über `eslint-plugin-react-hooks`; kein Zod im eigenen Import-Codec |
| minimatch 10.2.5 | Pattern-Amplifikation/Denial of Service | ESLint- und TypeScript-ESLint-Abhängigkeit; Folge-Meldungen in deren Elternpaketen |

Quellen: [Vite-Advisory](https://github.com/advisories/GHSA-587h-7wmj-h5pm),
[Vite-Dateizugriff](https://github.com/vitejs/vite/security/advisories/GHSA-rq7h-c2jc-7f22),
[Zod-Advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5),
[minimatch-Advisory](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249).

**Korrektur:** Kompatible behobene Versionen gezielt auflösen, Lockfile erneuern
und alle Gates erneut ausführen. Kein pauschales `npm audit fix --force`: Der
Audit schlägt für manche Elternpakete Major-Downgrades vor. Die Aussage
„Abhängigkeits-Audit ohne Befund“ in der bisherigen Review-Checkliste ist mit
diesem Prüflauf überholt. Das Audit-Gate der CI besteht derzeit nicht.

### A10 — Mittel: Pflicht-Alternativtext von Bildinhaltsblöcken wird nicht durchgesetzt

Stellen: `src/components/EpisodeDialog.tsx:158–160` und `:263–265`;
`src/domain/projectCodec.ts:71–79`.

Bildblöcke beginnen mit `altText: ''`. Das als `required` markierte Feld liegt
außerhalb eines validierenden Formularablaufs; Änderungen werden sofort
gespeichert. Auch der Import akzeptiert den leeren String. Ein inhaltlich
wichtiges Bild kann dadurch als dekoratives `alt=""` in Vorschau, Präsentation,
HTML und Druck gelangen. Automatisierte Axe-Prüfungen erkennen eine solche
semantische Fehlklassifikation nicht zuverlässig.

**Korrektur:** Inhaltliche Bilder ohne Alternative vor der Ausgabe kenntlich
machen und eine brauchbare Beschreibung verlangen oder eine ausdrücklich
gewählte dekorative Verwendung unterstützen. Dateinamen allein sind kein
verlässlicher Ersatz für eine Bildbeschreibung. Regressionstest mit neu
hochgeladenem Bildblock und leerem Alternativtext.

### A11 — Niedrig: Versteckter Druckbaum belastet die Bearbeitung großer Projekte

Stellen: `src/App.tsx:327–344`, `src/components/PrintLayout.tsx:39`, `:89–117`.

Die Druckansicht ist nur per CSS ausgeblendet. Sie enthält alle Episoden und
Blöcke und erhält bei jeder Datenänderung eine neue `data`-Referenz; `React.memo`
verhindert diese Aktualisierungen deshalb nicht.

**Messung in lokalem Chromium ohne CPU-Drosselung:** Gültiges Projekt mit 20
Staffeln × 100 Episoden × 20 kurzen Textblöcken, 2.355.569 Byte. Insgesamt
97.681 DOM-Elemente, davon 92.023 im versteckten Druckbaum. Sieben Titeländerungen
mit jeweils zwei `requestAnimationFrame`-Grenzen ergaben einen Median von 50 ms
(49–60 ms), gegenüber 17 ms beim Startprojekt. Das ist eine lokale relative
Messung einschließlich Frame-Wartezeit, kein universeller Tastaturlatenzwert.

**Korrektur:** Druckbaum erst bei Bedarf aufbauen oder Änderungen an unveränderten
Teilen gezielt vermeiden. Der native Druckpfad einschließlich Strg/Cmd+P muss
erhalten bleiben. Kein Anlass für eine allgemeine Komponenten-Neuarchitektur;
die Messung zeigt einen konkreten dominanten Baum. Schwache Schulgeräte wurden
nicht gemessen.

## Verifikation

Die Prüfungen liefen mit Node 22.23.3 und npm 10.9.9, passend zu den dokumentierten
Major-Versionen. Die voreingestellte Node-26/npm-11-Umgebung wurde dafür nicht
verwendet. Kein frisches `npm ci` und kein exakter Nachbau des CI-Patches 22.12.0.

| Prüfung | Ergebnis |
| --- | --- |
| `npm run lint` | Bestanden |
| `npm run typecheck` | Bestanden |
| `npm run build:examples` | Vier Dateien erzeugt und validiert; keine Änderungen an getrackten Beispielen |
| `npm test` | 63 Tests in 10 Dateien bestanden |
| `npm run build` | Bestanden |
| Browser-E2E Chromium | 35 bestanden, einschließlich zweier echter PDF-Prüfungen |
| Browser-E2E WebKit | 33 bestanden, 2 Chromium-spezifische PDF-Tests erwartungsgemäß übersprungen |
| Browser-E2E Mobile Chrome | 4 bestanden, separat nach dem Firefox-Abbruch ausgeführt |
| Browser-E2E Firefox | Browserstart gescheitert; keine App-Kompatibilität nachgewiesen |
| `npm audit --json` | Nicht bestanden: 2 hoch, 10 mittel, insgesamt 12 Paketknoten |
| `npm audit --omit=dev --json` | Keine bekannten Schwachstellen gemeldet |
| `npm run smoke:production` | Root, Hilfe, Datenschutz, Impressum und Beispielbild HTTP 200; geprüfte Header und Version korrekt |
| Live-Chromium: Editor, Beispiel, Präsentation, Hilfe | Keine beobachteten CSP-Verstöße oder JavaScript-Seitenfehler |
| Live-Netzwerk dieser Abläufe | Nur App-Origin, `static.cloudflareinsights.com`, `cloudflareinsights.com` beobachtet |
| Übersetzungsvergleich | DE/EN je 183 Schlüssel; keine fehlenden/zusätzlichen/leeren Werte oder abweichenden Platzhalter |
| Begrenzte Secret-Suche | Keine Treffer für die geprüften Schlüssel-/Private-Key-Muster in aktuellem Anwendungscode, Scripts, Public-Dateien, CI und Dokumentation |

`npm run verify` wurde vollständig angestoßen. Der erste Browserstart war in der
Sandbox gesperrt, anschließend fehlten Browserinstallationen. Nach Installation
der Engines bestand Chromium/WebKit. Firefox scheiterte nach 180 Sekunden mit
`browserType.launch: Timeout 180000ms exceeded`,
`sandbox_extension_issue_file_to_process ... Operation not permitted` und
`RenderCompositorSWGL failed mapping default framebuffer`. Der Gesamt-Lauf
wurde nach diesem Fehler beim nächsten Firefox-Start unterbrochen, statt dieselbe
Umgebungsstörung für alle Tests abzuwarten. Mobile Chrome bestand danach separat.
Das gesamte Release-Gate ist daher nicht grün; dies ist kein belegter
Firefox-Anwendungsfehler. Ein unabhängiger Firefox-Lauf in CI bleibt erforderlich.

Produktionsbundle: Haupt-JavaScript 355,92 kB / 109,92 kB gzip;
Markdown-Chunk 154,09 kB / 45,92 kB gzip; CSS 34,79 kB / 7,09 kB gzip.
Die Inhaltsseite wird getrennt geladen. Es wurde keine unnötige neue
Produktionsabhängigkeit vorgeschlagen. Die direkten Produktionspakete weisen
MIT- beziehungsweise ISC-Lizenzen aus; dies ersetzt keine vollständige
juristische Lizenzprüfung des transitiven Baums.

## Testlücken und Standard-Review

Die bestehenden Tests sind kein Nachweis für die oben beschriebenen Randfälle.
Besonders fehlen dauerhafte Regressionstests für A01–A08 und neue Bildblöcke mit
leerem Alternativtext. Die gezielten temporären Tests wurden nach dem Audit
entfernt; reproduzierte Fehler wurden nicht als erwartetes Verhalten in die
reguläre Testsuite aufgenommen.

| Bereich der gemeinsamen Review-Checkliste | Auditbewertung |
| --- | --- |
| Produkt und Konto-freier Workflow | Dokumentiert und automatisiert abgedeckt |
| Schutz destruktiver Aktionen | Teilweise: Bestätigungen vorhanden, aber A02/A03/A04/A06 offen |
| Import und Wiederherstellung | Teilweise: Versionen und Grenzen vorhanden, aber A01/A05 offen |
| Keyboard und Alternativtexte | Teilweise: A08/A10 offen; manuelle Screenreader-Prüfung fehlt |
| Responsive UI und Zoom | Vorhandene Browsertests; reale iPads und manuelle 200-%-Prüfung hier nicht neu durchgeführt |
| Datenschutz und Netzverhalten | Geprüfte Requests entsprechen erlaubten Hosts; Löschpfad A06 widerspricht Dokumentation |
| Pflichtseiten | Hilfe/Datenschutz/Impressum vorhanden; vorgeschriebene Support-Seite fehlt |
| Übersetzungen | Aktuelle Werte geprüft; dauerhaftes Gate für Schlüssel, leere Werte und Platzhalter fehlt |
| Engineering | Lint/Typen/Unit/Build bestehen; Dependency-Gate scheitert |
| Rechts- und manuelle Release-Prüfung | Weiter offen; siehe bestehende Release-Unterlagen |
| Standard-Ausnahmen | „None“ ist wegen fehlender Support-Seite und fehlendem Übersetzungs-Gate nicht vollständig belegt |

Der aktuelle Standard verlangt Supportinformationen mit eigener Route,
lokalisiertem Ausgangslink und Datenschutzhinweis. `src/content/index.ts` bietet
diese Seite nicht; `AppFooter.tsx` verlinkt direkt den Spendenanbieter.
Die derzeitigen Übersetzungen sind vollständig, aber die vorgeschriebene
automatisierte Vollständigkeits-/Platzhalterprüfung ist nicht Teil von `verify`.
Diese Konformitätslücken werden getrennt von den reproduzierten Laufzeitfehlern
geführt.

Weitere belegte Grenze: Zwei gleichzeitig geöffnete Editorinstanzen schreiben
vollständige Snapshots in denselben Storage-Schlüssel und können Änderungen
gegenseitig überschreiben. Ein temporärer Zwei-Instanzen-Test bestätigte das.
Da kein Mehrbenutzer-/Mehrtabbetrieb zugesagt ist, wird dies als dokumentierbare
Einschränkung statt als zusätzlicher Release-Bug gezählt.

Die sofortige Erfolgsmeldung nach Import/Beispiel kann einen synchron gemeldeten
Speicherfehler überschreiben (`App.tsx:185`, `:270`). Bei erneut fehlschlagendem
Autosave erscheint der Fehler nach etwa 500 ms wieder. Das ist ein weiterer
Status-/UX-Randfall, kein Nachweis eines dauerhaft verborgenen Speicherfehlers.

Bilddateien besitzen vor `FileReader`/Decode kein Byte-Limit; das Pixel-Limit
wird erst nach dem Decode geprüft. Eine Verfügbarkeitsgrenze für sehr große,
lokal ausgewählte Dateien bleibt damit bestehen. Ein Browser-Absturz oder eine
ausnutzbare Ressourcenerschöpfung wurde nicht provoziert.

## Einschränkungen und Reihenfolge

Keine Fehlerfreiheit bescheinigt. Kein Penetrationstest gegen fremde Systeme,
keine rechtliche Freigabe, keine vollständige Git-Historien-/Secret-Prüfung und
keine Messung auf realen Schulgeräten. Der Smoke-Test prüft nur seine definierten
Routen und Header; die zusätzliche Live-Browserprobe deckt ausgewählte Abläufe ab.
Die offenen manuellen Prüfungen aus `manual-release-checks.md` bleiben offen.

Zuerst Bild-Roundtrip und asynchrone Datenverluste beheben; anschließend Löschung,
Storage-Fallback und HTML-Randfälle. Entwicklungsabhängigkeiten gezielt
aktualisieren. Danach fehlende Regressionstests und Konformitätsgates ergänzen;
den Druckbaum anhand der gemessenen Belastung optimieren.

Anwendungscode, Abhängigkeiten und bestehende Freigabe-Checkboxen wurden durch
diesen Audit nicht geändert. Nur dieser Bericht wird dauerhaft hinzugefügt.
