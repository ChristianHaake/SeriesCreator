import type { ProjectData } from '../types';
import { PROJECT_SCHEMA_VERSION } from './projectCodec';

type ExampleLocale = 'de' | 'en';

export type ExampleProjectId = 'school-climate-code' | 'weimar-file';

export interface ExampleProject {
  id: ExampleProjectId;
  title: string;
  subtitle: string;
  subject: string;
  grade: string;
  summary: string;
  featureHighlights: string[];
  socialCopy: string;
  hashtags: string[];
  imagePrompts: string[];
  project: ProjectData;
}

function climateProject(locale: ExampleLocale): ProjectData {
  if (locale === 'en') {
    return {
      schemaVersion: PROJECT_SCHEMA_VERSION,
      title: 'The School Climate Code',
      author: 'Class 8b',
      description:
        'A class investigates where energy is lost in everyday school life and turns measurements, interviews, and observations into a concrete climate action plan.',
      previewBrand: 'SchoolStream',
      previewCategory: 'Class projects',
      matchPercentage: 99,
      ageRating: '12+',
      genre: 'Documentary',
      cast: 'Class 8b, Energy Club, facility manager, student council',
      seasons: [
        {
          id: 'climate-season-research',
          title: 'Season 1: Investigation',
          episodes: [
            {
              id: 'climate-ep-electricity',
              title: 'The Electricity Detective',
              summary:
                'The class measures standby consumption, lighting, and device usage, then identifies hidden energy drains in the classroom.',
              altText: 'Students measuring energy consumption in a classroom.',
            },
            {
              id: 'climate-ep-heat',
              title: 'Heat on the Run',
              summary:
                'Temperature maps and room logs reveal where windows, radiators, and routines waste heating energy.',
              altText: 'Students compare classroom temperature readings.',
            },
            {
              id: 'climate-ep-cafeteria',
              title: 'The Cafeteria Balance',
              summary:
                'The team compares food waste, transport routes, and regional options to make the cafeteria part of the climate plan.',
              altText: 'Students documenting food waste in a school cafeteria.',
            },
          ],
        },
        {
          id: 'climate-season-action',
          title: 'Season 2: Action Plan',
          episodes: [
            {
              id: 'climate-ep-data',
              title: 'The Data Proof',
              summary:
                'Charts, cost estimates, and short interviews turn observations into evidence the school leadership can evaluate.',
              altText: 'Students analyzing charts on a classroom screen.',
            },
            {
              id: 'climate-ep-council',
              title: 'The Climate Council',
              summary:
                'Different groups argue about comfort, cost, fairness, and feasibility before voting on realistic measures.',
              altText: 'Students presenting climate findings in a school meeting.',
            },
            {
              id: 'climate-ep-monday',
              title: 'A Plan for Monday',
              summary:
                'The finale prioritizes three immediate changes, two medium-term projects, and one question for the next class project.',
              altText: 'Students placing action cards on a classroom board.',
            },
          ],
        },
      ],
      reflection:
        'The project shows how measurement, interpretation, and communication belong together. Learners must distinguish between observations, assumptions, and evidence before proposing changes for the school.',
      sources:
        'Class measurement log; interview with facility management; German Environment Agency teaching material on energy saving; school cafeteria waste notes; student council feedback.',
      customConceptTitle: 'Image prompts and social media kit',
      customConceptText:
        'Social media copy: Class 8b turns energy data into a streaming-style investigation. The project shows measurement, debate, and concrete school climate action in six episodes.\n\nHashtags: #SeriesCreator #SchoolProject #ClimateEducation #MediaEducation\n\nCover prompt: Wide cinematic documentary still of a modern school building at sunrise, students with clipboards and an energy meter in the courtyard, realistic, natural light, no text, 16:9.\n\nEpisode thumbnail prompts: 1. Students measuring classroom devices with a plug-in power meter, realistic documentary photo, no text, 16:9. 2. Thermal-camera-inspired view of classroom windows and radiators, students comparing notes, no text, 16:9. 3. School cafeteria with students weighing food waste and checking regional ingredients, no text, 16:9. 4. Students analyzing charts and spreadsheets on a classroom screen, no text, 16:9. 5. Student climate council presenting findings to teachers, constructive meeting atmosphere, no text, 16:9. 6. Students arranging action cards on a classroom board, practical planning mood, no text, 16:9.',
    };
  }

  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    title: 'Der Klima-Code der Schule',
    author: 'Klasse 8b',
    description:
      'Eine Klasse untersucht, wo im Schulalltag Energie verloren geht, und entwickelt aus Messdaten, Interviews und Beobachtungen einen konkreten Klimaplan.',
    previewBrand: 'SchulStream',
    previewCategory: 'Klassenprojekte',
    matchPercentage: 99,
    ageRating: 'ab 12',
    genre: 'Dokumentation',
    cast: 'Klasse 8b, Energie-AG, Hausmeisterei, SV',
    seasons: [
      {
        id: 'klima-staffel-recherche',
        title: 'Staffel 1: Recherche',
        episodes: [
            {
              id: 'klima-ep-strom',
              title: 'Der Stromdetektiv',
              summary:
                'Die Klasse misst Standby-Verbrauch, Beleuchtung und Gerätenutzung und findet versteckte Energiefresser im Klassenraum.',
              altText: 'Schülerinnen und Schüler messen den Stromverbrauch im Klassenraum.',
            },
            {
              id: 'klima-ep-waerme',
              title: 'Wärme auf der Flucht',
              summary:
                'Temperaturkarten und Raumprotokolle zeigen, wo Fenster, Heizkörper und Routinen zu viel Heizenergie verlieren.',
              altText: 'Schülerinnen und Schüler vergleichen Temperaturmessungen.',
            },
          {
            id: 'klima-ep-mensa',
            title: 'Die Mensa-Bilanz',
            summary:
              'Das Team untersucht Lebensmittelreste, Transportwege und regionale Alternativen für eine klimabewusstere Schulmensa.',
            altText: 'Lernende dokumentieren Lebensmittelreste in einer Schulmensa.',
          },
        ],
      },
      {
        id: 'klima-staffel-massnahmen',
        title: 'Staffel 2: Maßnahmen',
        episodes: [
          {
            id: 'klima-ep-daten',
            title: 'Der Datenbeweis',
            summary:
              'Diagramme, Kostenschätzungen und Kurzinterviews machen aus Beobachtungen belastbare Argumente für die Schulleitung.',
            altText: 'Lernende analysieren Diagramme auf einem Bildschirm.',
          },
          {
            id: 'klima-ep-klimarat',
            title: 'Der Klimarat',
            summary:
              'Gruppen diskutieren Komfort, Kosten, Fairness und Umsetzbarkeit, bevor sie über realistische Maßnahmen abstimmen.',
            altText: 'Eine Klasse präsentiert Klimadaten in einer Schulbesprechung.',
          },
          {
            id: 'klima-ep-montag',
            title: 'Ein Plan für Montag',
            summary:
              'Das Finale bündelt drei Sofortmaßnahmen, zwei mittelfristige Projekte und eine Frage für das nächste Unterrichtsvorhaben.',
            altText: 'Lernende ordnen Aktionskarten an einer Tafel.',
          },
        ],
      },
    ],
    reflection:
      'Das Projekt macht sichtbar, dass Messen, Deuten und Kommunizieren zusammengehören. Die Lernenden trennen Beobachtungen, Vermutungen und Belege, bevor sie konkrete Veränderungen für ihre Schule vorschlagen.',
    sources:
      'Messprotokoll der Klasse; Interview mit der Hausmeisterei; Unterrichtsmaterial des Umweltbundesamts zum Energiesparen; Notizen zur Mensa-Abfallmessung; Rückmeldung der SV.',
    customConceptTitle: 'Bildprompts und Social-Media-Kit',
    customConceptText:
      'Social-Media-Text: Klasse 8b verwandelt Energiedaten in eine Streaming-Recherche. Das Projekt zeigt Messen, Diskutieren und konkrete Klimamaßnahmen für die Schule in sechs Episoden.\n\nHashtags: #SeriesCreator #Schulprojekt #Klimabildung #Medienbildung\n\nCover-Prompt: Wide cinematic documentary still of a modern German school building at sunrise, students with clipboards and an energy meter in the courtyard, realistic, natural light, no text, 16:9.\n\nEpisoden-Prompts: 1. Students measuring classroom devices with a plug-in power meter, realistic documentary photo, no text, 16:9. 2. Thermal-camera-inspired view of classroom windows and radiators, students comparing notes, no text, 16:9. 3. School cafeteria with students weighing food waste and checking regional ingredients, no text, 16:9. 4. Students analyzing charts and spreadsheets on a classroom screen, no text, 16:9. 5. Student climate council presenting findings to teachers, constructive meeting atmosphere, no text, 16:9. 6. Students arranging action cards on a classroom board, practical planning mood, no text, 16:9.',
  };
}

