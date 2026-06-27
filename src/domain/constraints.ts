export const fieldLimits = {
  title: 100,
  previewBrand: 60,
  description: 2000,
  cast: 200,
  episodeTitle: 100,
  episodeSummary: 1000,
  altText: 125,
  reflection: 5000,
  sources: 5000,
  seasonTitle: 60,
} as const;

export const resourceLimits = {
  projectFileBytes: 2_000_000,
  imageFileBytes: 5_000_000,
  imageMaxEdge: 4096,
  imageOutputWidth: 800,
  dataUrlLength: 1_500_000,
  minSeasons: 1,
  maxSeasons: 20,
  maxEpisodesPerSeason: 100,
} as const;
