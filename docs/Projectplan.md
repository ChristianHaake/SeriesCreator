# Projektplan

## Produktziel

SeriesCreator unterstützt Lernende der Sekundarstufen I und II dabei,
Unterrichtsinhalte als fiktive Serie zu strukturieren, mit Quellen zu belegen
und in einer verständlichen Reihenfolge zu präsentieren. Lehrkräfte erhalten
ein lokal nutzbares Werkzeug ohne Accounts und ohne Inhalts-Upload.

Die aktuelle Release-Spezifikation steht in [features.md](features.md). Dieses
Dokument trennt den vorhandenen Release-Umfang von späteren Ideen.

## Aktueller Release-Umfang

- dreistufiger Editor für Projektinformationen, Episoden und Details
- Cover, Staffeln, Episodenbilder und Alternativtexte
- Live-Vorschau und mobiler Editor-/Vorschauwechsel
- In-App-Präsentation und eigenständiger HTML-Export
- Browser-Druck/PDF und versionierte `.seriescreator`-Backups
- lokaler Autosave und validierter Import
- deutsche und englische Oberfläche
- vollständige Klima- und Weimar-Beispiele
- Hilfe, Datenschutz, Impressum, Lehrkräfte- und Verantwortungsseiten

## Release-Kriterien

Ein Release ist technisch freigabefähig, wenn:

1. `npm run verify` vollständig in Chromium und WebKit besteht;
2. `npm audit --audit-level=low` keine bekannte Schwachstelle meldet;
3. der Production-Smoke Routen und Security-Header bestätigt;
4. Importfehler und Abbruchpfade vorhandene Arbeit erhalten;
5. die manuellen Prüfungen in `manual-release-checks.md` abgeschlossen oder
   als akzeptierte Einschränkung dokumentiert sind;
6. README, Changelog, Funktionsspezifikation und Versionsmetadaten
   übereinstimmen.

## Nach dem Release

Diese Punkte gehören nicht zum aktuellen Funktionsversprechen:

- PWA-Installation und garantierte Offline-Verfügbarkeit der App-Shell
- gemeinsames Bearbeiten oder Cloud-Synchronisation
- Lehrkräfte-Bewertungsraster
- direkte Übergabe an andere haak3-Apps
- generative KI innerhalb der App
- getaggter, vollständig barrierefreier PDF-Export

Sie werden erst dann zu Release-Funktionen, wenn Datenmodell, Oberfläche,
Tests, Datenschutz und Dokumentation gemeinsam umgesetzt sind.
