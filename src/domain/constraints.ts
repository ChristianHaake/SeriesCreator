export const fieldLimits = {
  title: 100,
  author: 120,
  previewBrand: 60,
  previewCategory: 60,
  description: 2000,
  ageRating: 40,
  genre: 80,
  cast: 200,
  episodeTitle: 100,
  episodeSummary: 1000,
  altText: 125,
  reflection: 5000,
  sources: 5000,
  customConceptTitle: 100,
  customConceptText: 5000,
  seasonTitle: 60,
} as const;

export const resourceLimits = {
  projectFileBytes: 25_000_000,
  coverOutputWidth: 1920,
  episodeOutputWidth: 800,
  maxImageInputPixels: 60_000_000,
  dataUrlLength: 1_500_000,
  minSeasons: 1,
  maxSeasons: 20,
  maxEpisodesPerSeason: 100,
} as const;