function weimarProject(locale: ExampleLocale): ProjectData {
  if (locale === 'en') {
    return {
      schemaVersion: PROJECT_SCHEMA_VERSION,
      title: 'The Weimar File',
      author: 'History course 10',
      description:
        'A history course stages the Weimar Republic as an investigative series: democratic hopes, crisis pressure, media battles, and questions about responsibility.',
      previewBrand: 'HistoryLab',
      previewCategory: 'History projects',
      matchPercentage: 99,
      ageRating: '16+',
      genre: 'Historical investigation',
      cast: 'History course 10, archive team, press group, debate panel',
      seasons: [
        {
          id: 'weimar-season-republic',
          title: 'Season 1: Democracy Under Pressure',
          episodes: [
            {
              id: 'weimar-ep-constitution',
              title: 'A New Start',
              summary:
                'The opening episode explains the end of empire, the new constitution, and the promises attached to parliamentary democracy.',
              altText: 'Students examine a historical timeline about the Weimar Republic.',
            },
            {
              id: 'weimar-ep-crisis',
              title: 'Inflation in the Street',
              summary:
                'Learners connect hyperinflation, everyday hardship, and political radicalization through fictional eyewitness files.',
              altText: 'Students compare source cards about hyperinflation.',
            },
            {
              id: 'weimar-ep-culture',
              title: 'Night Lights, New Voices',
              summary:
                'The class explores modern culture, gender roles, cinema, and urban life as signs of social change.',
              altText: 'Learners build a classroom collage about Weimar culture.',
            },
          ],
        },
        {
          id: 'weimar-season-breakdown',
          title: 'Season 2: Breakdown',
          episodes: [
            {
              id: 'weimar-ep-propaganda',
              title: 'The Poster War',
              summary:
                'Campaign posters and newspaper excerpts show how political groups fought for attention, fear, and loyalty.',
              altText: 'Students analyze historical election posters in class.',
            },
            {
              id: 'weimar-ep-election',
              title: 'Votes and Violence',
              summary:
                'The episode links election results, street violence, presidential cabinets, and the shrinking room for compromise.',
              altText: 'Students discuss a chart of election results.',
            },
            {
              id: 'weimar-ep-question',
              title: 'Could It Have Been Different?',
              summary:
                'The finale turns the investigation into a moderated classroom debate about causes, responsibility, and democratic resilience.',
              altText: 'Students hold a moderated debate in a history classroom.',
            },
          ],
        },
      ],
      reflection:
        'This example makes chronology, source criticism, perspective taking, and historical judgement visible. Students do not just retell events; they turn evidence into a structured argument.',
      sources:
        'Textbook chapter on the Weimar Republic; selected constitution excerpts; election result tables; historical posters; newspaper source excerpts; classroom debate notes.',
      customConceptTitle: 'Image prompts and social media kit',
      customConceptText:
        'Social media copy: A history course turns the Weimar Republic into a source-based investigation. Six episodes connect democratic beginnings, crisis, media, and responsibility.\n\nHashtags: #SeriesCreator #HistoryClass #WeimarRepublic #DemocracyEducation\n\nCover prompt: Cinematic classroom archive table with Weimar-era documents, election posters, magnifying glass, and students taking notes, realistic historical investigation mood, no text, 16:9.\n\nEpisode thumbnail prompts: 1. Students studying a timeline from empire to republic, documentary classroom photo, no text, 16:9. 2. Source table about hyperinflation with banknotes, notebooks, and student annotations, no text, 16:9. 3. Classroom wall collage about 1920s culture, cinema, art, and social change, no text, 16:9. 4. Students comparing political posters and newspaper clippings, analytical mood, no text, 16:9. 5. Election chart on a classroom screen, students debating in small groups, no text, 16:9. 6. Moderated classroom debate with source cards on desks, serious but constructive mood, no text, 16:9.',
    };
  }

  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    title: 'Die Akte Weimar',
    author: 'Geschichtskurs 10',
    description:
      'Ein Geschichtskurs inszeniert die Weimarer Republik als Recherche-Serie: demokratische Hoffnungen, Krisendruck, Medienkämpfe und Fragen nach Verantwortung.',
    previewBrand: 'HistoryLab',
    previewCategory: 'Geschichtsprojekte',
    matchPercentage: 99,
    ageRating: 'ab 16',
    genre: 'Historische Recherche',
    cast: 'Geschichtskurs 10, Archivteam, Pressegruppe, Debattenrunde',
    seasons: [
      {
        id: 'weimar-staffel-republik',
        title: 'Staffel 1: Demokratie unter Druck',
        episodes: [
          {
            id: 'weimar-ep-verfassung',
            title: 'Ein neuer Anfang',
            summary:
              'Die Auftaktfolge erklärt das Ende des Kaiserreichs, die neue Verfassung und die Versprechen der parlamentarischen Demokratie.',
            altText: 'Lernende untersuchen eine historische Zeitleiste zur Weimarer Republik.',
          },
          {
            id: 'weimar-ep-krise',
            title: 'Inflation auf der Straße',
            summary:
              'Die Lernenden verbinden Hyperinflation, Alltagserfahrungen und politische Radikalisierung mit fiktiven Quellenakten.',
            altText: 'Schülerinnen und Schüler vergleichen Quellenkarten zur Hyperinflation.',
          },
          {
            id: 'weimar-ep-kultur',
            title: 'Lichter der Moderne',
            summary:
              'Die Klasse untersucht Kultur, Rollenbilder, Kino und Stadtleben als Zeichen gesellschaftlicher Veränderung.',
            altText: 'Lernende bauen eine Collage zur Kultur der Weimarer Republik.',
          },
        ],
      },
      {
        id: 'weimar-staffel-zerfall',
        title: 'Staffel 2: Zerfall',
        episodes: [
          {
            id: 'weimar-ep-propaganda',
            title: 'Der Plakatkrieg',
            summary:
              'Wahlplakate und Zeitungsausschnitte zeigen, wie politische Gruppen um Aufmerksamkeit, Angst und Loyalität kämpfen.',
            altText: 'Lernende analysieren historische Wahlplakate im Unterricht.',
          },
          {
            id: 'weimar-ep-wahl',
            title: 'Stimmen und Gewalt',
            summary:
              'Die Folge verknüpft Wahlergebnisse, Straßengewalt, Präsidialkabinette und den schwindenden Raum für Kompromisse.',
            altText: 'Lernende diskutieren ein Diagramm mit Wahlergebnissen.',
          },
          {
            id: 'weimar-ep-frage',
            title: 'Hätte es anders kommen können?',
            summary:
              'Das Finale macht aus der Recherche eine moderierte Klassendebatte über Ursachen, Verantwortung und demokratische Widerstandsfähigkeit.',
            altText: 'Eine Klasse führt eine moderierte Debatte im Geschichtsraum.',
          },
        ],
      },
    ],
    reflection:
      'Dieses Beispiel macht Chronologie, Quellenkritik, Perspektivübernahme und historische Urteilsbildung sichtbar. Die Lernenden erzählen Ereignisse nicht nur nach, sondern formen aus Belegen eine strukturierte Argumentation.',
    sources:
      'Schulbuchkapitel zur Weimarer Republik; ausgewählte Verfassungsauszüge; Wahlergebnistabellen; historische Plakate; Zeitungsauszüge; Notizen aus der Klassendebatte.',
    customConceptTitle: 'Bildprompts und Social-Media-Kit',
    customConceptText:
      'Social-Media-Text: Ein Geschichtskurs verwandelt die Weimarer Republik in eine quellenbasierte Recherche. Sechs Episoden verbinden demokratischen Anfang, Krise, Medien und Verantwortung.\n\nHashtags: #SeriesCreator #Geschichtsunterricht #WeimarerRepublik #Demokratiebildung\n\nCover-Prompt: Cinematic classroom archive table with Weimar-era documents, election posters, magnifying glass, and students taking notes, realistic historical investigation mood, no text, 16:9.\n\nEpisoden-Prompts: 1. Students studying a timeline from empire to republic, documentary classroom photo, no text, 16:9. 2. Source table about hyperinflation with banknotes, notebooks, and student annotations, no text, 16:9. 3. Classroom wall collage about 1920s culture, cinema, art, and social change, no text, 16:9. 4. Students comparing political posters and newspaper clippings, analytical mood, no text, 16:9. 5. Election chart on a classroom screen, students debating in small groups, no text, 16:9. 6. Moderated classroom debate with source cards on desks, serious but constructive mood, no text, 16:9.',
  };
}

