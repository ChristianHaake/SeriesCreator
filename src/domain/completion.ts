import type { ProjectData } from '../types';

function hasText(value: string | undefined) {
  return Boolean(value?.trim());
}

export function calculateProjectCompletion(data: ProjectData) {
  const checks = [
    hasText(data.title),
    hasText(data.description),
    hasText(data.ageRating),
    hasText(data.genre),
    hasText(data.cast),
    data.seasons.length > 0,
    data.seasons.some((season) => season.episodes.length > 0),
    data.seasons.some((season) =>
      season.episodes.some((episode) => hasText(episode.title) && hasText(episode.summary)),
    ),
    hasText(data.reflection) || hasText(data.learningObjectives),
    hasText(data.sources),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

export function displayCompletion(data: ProjectData) {
  return data.completionOverride ?? calculateProjectCompletion(data);
}
