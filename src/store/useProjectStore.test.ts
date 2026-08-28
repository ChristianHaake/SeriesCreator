import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { initialProjectData } from '../types';
import { resourceLimits } from '../domain/constraints';
import { loadStoredProject, saveStoredProject, useProjectStore, UNREADABLE_BACKUP_KEY } from './useProjectStore';
import { LocaleProvider } from '../i18n';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe('project storage', () => {
  it('restores valid saved projects', () => {
    const storage = new MemoryStorage();
    const saved = { ...initialProjectData, title: 'Saved Project' };

    expect(saveStoredProject(storage, saved)).toBe(true);
    expect(loadStoredProject(storage).data.title).toBe('Saved Project');
  });

  it('falls back to the default project for corrupt storage', () => {
    const storage = new MemoryStorage();
    storage.setItem('series_creator_data', '{');

    expect(loadStoredProject(storage).data.title).toBe(initialProjectData.title);
  });

  it('keeps unreadable saved data instead of letting it be overwritten', () => {
    const storage = new MemoryStorage();
    const originalBytes = '{"title":"Six weeks of work","seasons":[';
    storage.setItem('series_creator_data', originalBytes);

    const loaded = loadStoredProject(storage);

    expect(loaded.unreadable).toBe(true);
    expect(storage.getItem(UNREADABLE_BACKUP_KEY)).toBe(originalBytes);
  });

  it('keeps data that parses but fails validation', () => {
    const storage = new MemoryStorage();
    const originalBytes = JSON.stringify({ schemaVersion: 99, title: 'Kept', seasons: 'not-an-array' });
    storage.setItem('series_creator_data', originalBytes);

    const loaded = loadStoredProject(storage);

    expect(loaded.unreadable).toBe(true);
    expect(storage.getItem(UNREADABLE_BACKUP_KEY)).toBe(originalBytes);
  });

  it('reports a clean load as readable', () => {
    const storage = new MemoryStorage();
    saveStoredProject(storage, { ...initialProjectData, title: 'Fine' });

    const loaded = loadStoredProject(storage);

    expect(loaded.unreadable).toBe(false);
    expect(storage.getItem(UNREADABLE_BACKUP_KEY)).toBeNull();
  });

  it('reports blocked storage writes without throwing', () => {
    const blockedStorage = {
      setItem() {
        throw new Error('blocked');
      },
    } as unknown as Storage;

    expect(saveStoredProject(blockedStorage, initialProjectData)).toBe(false);
  });
});

describe('useProjectStore hook mutations', () => {
  it('adds and removes episodes', () => {
    const { result } = renderHook(() => useProjectStore(), {
      wrapper: LocaleProvider
    });
    
    act(() => {
      result.current.resetData();
    });
    
    const initialSeasonId = result.current.data.seasons[0].id;
    const initialEpisodesCount = result.current.data.seasons[0].episodes.length;
    
    act(() => {
      result.current.addEpisode(initialSeasonId);
    });
    
    expect(result.current.data.seasons[0].episodes.length).toBe(initialEpisodesCount + 1);
    const newEpisodeId = result.current.data.seasons[0].episodes[initialEpisodesCount].id;

    act(() => {
      result.current.updateEpisode(initialSeasonId, newEpisodeId, { learningDepth: 'Kernaussage und Beleg' });
    });
    expect(result.current.data.seasons[0].episodes[initialEpisodesCount].learningDepth).toBe('Kernaussage und Beleg');
    
    act(() => {
      result.current.removeEpisode(initialSeasonId, newEpisodeId);
    });
    
    expect(result.current.data.seasons[0].episodes.length).toBe(initialEpisodesCount);
  });

  it('does not add episodes beyond the project format limit', () => {
    const { result } = renderHook(() => useProjectStore(), {
      wrapper: LocaleProvider,
    });
    const seasonId = result.current.data.seasons[0].id;
    const episodes = Array.from(
      { length: resourceLimits.maxEpisodesPerSeason },
      (_, index) => ({
        id: `ep_${index}`,
        title: `Episode ${index + 1}`,
        summary: '',
      }),
    );

    act(() => {
      result.current.replaceData({
        ...result.current.data,
        seasons: [{ ...result.current.data.seasons[0], episodes }],
      });
    });
    act(() => {
      result.current.addEpisode(seasonId);
    });

    expect(result.current.data.seasons[0].episodes).toHaveLength(
      resourceLimits.maxEpisodesPerSeason,
    );
  });
});
