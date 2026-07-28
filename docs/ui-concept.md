# UI-Konzept

## Grundstruktur

SeriesCreator verwendet eine ruhige Editor-Oberfläche neben einer dunklen,
Streaming-inspirierten Live-Vorschau. Die Gestaltung simuliert keine reale
Plattform und stellt die schulische Projektarbeit in den Vordergrund.

## Anwendungsschale

- Header: Marke, Sprachwahl, Hinweis auf lokale Verarbeitung und
  Projektaktionen
- Hauptbereich: Editor und Live-Vorschau
- Footer: Hilfe, Über, Lehrkräfte, Datenschutz, Impressum und Repository
- Inhaltsseiten: eigene, direkt erreichbare Routen mit Rückweg zur App

## Editor

Der Editor ist nach Aufgabe statt nach Datenstruktur gegliedert:

1. **Info:** Anbieter, Kategorie, Serientitel, Urheber:in, Cover,
   Beschreibung, Alters-/Klassenstufe, Projektstatus, Genre und Mitwirkende.
2. **Episoden:** Staffeln auswählen, anlegen, umbenennen oder leer löschen;
   Episoden anlegen, bearbeiten, löschen und per Hoch-/Runter-Schaltfläche
   sortieren.
3. **Details:** Projektverlauf/Reflexion, frei benennbare Konzeptsektion und
   Quellen.

Seltene oder riskante Aktionen liegen nicht im primären Eingabefluss.
Ersetzende Aktionen wie Reset, Import und Beispielauswahl verlangen eine
Bestätigung.

## Vorschau

Die Vorschau zeigt Cover, Titel, Projektstatus, Metadaten, Episoden sowie
Konzept und Quellen. Änderungen erscheinen ohne separaten Speicherschritt.
Die Staffelwahl bestimmt, welche Episoden im Raster sichtbar sind.

## Responsive Verhalten

- Desktop: Editor und Vorschau nebeneinander
- Smartphone und schmales Tablet: expliziter Schalter zwischen Editor und
  Vorschau
- Mindestbreite: 320 CSS-Pixel ohne horizontales Seitenscrolling
- Aktionsleisten dürfen umbrechen; bedeutungsvolle Beschriftungen werden nicht
  abgeschnitten
- Touch-Ziele sind mindestens 40 Pixel hoch, 44 Pixel werden bevorzugt

## Präsentation und Ausgabe

Der Präsentationsmodus führt durch Titelfolie, alle Episoden, Reflexion,
Quellen und Credits. Pfeiltasten und Leertaste navigieren; Escape beendet.
Wenn Fullscreen nicht verfügbar oder abgelehnt ist, bleibt die Präsentation im
Browserfenster nutzbar.

Die HTML-Präsentation bildet denselben Ablauf als eigenständige Datei ab. Der
PDF-Pfad verwendet eine gesonderte Druckansicht und den nativen Druckdialog.

## Barrierefreiheit

- sichtbare, programmatisch verbundene Labels
- zugängliche Namen für Symbol- und Dateisteuerungen
- sichtbarer Tastaturfokus
- Hoch-/Runter-Schaltflächen als Alternative zu Drag-and-drop
- Live-Region für Statusmeldungen
- Alternativtexte für Episodenbilder
- Fokusfalle, Escape und Fokuswiederherstellung im Beispieldialog
- reduzierte Bewegung in App und HTML-Präsentation
