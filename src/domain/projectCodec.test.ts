import { describe, expect, it } from 'vitest';
import {
  PROJECT_SCHEMA_VERSION,
  makeProjectFilename,
  parseProjectJson,
  serializeProject,
} from './projectCodec';
import { initialProjectData } from '../types';
import { calculateProjectCompletion, displayCompletion } from './completion';

describe('projectCodec', () => {
  it('normalizes legacy project JSON without replacing it blindly', () => {
    const result = parseProjectJson(
      JSON.stringify({
        title: 'Legacy',
        description: 'Old project',
        matchPercentage: 88.8,
        ageRating: 'ab 12',
        genre: 'Dokumentation',
        cast: 'Klasse 8',
        seasons: [{ id: 's1', title: 'Staffel 1', episodes: [] }],
      }),
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.schemaVersion).toBe(PROJECT_SCHEMA_VERSION);
      expect(result.data.title).toBe('Legacy');
      expect(result.data.previewBrand).toBe('SeriesCreator');
      expect(result.data.matchPercentage).toBe(89);
    }
  });

  it('rejects unsupported future schema versions', () => {
    const result = parseProjectJson(
      JSON.stringify({
        ...initialProjectData,
        schemaVersion: PROJECT_SCHEMA_VERSION + 1,
      }),
    );

    expect(result.ok).toBe(false);
  });

  it('rejects invalid season and episode shapes', () => {
    const result = parseProjectJson(
      JSON.stringify({
        ...initialProjectData,
        seasons: [{ id: 's1', title: 'Staffel 1', episodes: [{}] }],
      }),
    );

    expect(result.ok).toBe(false);
  });

  it('serializes with the current schema version', () => {
    const serialized = JSON.parse(serializeProject(initialProjectData)) as {
      schemaVersion: number;
    };

    expect(serialized.schemaVersion).toBe(PROJECT_SCHEMA_VERSION);
  });

  it('calculates project completion and respects custom completion override', () => {
    expect(calculateProjectCompletion(initialProjectData)).toBe(60);
    expect(displayCompletion({ ...initialProjectData, completionOverride: 72 })).toBe(72);
  });

  it('creates stable SeriesCreator backup filenames', () => {
    expect(makeProjectFilename('Meine Serie!')).toBe('Meine-Serie.seriescreator');
    expect(makeProjectFilename('')).toBe('SeriesCreator-Projekt.seriescreator');
  });
});
