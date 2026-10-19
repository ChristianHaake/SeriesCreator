import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { initialProjectData } from '../types';
import { resourceLimits } from '../domain/constraints';
import {
  loadStoredProject,
  saveStoredProject,
  STORAGE_KEY,
  UNREADABLE_BACKUP_KEY,
  useProjectStore,
} from './useProjectStore';
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
    expect(loaded.backupPreserved).toBe(true);
    expect(storage.getItem(UNREADABLE_BACKUP_KEY)).toBe(originalBytes);
  });

  it('keeps autosave locked when the unreadable-data backup cannot be created', () => {
    class BackupFailingStorage extends MemoryStorage {
      override setItem(key: string, value: string) {
        if (key === UNREADABLE_BACKUP_KEY) throw new Error('quota exceeded');
        super.setItem(key, value);
      }
    }

    const storage = new BackupFailingStorage();
    const originalBytes = '{"title":"Only copy","seasons":[';
    storage.setItem(STORAGE_KEY, originalBytes);
    const originalLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', { configurable: true, value: storage });
    vi.useFakeTimers();

    try {
      const { result, unmount } = renderHook(() => useProjectStore(), {
        wrapper: LocaleProvider,
      });

      expect(result.current.persistenceBlocked).toBe(true);
      act(() => {
        result.current.updateData({ title: 'Do not overwrite the only copy' });
      });
      act(() => {
        vi.advanceTimersByTime(501);
      });
      expect(storage.getItem(STORAGE_KEY)).toBe(originalBytes);

      act(() => result.current.resetData());
      expect(result.current.persistenceBlocked).toBe(false);
      expect(loadStoredProject(storage).unreadable).toBe(false);
      expect(loadStoredProject(storage).data.title).toBe(result.current.data.title);
      unmount();
    } finally {
      vi.useRealTimers();
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
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
