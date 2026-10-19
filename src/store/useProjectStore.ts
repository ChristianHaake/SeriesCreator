import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ProjectData, Episode } from '../types';
import { initialProjectData, createInitialProjectData } from '../types';
import { normalizeProject, serializeProject } from '../domain/projectCodec';
import { fieldLimits, resourceLimits } from '../domain/constraints';
import { useTranslation } from '../i18n';

export const STORAGE_KEY = 'series_creator_data';
/** Single fixed key: one kept copy, overwritten, never an accumulating pile. */
export const UNREADABLE_BACKUP_KEY = `${STORAGE_KEY}.unreadable`;

export interface StoredProjectLoad {
  data: ProjectData;
  /**
   * True when a saved project existed but could not be restored. The raw bytes
   * are copied to UNREADABLE_BACKUP_KEY when storage permits it. If copying
   * fails, autosave is locked so the primary bytes remain untouched.
   */
  unreadable: boolean;
  /** Whether the unreadable bytes were copied before the active draft fell back. */
  backupPreserved: boolean;
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
    return { data: fallback, unreadable: false, backupPreserved: false };
  }

  if (!saved) return { data: fallback, unreadable: false, backupPreserved: false };

  try {
    const parsed = normalizeProject(JSON.parse(saved));
    if (parsed.ok) return { data: parsed.data, unreadable: false, backupPreserved: false };
  } catch {
    // Unparseable JSON falls through to the same preservation path as data
    // that parses but fails validation.
  }

  let backupPreserved = false;
  try {
    storage.setItem(UNREADABLE_BACKUP_KEY, saved);
    backupPreserved = true;
  } catch {
    // Keep the original key untouched. Autosave remains locked until the user
    // explicitly confirms a destructive replacement.
  }

  return { data: fallback, unreadable: true, backupPreserved };
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
  const [restoreFailed, setRestoreFailed] = useState(initialLoad.unreadable);
  // A failed recovery copy means the original bytes are still the only copy.
  // Do not let a later edit silently overwrite them.
  const [persistenceBlocked, setPersistenceBlocked] = useState(
    initialLoad.unreadable && !initialLoad.backupPreserved,
  );
  const writeBlockedRef = useRef(initialLoad.unreadable && !initialLoad.backupPreserved);
  const onSaveErrorRef = useRef(onSaveError);
  useEffect(() => {
    onSaveErrorRef.current = onSaveError;
  }, [onSaveError]);

  useEffect(() => {
    if (writeBlockedRef.current) return;
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
    const nextData = createInitialProjectData(locale);
    // Reset is confirmed in the UI. Persist it before updating React state so
    // an immediate reload cannot resurrect the project the user just deleted.
    const saved = saveStoredProject(window.localStorage, nextData);
    writeBlockedRef.current = false;
    setPersistenceBlocked(false);
    setRestoreFailed(false);
    setData(nextData);
    if (!saved) onSaveErrorRef.current?.();
  }, [locale]);

  const replaceData = useCallback((nextData: ProjectData, allowDiscardUnreadable = false) => {
    // A normal import must not overwrite unreadable bytes when its recovery
    // copy failed. The caller may release this lock only after an explicit
    // destructive confirmation (examples already have one; imports will too).
    if (!writeBlockedRef.current || allowDiscardUnreadable) {
      const saved = saveStoredProject(window.localStorage, nextData);
      if (!saved) onSaveErrorRef.current?.();
      if (saved) {
        writeBlockedRef.current = false;
        setPersistenceBlocked(false);
        setRestoreFailed(false);
      }
    }
    setData(nextData);
  }, []);

  return useMemo(() => ({
    data,
    restoreFailed,
    persistenceBlocked,
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
    persistenceBlocked,
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
