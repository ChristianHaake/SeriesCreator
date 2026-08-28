import { describe, expect, it } from 'vitest';
import {
  PROJECT_SCHEMA_VERSION,
  isProjectFileSizeWithinLimit,
  makeProjectFilename,
  parseProjectJson,
  serializeProject,
} from './projectCodec';
import { initialProjectData } from '../types';
import { calculateProjectCompletion, displayCompletion } from './completion';
import { fieldLimits } from './constraints';

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
      expect(result.data.seasons[0].episodes).toEqual([]);
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
        schemaVersion: 1,
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

  it('keeps optional episode learning depth while accepting legacy episodes without it', () => {
    const withLearningDepth = parseProjectJson(
      JSON.stringify({
        ...initialProjectData,
        seasons: [{ id: 's1', title: 'Staffel 1', episodes: [{ id: 'ep1', title: 'Eins', summary: 'Kurz', learningDepth: 'Kernaussage\nBeleg' }] }],
      }),
    );
    const legacy = parseProjectJson(
      JSON.stringify({
        ...initialProjectData,
        schemaVersion: 1,
        seasons: [{ id: 's1', title: 'Staffel 1', episodes: [{ id: 'ep1', title: 'Eins', summary: 'Kurz' }] }],
      }),
    );

    expect(withLearningDepth.ok && withLearningDepth.data.seasons[0].episodes[0].learningDepth).toBe('Kernaussage\nBeleg');
    expect(legacy.ok && legacy.data.seasons[0].episodes[0].learningDepth).toBeUndefined();

    if (withLearningDepth.ok) {
      const roundTrip = parseProjectJson(serializeProject(withLearningDepth.data));
      expect(roundTrip.ok && roundTrip.data.schemaVersion).toBe(PROJECT_SCHEMA_VERSION);
      expect(roundTrip.ok && roundTrip.data.seasons[0].episodes[0].learningDepth).toBe('Kernaussage\nBeleg');
    }
  });

  it('rejects invalid schema versions and keeps the initial schema current', () => {
    const invalidVersion = parseProjectJson(JSON.stringify({ ...initialProjectData, schemaVersion: 1.5 }));
    expect(invalidVersion.ok).toBe(false);
    expect(initialProjectData.schemaVersion).toBe(PROJECT_SCHEMA_VERSION);
  });

  it('discards invalid optional episode learning depth and truncates long text', () => {
    const result = parseProjectJson(
      JSON.stringify({
        ...initialProjectData,
        seasons: [{ id: 's1', title: 'Staffel 1', episodes: [{ id: 'ep1', title: 'Eins', summary: 'Kurz', learningDepth: 42 }] }],
      }),
    );

    expect(result.ok && result.data.seasons[0].episodes[0].learningDepth).toBeUndefined();

    const longText = parseProjectJson(
      JSON.stringify({
        ...initialProjectData,
        seasons: [{ id: 's1', title: 'Staffel 1', episodes: [{ id: 'ep1', title: 'Eins', summary: 'Kurz', learningDepth: 'x'.repeat(fieldLimits.episodeLearningDepth + 1) }] }],
      }),
    );
    expect(longText.ok && longText.data.seasons[0].episodes[0].learningDepth).toHaveLength(fieldLimits.episodeLearningDepth);
  });

  it('prevents exporting project files that cannot be imported again', () => {
    expect(isProjectFileSizeWithinLimit(initialProjectData)).toBe(true);
    expect(
      isProjectFileSizeWithinLimit({
        ...initialProjectData,
        coverUrl: `data:image/jpeg;base64,${'A'.repeat(25_000_000)}`,
      }),
    ).toBe(false);
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
