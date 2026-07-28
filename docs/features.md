# Funktionsspezifikation

Stand: 2026-07-29

Dieses Dokument ist die verbindliche Definition des aktuellen
SeriesCreator-Funktionsumfangs. Roadmap-Ideen sind keine Release-Funktionen.

## Zielgruppe und Ergebnis

Lernende der Sekundarstufen I und II erstellen ein schulisches Serienkonzept
mit Episoden, Quellen und Reflexion. Lehrkräfte können die App als kreatives
Prüfungs-, Präsentations- oder Strukturierungsformat einsetzen.

Das Ergebnis besteht aus:

- einem weiter bearbeitbaren `.seriescreator`-Projekt;
- einer Live- und Vollbild-Präsentation;
- einer eigenständigen HTML-Präsentation;
- einer druckbaren Übersicht, die über den Browser als PDF gespeichert werden
  kann.

## Release-Funktionen und Akzeptanzkriterien

### F-01 Projektinformationen

Nutzer:innen können Anbieter, Kategorie, Titel, Urheber:in, Beschreibung,
Alters-/Klassenstufe, Genre und Mitwirkende bearbeiten.

Akzeptiert, wenn:

- jede Eingabe sofort in der Vorschau erscheint, sofern sie dort dargestellt
  wird;
- freie Genres möglich sind;
- der Projektstatus aus zehn Inhaltskriterien berechnet oder bewusst mit
  0–100 überschrieben werden kann;
- Textgrenzen im Editor und Import identisch sind.

### F-02 Lokale Bilder

Cover und Episodenbilder werden ausschließlich im Browser verarbeitet.

Akzeptiert, wenn:

- PNG, JPEG und WebP angenommen werden;
- Eingaben über 60 Megapixel abgewiesen werden;
- Cover auf höchstens 1920 px, Episodenbilder auf höchstens 800 px Breite
  reduziert werden;
- Episodenbilder einen bearbeitbaren Alternativtext besitzen;
- fehlerhafte Bilder das Projekt nicht ersetzen oder beschädigen.

### F-03 Staffeln und Episoden

Ein Projekt enthält 1–20 Staffeln und höchstens 100 Episoden pro Staffel.
Episoden enthalten Titel, Beschreibung, optionales Bild und Alternativtext.

Akzeptiert, wenn:

- Staffeln angelegt, ausgewählt, umbenannt und nur leer gelöscht werden können;
- die UI und der Import dieselben Höchstgrenzen durchsetzen;
- Episoden angelegt, bearbeitet und gelöscht werden können;
- Hoch-/Runter-Schaltflächen die Reihenfolge ohne Drag-and-drop ändern.

### F-04 Konzept, Reflexion und Quellen

Nutzer:innen dokumentieren Projektverlauf/Reflexion, Quellen sowie optional
eine frei benennbare Konzeptsektion.

Akzeptiert, wenn die Inhalte in Vorschau, Präsentation, HTML und Projektdatei
erhalten bleiben.

### F-05 Live-Vorschau und responsive Bedienung

Die Vorschau zeigt Serien-Hero, Metadaten, Staffeln, Episoden, Konzept und
Quellen.

Akzeptiert, wenn:

- Änderungen ohne manuellen Speicherschritt sichtbar werden;
- auf schmalen Viewports zwischen Editor und Vorschau umgeschaltet werden
  kann;
- die Kernoberfläche ab 320 CSS-Pixeln ohne horizontales Seitenscrolling
  nutzbar bleibt.

### F-06 Präsentation

Die In-App-Präsentation zeigt Titel, alle Episoden, Reflexion, Quellen und
Credits.

Akzeptiert, wenn:

- Pfeile und Leertaste navigieren;
- Escape beendet;
- Ablehnung oder Fehlen der Fullscreen-API die Präsentation nicht blockiert;
- Bilder ihre Alternativtexte verwenden.

### F-07 Autosave, Import und Projektdatei

Der aktive Entwurf wird nach Änderungen lokal gespeichert. Export und Import
verwenden das versionierte `.seriescreator`-Format.

Akzeptiert, wenn:

- blockierter oder beschädigter Local Storage auf ein frisches Projekt
  zurückfällt;
- Speicherfehler sichtbar gemeldet werden;
- ungültige, zu große oder neuere Projektdateien den aktuellen Entwurf nicht
  ersetzen;
- Reset, Import und Beispielauswahl vor Datenverlust warnen.

### F-08 Ausgaben

SeriesCreator bietet Projektdatei, HTML-Präsentation und Browser-Druck/PDF.

Akzeptiert, wenn:

- Dateinamen aus dem Projekttitel erzeugt und sicher bereinigt werden;
- die HTML-Datei ohne externe Assets funktioniert und Tastaturnavigation,
  responsive Layouts und reduzierte Bewegung unterstützt;
- die Druckansicht Titel und Episoden enthält;
- die UI PDF korrekt als Browser-Druckpfad bezeichnet, nicht als eigenen
  PDF-Generator.

### F-09 Beispiele

Die App enthält Klima- und Weimar-Projekte in Deutsch und Englisch.

Akzeptiert, wenn:

- jedes Beispiel zwei Staffeln, sechs Episoden, Reflexion und Quellen enthält;
- Cover und Episodenbilder eingebettet werden;
- Galerie und `.seriescreator`-Datei denselben normalen Projektpfad verwenden;
- das Laden nur nach Bestätigung vorhandene Arbeit ersetzt.

### F-10 Sprache und Inhaltsseiten

Oberfläche, Startinhalte und Pflichtseiten stehen auf Deutsch und Englisch zur
Verfügung.

Akzeptiert, wenn:

- Sprachwahl lokal gespeichert wird und `document.lang` aktualisiert;
- Hilfe, Über, Lehrkräfte, verantwortungsvoller Einsatz,
  Nutzungsbedingungen, Datenschutz und Impressum direkt aufrufbar sind;
- Markdown kein Raw HTML ausführt.

## Technische Grenzen

| Ressource | Grenze |
| --- | --- |
| Projektdatei | 25.000.000 Byte |
| Bild-Eingabe | 60.000.000 Pixel |
| Eingebettete Bild-Data-URL | 1.500.000 Zeichen |
| Staffeln | 1–20 |
| Episoden | 0–100 je Staffel |
| Serientitel | 100 Zeichen |
| Urheber:in | 120 Zeichen |
| Beschreibung | 2.000 Zeichen |
| Episodentitel | 100 Zeichen |
| Episodenbeschreibung | 1.000 Zeichen |
| Alternativtext | 125 Zeichen |
| Reflexion / Quellen | jeweils 5.000 Zeichen |

## Nicht-Ziele des aktuellen Releases

- Accounts, Mehrbenutzerbetrieb oder Cloud-Speicherung
- Veröffentlichung auf echten Streaming- oder Social-Media-Plattformen
- integrierte Bild- oder Textgenerierung durch KI
- PWA-Installation oder garantiertes Offline-Laden der App-Shell
- Drag-and-drop als einziger Sortierweg
- eigener PDF-Renderer oder vollständig getaggte PDF-Ausgabe
- direkte Integration in andere haak3-Apps
