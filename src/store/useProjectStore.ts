import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ProjectData, Episode } from '../types';
import { initialProjectData, createInitialProjectData } from '../types';
import { normalizeProject, serializeProject } from '../domain/projectCodec';
import { fieldLimits, resourceLimits } from '../domain/constraints';
import { useTranslation } from '../i18n';

const STORAGE_KEY = 'series_creator_data';
/** Single fixed key: one kept copy, overwritten, never an accumulating pile. */
export const UNREADABLE_BACKUP_KEY = `${STORAGE_KEY}.unreadable`;

export interface StoredProjectLoad {
  data: ProjectData;
  /**
   * True when a saved project existed but could not be restored. The raw bytes
   * are kept under UNREADABLE_BACKUP_KEY — without that, the autosave would
   * overwrite the student's only copy within half a second of giving up on it.
   */
  unreadable: boolean;
}

export function loadStoredProject(
  storage: Storage,
  fallback: ProjectData = initialProjectData,
): StoredProjectLoad {
  let saved: string | null;
  try {
    saved = storage.getItem(STORAGE_KEY);
  } catch {
    // Storage is blocked entirely, so there is nothing stored to lose.
    return { data: fallback, unreadable: false };
  }

  if (!saved) return { data: fallback, unreadable: false };

  try {
    const parsed = normalizeProject(JSON.parse(saved));
    if (parsed.ok) return { data: parsed.data, unreadable: false };
  } catch {
    // Unparseable JSON falls through to the same preservation path as data
    // that parses but fails validation.
  }

  try {
    storage.setItem(UNREADABLE_BACKUP_KEY, saved);
  } catch {
    // Out of quota: the original is still in place because the caller
    // suppresses the next autosave.
  }

  return { data: fallback, unreadable: true };
}

export function saveStoredProject(storage: Storage, data: ProjectData) {
  try {
    storage.setItem(STORAGE_KEY, serializeProject(data));
    return true;
  } catch {
    return false;
  }
}

export function useProjectStore(onSaveError?: () => void) {
  const { t, locale } = useTranslation();
  // Read once, on mount. Kept in state rather than a ref so it can be used
  // during render without reaching into ref.current.
  const [initialLoad] = useState<StoredProjectLoad>(() =>
    loadStoredProject(window.localStorage, createInitialProjectData(locale)),
  );
  const [data, setData] = useState<ProjectData>(initialLoad.data);
  const restoreFailed = initialLoad.unreadable;
  // Hold off the first autosave when the load failed, so the unreadable project
  // is not replaced before the student has been told about it.
  const skipFirstSaveRef = useRef(restoreFailed);
  const onSaveErrorRef = useRef(onSaveError);
  useEffect(() => {
    onSaveErrorRef.current = onSaveError;
  }, [onSaveError]);

  useEffect(() => {
    if (skipFirstSaveRef.current) {
      skipFirstSaveRef.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      if (!saveStoredProject(window.localStorage, data)) {
        onSaveErrorRef.current?.();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [data]);

  const updateData = useCallback((updates: Partial<ProjectData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const addEpisode = useCallback((seasonId: string) => {
    setData(prev => {
      const newId = `ep_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      return {
        ...prev,
        seasons: prev.seasons.map(s => {
          if (s.id === seasonId) {
            if (s.episodes.length >= resourceLimits.maxEpisodesPerSeason) return s;
            return {
              ...s,
              episodes: [...s.episodes, { id: newId, title: t.newEpisode, summary: "" }]
            };
          }
          return s;
        })
      };
    });
  }, [t.newEpisode]);

  const updateEpisode = useCallback((seasonId: string, episodeId: string, updates: Partial<Episode>) => {
    setData(prev => ({
      ...prev,
      seasons: prev.seasons.map(s => {
        if (s.id === seasonId) {
          return {
            ...s,
            episodes: s.episodes.map(ep => ep.id === episodeId ? { ...ep, ...updates } : ep)
          };
        }
        return s;
      })
    }));
  }, []);

  const removeEpisode = useCallback((seasonId: string, episodeId: string) => {
    setData(prev => ({
      ...prev,
      seasons: prev.seasons.map(s => {
        if (s.id === seasonId) {
          return {
            ...s,
            episodes: s.episodes.filter(ep => ep.id !== episodeId)
          };
        }
        return s;
      })
    }));
  }, []);

  const moveEpisode = useCallback((seasonId: string, episodeId: string, direction: 'up' | 'down') => {
    setData(prev => ({
      ...prev,
      seasons: prev.seasons.map(s => {
        if (s.id === seasonId) {
          const index = s.episodes.findIndex(ep => ep.id === episodeId);
          if (index < 0) return s;
          if (direction === 'up' && index === 0) return s;
          if (direction === 'down' && index === s.episodes.length - 1) return s;
          
          const newEpisodes = [...s.episodes];
          const swapIndex = direction === 'up' ? index - 1 : index + 1;
          [newEpisodes[index], newEpisodes[swapIndex]] = [newEpisodes[swapIndex], newEpisodes[index]];
          
          return { ...s, episodes: newEpisodes };
        }
        return s;
      })
    }));
  }, []);

  const updateSeason = useCallback((seasonId: string, title: string) => {
    setData(prev => ({
      ...prev,
      seasons: prev.seasons.map(s =>
        s.id === seasonId ? { ...s, title: title.slice(0, fieldLimits.seasonTitle) } : s,
      )
    }));
  }, []);

  const removeSeason = useCallback((seasonId: string) => {
    setData(prev => {
      const newSeasons = prev.seasons.filter(s => s.id !== seasonId);
      // Ensure at least one season remains
      if (newSeasons.length === 0) {
        newSeasons.push({ id: `s_${Date.now()}`, title: `${t.lblSeasonN}1`, episodes: [] });
      }
      return { ...prev, seasons: newSeasons };
    });
  }, [t.lblSeasonN]);

  const resetData = useCallback(() => {
    setData(createInitialProjectData(locale));
  }, [locale]);

  const replaceData = useCallback((nextData: ProjectData) => {
    setData(nextData);
  }, []);

  return useMemo(() => ({
    data,
    restoreFailed,
    updateData,
    replaceData,
    addEpisode,
    updateEpisode,
    removeEpisode,
    moveEpisode,
    resetData,
    updateSeason,
    removeSeason,
  }), [
    data,
    restoreFailed,
    updateData,
    replaceData,
    addEpisode,
    updateEpisode,
    removeEpisode,
    moveEpisode,
    resetData,
    updateSeason,
    removeSeason,
  ]);
}
