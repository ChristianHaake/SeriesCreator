export interface Episode {
  id: string;
  title: string;
  summary: string;
  learningDepth?: string;
  thumbnailUrl?: string; // Optional image URL or base64
  altText?: string; // Alt text for accessibility
}

export interface Season {
  id: string;
  title: string;
  episodes: Episode[];
}

export interface ProjectData {
  schemaVersion: number;
  title: string;
  author: string;
  description: string;
  coverUrl?: string;
  previewBrand: string;
  previewCategory: string;
  
  // Legacy meta field retained for older project backups.
  matchPercentage: number;
  completionOverride?: number;
  ageRating: string; // e.g. "Klasse 8+"
  genre: string;
  cast: string;
  
  seasons: Season[];
  
  reflection?: string;
  sources?: string;
  customConceptTitle?: string;
  customConceptText?: string;
}

type InitialLocale = 'de' | 'en';

// Locale-specific text for a fresh project.
const initialProjectText: Record<InitialLocale, {
  title: string;
  description: string;
  previewCategory: string;
  cast: string;
  seasonTitle: string;
  genre: string;
  ageRating: string;
}> = {
  de: {
    title: "Meine Neue Serie",
    description: "Eine fesselnde Reise durch das Thema...",
    previewCategory: "Klassenprojekte",
    cast: "Die Klasse",
    seasonTitle: "Staffel 1",
    genre: "Dokumentation",
    ageRating: "ab 12",
  },
  en: {
    title: "My New Series",
    description: "A captivating journey through the topic...",
    previewCategory: "Class projects",
    cast: "The class",
    seasonTitle: "Season 1",
    genre: "Documentary",
    ageRating: "12+",
  },
};

export function createInitialProjectData(locale: InitialLocale = 'de'): ProjectData {
  const text = initialProjectText[locale];
  return {
    schemaVersion: 2,
    title: text.title,
    author: "",
    description: text.description,
    previewBrand: "SeriesCreator",
    previewCategory: text.previewCategory,
    matchPercentage: 99,
    ageRating: text.ageRating,
    genre: text.genre,
    cast: text.cast,
    seasons: [
      {
        id: "s1",
        title: text.seasonTitle,
        episodes: [],
      },
    ],
  };
}

export const initialProjectData: ProjectData = createInitialProjectData('de');
