export interface Episode {
  id: string;
  title: string;
  summary: string;
  notes?: string;
  duration?: string;
  thumbnailUrl?: string; // Optional image URL or base64
  altText?: string; // Alt text for accessibility
}

export interface Season {
  id: string;
  title: string;
  episodes: Episode[];
}

export interface ProjectData {
  title: string;
  subject: string;
  topic: string;
  author: string;
  description: string;
  coverUrl?: string;
  
  // New meta fields from Streaming concept
  matchPercentage: number;
  ageRating: string; // e.g. "Klasse 8+"
  genre: string;
  cast: string;
  
  seasons: Season[];
  
  reflection?: string;
  learningObjectives?: string;
  sources?: string;
}

export const initialProjectData: ProjectData = {
  title: "Meine Neue Serie",
  subject: "",
  topic: "",
  author: "",
  description: "Eine fesselnde Reise durch das Thema...",
  matchPercentage: 99,
  ageRating: "Klasse 8+",
  genre: "Dokumentation",
  cast: "Die Klasse",
  seasons: [
    {
      id: "s1",
      title: "Staffel 1",
      episodes: []
    }
  ],
};
