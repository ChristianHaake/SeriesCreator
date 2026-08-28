import { fieldLimits, resourceLimits } from './constraints';
import type { Episode, ProjectData, Season } from '../types';
import { initialProjectData } from '../types';

export const PROJECT_SCHEMA_VERSION = 2;
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
  // Validate the full payload: prefix AND a clean base64 body. Checking only the
  // prefix would let stray characters (e.g. `")`) survive into inline style url(...).
  if (!/^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/]+={0,2}$/i.test(value)) {
    return undefined;
  }
  return value;
}

function asOptionalPercentage(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeEpisode(value: unknown, index: number): Episode | null {
  if (!isRecord(value)) return null;
  if (typeof value.title !== 'string' || typeof value.summary !== 'string') {
    return null;
  }

  return {
    id: limitText(value.id, 80) || `ep_${index + 1}`,
    title: limitText(value.title, fieldLimits.episodeTitle) || 'Neue Episode',
    summary: limitText(value.summary, fieldLimits.episodeSummary),
    learningDepth: limitText(value.learningDepth, fieldLimits.episodeLearningDepth) || undefined,
    thumbnailUrl: asOptionalImageUrl(value.thumbnailUrl),
    altText: limitText(value.altText, fieldLimits.altText) || undefined,
  };
}

function normalizeSeason(value: unknown, index: number): Season | null {
  if (!isRecord(value) || !Array.isArray(value.episodes)) return null;
  if (typeof value.title !== 'string') return null;
  if (!Array.isArray(value.episodes)) return null;
  if (value.episodes.length > resourceLimits.maxEpisodesPerSeason) return null;

  const episodes = value.episodes.map(normalizeEpisode).filter((e): e is Episode => e !== null);
  if (episodes.length !== value.episodes.length) return null; // Abort if any episode was invalid

  return {
    id: limitText(value.id, 80) || `s_${index + 1}`,
    title: limitText(value.title, fieldLimits.seasonTitle) || `Staffel ${index + 1}`,
    episodes: episodes as Episode[],
  };
}

export function normalizeProject(value: unknown): ProjectParseResult {
  if (!isRecord(value)) {
    return { ok: false, message: 'Projektdatei enthält kein gültiges Objekt.' };
  }

  const rawVersion = value.schemaVersion === undefined ? 1 : value.schemaVersion;
  if (
    typeof rawVersion !== 'number' ||
    !Number.isInteger(rawVersion) ||
    rawVersion < 1 ||
    rawVersion > PROJECT_SCHEMA_VERSION
  ) {
    return {
      ok: false,
      message: 'Projektdatei verwendet eine nicht unterstützte Schema-Version.',
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
    return { ok: false, message: 'Projektdatei enthält ungültige Staffeln oder Episoden.' };
  }

  // Schema 1 projects did not contain learningDepth. Normalizing the optional
  // value below is the explicit forward migration to schema 2.
  const data: ProjectData = {
    ...initialProjectData,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    title: limitText(value.title, fieldLimits.title, initialProjectData.title),
    author: limitText(value.author, fieldLimits.author),
    description: limitText(
      value.description,
      fieldLimits.description,
      initialProjectData.description,
    ),
    coverUrl: asOptionalImageUrl(value.coverUrl),
    previewBrand: limitText(
      value.previewBrand,
      fieldLimits.previewBrand,
      initialProjectData.previewBrand,
    ),
    previewCategory: limitText(
      value.previewCategory,
      fieldLimits.previewCategory,
      initialProjectData.previewCategory,
    ),
    matchPercentage: asOptionalPercentage(value.matchPercentage) ?? initialProjectData.matchPercentage,
    completionOverride: asOptionalPercentage(value.completionOverride),
    ageRating: limitText(value.ageRating, fieldLimits.ageRating, initialProjectData.ageRating),
    genre: limitText(value.genre, fieldLimits.genre, initialProjectData.genre),
    cast: limitText(value.cast, fieldLimits.cast, initialProjectData.cast),
    seasons: seasons as Season[],
    reflection: limitText(value.reflection, fieldLimits.reflection) || undefined,
    sources: limitText(value.sources, fieldLimits.sources) || undefined,
    customConceptTitle:
      limitText(value.customConceptTitle, fieldLimits.customConceptTitle) || undefined,
    customConceptText:
      limitText(value.customConceptText, fieldLimits.customConceptText) || undefined,
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

export function isProjectFileSizeWithinLimit(data: ProjectData) {
  return new Blob([serializeProject(data)]).size <= resourceLimits.projectFileBytes;
}

// Shared filename base so project (.seriescreator) and HTML exports sanitize
// titles identically (umlauts kept, whitespace collapsed, capped at 60 chars).
export function makeExportBaseName(title: string, fallback: string) {
  return (
    title
      .trim()
      .replace(/[^a-z0-9äöüß _-]/gi, '')
      .replace(/\s+/g, '-')
      .slice(0, 60) || fallback
  );
}

export function makeProjectFilename(title: string) {
  return `${makeExportBaseName(title, 'SeriesCreator-Projekt')}.${PROJECT_FILE_EXTENSION}`;
}
