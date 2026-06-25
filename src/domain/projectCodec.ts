import { fieldLimits, resourceLimits } from './constraints';
import type { Episode, ProjectData, Season } from '../types';
import { initialProjectData } from '../types';

export const PROJECT_SCHEMA_VERSION = 1;
export const PROJECT_FILE_EXTENSION = 'seriescreator';
export const PROJECT_FILE_MIME_TYPE = 'application/json';

export type ProjectParseResult =
  | { ok: true; data: ProjectData }
  | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function limitText(value: unknown, limit: number, fallback = '') {
  return asString(value, fallback).slice(0, limit);
}

function asOptionalImageUrl(value: unknown) {
  if (typeof value !== 'string' || value.length === 0) return undefined;
  if (value.length > resourceLimits.dataUrlLength) return undefined;
  if (!/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(value)) return undefined;
  return value;
}

function normalizeEpisode(value: unknown, index: number): Episode | null {
  if (!isRecord(value)) return null;
  if (typeof value.title !== 'string' || typeof value.summary !== 'string') {
    return null;
  }

  return {
    id: limitText(value.id, 80, `ep_${index + 1}`),
    title: limitText(value.title, fieldLimits.episodeTitle, 'Neue Episode'),
    summary: limitText(value.summary, fieldLimits.episodeSummary),
    notes: limitText(value.notes, fieldLimits.episodeSummary) || undefined,
    duration: limitText(value.duration, 40) || undefined,
    thumbnailUrl: asOptionalImageUrl(value.thumbnailUrl),
    altText: limitText(value.altText, fieldLimits.altText) || undefined,
  };
}

function normalizeSeason(value: unknown, index: number): Season | null {
  if (!isRecord(value) || !Array.isArray(value.episodes)) return null;
  if (typeof value.title !== 'string') return null;
  if (value.episodes.length > resourceLimits.maxEpisodesPerSeason) return null;

  const episodes = value.episodes.map(normalizeEpisode);
  if (episodes.some((episode) => episode === null)) return null;

  return {
    id: limitText(value.id, 80, `s_${index + 1}`),
    title: limitText(value.title, fieldLimits.seasonTitle, `Staffel ${index + 1}`),
    episodes: episodes as Episode[],
  };
}

export function normalizeProject(value: unknown): ProjectParseResult {
  if (!isRecord(value)) {
    return { ok: false, message: 'Projektdatei enthält kein gültiges Objekt.' };
  }

  const rawVersion = value.schemaVersion;
  if (typeof rawVersion === 'number' && rawVersion > PROJECT_SCHEMA_VERSION) {
    return {
      ok: false,
      message: 'Projektdatei wurde mit einer neueren SeriesCreator-Version gespeichert.',
    };
  }

  if (!Array.isArray(value.seasons)) {
    return { ok: false, message: 'Projektdatei enthält keine gültigen Staffeln.' };
  }

  if (
    value.seasons.length < resourceLimits.minSeasons ||
    value.seasons.length > resourceLimits.maxSeasons
  ) {
    return { ok: false, message: 'Projektdatei enthält zu viele oder keine Staffeln.' };
  }

  const seasons = value.seasons.map(normalizeSeason);
  if (seasons.some((season) => season === null)) {
    return { ok: false, message: 'Projektdatei enthält ungültige Episoden.' };
  }

  const data: ProjectData = {
    ...initialProjectData,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    title: limitText(value.title, fieldLimits.title, initialProjectData.title),
    subject: limitText(value.subject, 120),
    topic: limitText(value.topic, 120),
    author: limitText(value.author, 120),
    description: limitText(
      value.description,
      fieldLimits.description,
      initialProjectData.description,
    ),
    coverUrl: asOptionalImageUrl(value.coverUrl),
    matchPercentage:
      typeof value.matchPercentage === 'number'
        ? Math.max(0, Math.min(100, Math.round(value.matchPercentage)))
        : initialProjectData.matchPercentage,
    ageRating: limitText(value.ageRating, 40, initialProjectData.ageRating),
    genre: limitText(value.genre, 80, initialProjectData.genre),
    cast: limitText(value.cast, fieldLimits.cast, initialProjectData.cast),
    seasons: seasons as Season[],
    reflection: limitText(value.reflection, fieldLimits.reflection) || undefined,
    learningObjectives:
      limitText(value.learningObjectives, fieldLimits.reflection) || undefined,
    sources: limitText(value.sources, fieldLimits.sources) || undefined,
  };

  return { ok: true, data };
}

export function parseProjectJson(text: string): ProjectParseResult {
  if (new Blob([text]).size > resourceLimits.projectFileBytes) {
    return { ok: false, message: 'Projektdatei ist zu groß.' };
  }

  try {
    return normalizeProject(JSON.parse(text));
  } catch {
    return { ok: false, message: 'Projektdatei ist kein gültiges JSON.' };
  }
}

export function serializeProject(data: ProjectData) {
  return JSON.stringify(
    {
      ...data,
      schemaVersion: PROJECT_SCHEMA_VERSION,
    },
    null,
    2,
  );
}

export function makeProjectFilename(title: string) {
  const base = title
    .trim()
    .replace(/[^a-z0-9äöüß _-]/gi, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);

  return `${base || 'SeriesCreator-Projekt'}.${PROJECT_FILE_EXTENSION}`;
}