export function getExampleProjects(locale: ExampleLocale): ExampleProject[] {
  const climate = climateProject(locale);
  const weimar = weimarProject(locale);

  if (locale === 'en') {
    return [
      {
        id: 'school-climate-code',
        title: climate.title,
        subtitle: 'Climate education as a streaming investigation',
        subject: 'Science, geography, politics',
        grade: 'Grade 8',
        summary:
          'A complete school example with measured data, interviews, two seasons, six episodes, reflection, sources, image prompts, and social copy.',
        featureHighlights: [
          'Two seasons with ordered episodes',
          'Author and automatically calculated 100% project status',
          'Concept and source tabs filled',
          'Image prompts and social media kit in the custom section',
        ],
        socialCopy:
          'Class 8b turns energy data into a streaming-style climate investigation with concrete action for the school.',
        hashtags: ['#SeriesCreator', '#SchoolProject', '#ClimateEducation', '#MediaEducation'],
        imagePrompts: [
          'Modern school building at sunrise, students with clipboards and energy meter, realistic documentary still, no text, 16:9.',
          'Student climate council presenting energy findings to teachers, constructive meeting atmosphere, no text, 16:9.',
        ],
        project: climate,
      },
      {
        id: 'weimar-file',
        title: weimar.title,
        subtitle: 'History as a source-based investigation',
        subject: 'History, politics, media education',
        grade: 'Grade 10',
        summary:
          'A historical investigation series with archival sources, political debate, media analysis, image prompts, and social copy.',
        featureHighlights: [
          'Historical chronology across two seasons',
          'Author and automatically calculated 100% project status',
          'Source criticism and debate in episode summaries',
          'Concept tab includes reusable social media material',
        ],
        socialCopy:
          'A history course turns the Weimar Republic into a six-episode source investigation about democracy under pressure.',
        hashtags: ['#SeriesCreator', '#HistoryClass', '#WeimarRepublic', '#DemocracyEducation'],
        imagePrompts: [
          'Classroom archive table with Weimar-era documents, election posters, magnifying glass, realistic investigation mood, no text, 16:9.',
          'Moderated classroom debate with source cards on desks, serious but constructive mood, no text, 16:9.',
        ],
        project: weimar,
      },
    ];
  }

  return [
    {
      id: 'school-climate-code',
      title: climate.title,
      subtitle: 'Klimabildung als Streaming-Recherche',
      subject: 'Naturwissenschaften, Erdkunde, Politik',
      grade: 'Klasse 8',
      summary:
        'Ein vollständiges Schulbeispiel mit Messdaten, Interviews, zwei Staffeln, sechs Episoden, Reflexion, Quellen, Bildprompts und Social-Media-Text.',
      featureHighlights: [
        'Zwei Staffeln mit sortierten Episoden',
        'Urheber:in und automatisch berechneter Projektstatus von 100 %',
        'Konzept- und Quellenbereiche ausgefüllt',
        'Bildprompts und Social-Media-Kit in der eigenen Rubrik',
      ],
      socialCopy:
        'Klasse 8b verwandelt Energiedaten in eine Streaming-Recherche mit konkreten Klimamaßnahmen für die Schule.',
      hashtags: ['#SeriesCreator', '#Schulprojekt', '#Klimabildung', '#Medienbildung'],
      imagePrompts: [
        'Modern German school building at sunrise, students with clipboards and energy meter, realistic documentary still, no text, 16:9.',
        'Student climate council presenting energy findings to teachers, constructive meeting atmosphere, no text, 16:9.',
      ],
      project: climate,
    },
    {
      id: 'weimar-file',
      title: weimar.title,
      subtitle: 'Geschichte als quellenbasierte Recherche',
      subject: 'Geschichte, Politik, Medienbildung',
      grade: 'Klasse 10',
      summary:
        'Eine historische Recherche-Serie mit Archivquellen, politischer Debatte, Medienanalyse, Bildprompts und Social-Media-Text.',
      featureHighlights: [
        'Historische Chronologie über zwei Staffeln',
        'Urheber:in und automatisch berechneter Projektstatus von 100 %',
        'Quellenkritik und Debatte in Episoden sichtbar',
        'Konzept-Tab enthält wiederverwendbares Social-Media-Material',
      ],
    socialCopy:
      'Ein Geschichtskurs verwandelt die Weimarer Republik in eine sechsteilige Quellenrecherche über Demokratie unter Druck.',
      hashtags: ['#SeriesCreator', '#Geschichtsunterricht', '#WeimarerRepublik', '#Demokratiebildung'],
      imagePrompts: [
        'Classroom archive table with Weimar-era documents, election posters, magnifying glass, realistic investigation mood, no text, 16:9.',
        'Moderated classroom debate with source cards on desks, serious but constructive mood, no text, 16:9.',
      ],
      project: weimar,
    },
  ];
}

export function createSchoolEnergyExampleProject(locale: ExampleLocale): ProjectData {
  return climateProject(locale);
}
