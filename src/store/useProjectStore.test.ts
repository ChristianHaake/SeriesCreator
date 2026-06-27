import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { initialProjectData } from '../types';
import { loadStoredProject, saveStoredProject, useProjectStore } from './useProjectStore';

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
    expect(loadStoredProject(storage).title).toBe('Saved Project');
  });

  it('falls back to the default project for corrupt storage', () => {
    const storage = new MemoryStorage();
    storage.setItem('series_creator_data', '{');

    expect(loadStoredProject(storage).title).toBe(initialProjectData.title);
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
    const { result } = renderHook(() => useProjectStore());
    
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
      result.current.removeEpisode(initialSeasonId, newEpisodeId);
    });
    
    expect(result.current.data.seasons[0].episodes.length).toBe(initialEpisodesCount);
  });
});
