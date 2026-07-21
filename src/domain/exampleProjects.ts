import type { ProjectData } from '../types';
import { PROJECT_SCHEMA_VERSION } from './projectCodec';

type ExampleLocale = 'de' | 'en';

export function createSchoolEnergyExampleProject(locale: ExampleLocale): ProjectData {
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
      customConceptTitle: 'Image prompts for generative AI',
      customConceptText:
        'Cover: Wide cinematic documentary still of a modern school building at sunrise, students with clipboards and an energy meter in the courtyard, realistic, natural light, no text, 16:9.\n\nEpisode thumbnails: 1. Students measuring classroom devices with a plug-in power meter, realistic documentary photo, no text, 16:9. 2. Thermal-camera-inspired view of classroom windows and radiators, students comparing notes, no text, 16:9. 3. School cafeteria with students weighing food waste and checking regional ingredients, no text, 16:9. 4. Students analyzing charts and spreadsheets on a classroom screen, no text, 16:9. 5. Student climate council presenting findings to teachers, constructive meeting atmosphere, no text, 16:9. 6. Students arranging action cards on a classroom board, practical planning mood, no text, 16:9.',
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
            altText: 'Schuelerinnen und Schueler messen den Stromverbrauch im Klassenraum.',
          },
          {
            id: 'klima-ep-waerme',
            title: 'Wärme auf der Flucht',
            summary:
              'Temperaturkarten und Raumprotokolle zeigen, wo Fenster, Heizkörper und Routinen zu viel Heizenergie verlieren.',
            altText: 'Schuelerinnen und Schueler vergleichen Temperaturmessungen.',
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
            altText: 'Eine Klasse praesentiert Klimadaten in einer Schulbesprechung.',
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
    customConceptTitle: 'Bildprompts für generative KI',
    customConceptText:
      'Cover: Wide cinematic documentary still of a modern German school building at sunrise, students with clipboards and an energy meter in the courtyard, realistic, natural light, no text, 16:9.\n\nEpisoden-Thumbnails: 1. Students measuring classroom devices with a plug-in power meter, realistic documentary photo, no text, 16:9. 2. Thermal-camera-inspired view of classroom windows and radiators, students comparing notes, no text, 16:9. 3. School cafeteria with students weighing food waste and checking regional ingredients, no text, 16:9. 4. Students analyzing charts and spreadsheets on a classroom screen, no text, 16:9. 5. Student climate council presenting findings to teachers, constructive meeting atmosphere, no text, 16:9. 6. Students arranging action cards on a classroom board, practical planning mood, no text, 16:9.',
  };
}
