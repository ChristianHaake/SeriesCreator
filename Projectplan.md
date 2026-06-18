Für deine bestehende Tool-Landschaft (Feedbackbogen-Generator, Social Media Creator, Storyboard Designer) positionieren wir das Projekt als **Streaming Story Designer** oder **Series Designer**. Damit erhältst du ein universell einsetzbares Werkzeug für alternative Prüfungsformate im Stil bekannter Streaming-Portale.

## Projekt: Streaming Story Designer

### Kurzbeschreibung

Eine browserbasierte Web-App im Look bekannter Streaming-Plattformen, mit der Schülerinnen und Schüler Unterrichtsinhalte in Form einer fiktiven Serie strukturieren und präsentieren können. Sie erstellen ein Serien-Cover, Staffel- und Episodenübersichten (inklusive Thumbnails) sowie optionale Hintergrundinformationen. Das Ergebnis kann direkt präsentiert oder als PDF exportiert werden.

* **Zielgruppe:** Schülerinnen und Schüler (Sek. I, Sek. II), Lehrkräfte
* **Datenschutz:** ausschließlich Local Storage, keine Accounts (DSGVO-konform)
* **Hosting:** Cloudflare Pages
* **Lizenz:** GPL-3.0-only
* **Offlinefähig:** (PWA optional)

⸻

### Vision

Als Lernende möchte ich komplexe Inhalte als Serie strukturieren, damit ich Zusammenhänge besser verstehe, kreativ präsentieren kann und meine Mitschüler mit einem "Netflix-ähnlichen" Erlebnis überrasche.

⸻

### MVP Features (Aktualisiert mit Streaming-UI)

* **Erweiterte Projektdaten:** Titel, Fach, Thema.
* **Seriencover (Hero Section):** Titel, Untertitel, Kurzbeschreibung, Klassenstufe (statt Altersfreigabe), Match-Faktor (Relevanz), Genre und Cast (Mitwirkende).
* **Episodenverwaltung:** Titel, Beschreibung und **visuelle Thumbnails** (Skizze/Icon) pro Episode.
* **Staffel-Struktur (Seasons):** Episoden können in Staffeln gruppiert werden.
* **Authentische Tab-Navigation:** Übersicht, Episoden, Details/Hintergrund (Lernziele, Quellen).
* **Präsentationsmodus ("PLAY"-Button):** Startet eine Vollbild-Präsentationsansicht der Serie für den Unterricht.
* **Export:** PDF-Export im Streaming-Look (DIN-A4 druckoptimiert).
* **Technik:** Autosave im Local Storage, KI-freie Nutzung.

⸻

### User Stories

**US-001 Projekt anlegen & Metadaten definieren**
Als Schüler möchte ich Projektdaten (Fach, Thema) und Serien-Metadaten (Klassenstufe, Relevanz, Cast, Genre) eingeben, damit meine Serie authentisch wirkt.
*Akzeptanzkriterien:* Felder für Cast, Genre, Match-% und Klassenstufe vorhanden; Automatische Speicherung.

**US-002 Seriencover gestalten (Hero Section)**
Als Schüler möchte ich ein großes Cover mit Titel, Klappentext und Hintergrund(bild/farbe) erstellen, damit die Übersicht ansprechend aussieht.
*Akzeptanzkriterien:* Hintergrundbild/-farbe wählbar, Live-Vorschau aktualisiert sich sofort.

**US-003 Episoden & Staffeln verwalten**
Als Schüler möchte ich Episoden anlegen, mit Thumbnails versehen und Staffeln zuordnen, damit ich Inhalte sinnvoll gruppieren kann.
*Akzeptanzkriterien:* Dropdown für Staffeln, Bildupload/Icon-Auswahl für Episoden-Thumbnails, Drag-and-Drop zur Sortierung.

**US-004 Präsentationsmodus nutzen**
Als Schüler möchte ich über einen "PLAY"-Button meine Serie im Vollbild präsentieren, damit ich mein Ergebnis der Klasse vorstellen kann.
*Akzeptanzkriterien:* Klick auf "PLAY" startet Slideshow.

**US-005 PDF exportieren**
Als Schüler möchte ich meine Serie als PDF speichern, damit ich sie abgeben kann.
*Akzeptanzkriterien:* Streaming-Layout wird druckoptimiert als PDF ausgegeben.

⸻

### UI-Struktur (Wireframe)

Die UI teilt sich idealerweise in einen **Editor-Bereich (links)** und eine **Live-Vorschau (rechts)** auf.

#### Editor-Bereich (Linke Sidebar)
1. **Design & Meta:** Cover, Klassenstufe, Match-%, Genre, Cast.
2. **Staffeln & Episoden:** Listeneditor (Drag & Drop), Thumbnail-Upload pro Episode.
3. **Hintergrund:** Quellen, Reflexion, Lernziele.

#### Live-Vorschau (Rechter Bereich - Netflix-Look)
```text
[Header: Startseite | Serien | Filme | Neu und beliebt | Meine Liste]

[Hero-Sektion]
  <Hintergrundbild/Farbe abgedunkelt>
  (Serienlogo / Riesiger Titel)
  [99% Match] [2024] [Klasse 8+] [2 Staffeln]
  Klappentext der Serie...
  [▶ PLAY (Präsentation)] [+ MEINE LISTE]
  Starring: Max Mustermann, Marie Curie | Genre: Wissenschafts-Thriller

[Tab-Leiste]
  ÜBERSICHT | [EPISODEN] | DETAILS | QUELLEN

[Episoden-Bereich]
  [Dropdown: Staffel 1 ▼]
  <Grid mit Episoden-Karten inkl. Thumbnails>
```

⸻

### Nichtfunktionale Anforderungen

* Vollständig clientseitig (keine Anmeldung, keine Cloud-Speicherung)
* Responsive für Desktop und Tablet
* Barrierearme Bedienung (Labels statt Platzhalter, Tastaturnavigation)
* Lokale Speicherung über localStorage
* Schnelle Ladezeit (< 2 Sekunden)
* Export ohne externe Dienste
* DSGVO-freundlich und für den schulischen Einsatz geeignet, Historienserie, Krimi, Wissenschaft, Biografie)
2. Integration mit deinem Storyboard Designer (Episoden → Storyboard übergeben)
3. Verbindung zum Social Media Creator (Werbeposter oder Trailer-Posts erzeugen)
4. Lehrkraftmodus mit Bewertungsraster und Rubrics
5. Import/Export als JSON zur Weitergabe oder Archivierung
