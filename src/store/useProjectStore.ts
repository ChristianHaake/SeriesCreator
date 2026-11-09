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
  storage: Storage | null,
  fallback: ProjectData = initialProjectData,
): StoredProjectLoad {
  if (!storage) return { data: fallback, unreadable: false, backupPreserved: false };
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

function getLocalStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function useProjectStore(onSaveError?: () => void) {
  const { t, locale } = useTranslation();
  // Read once, on mount. Kept in state rather than a ref so it can be used
  // during render without reaching into ref.current.
  const [initial] = useState(() => {
    const storage = getLocalStorage();
    let storedBytes: string | null = null;
    let storageReadFailed = false;
    try {
      storedBytes = storage?.getItem(STORAGE_KEY) ?? null;
    } catch {
      storageReadFailed = true;
    }
    return {
      load: loadStoredProject(storage, createInitialProjectData(locale)),
      storageUnavailable: !storage || storageReadFailed,
      storedBytes,
    };
  });
  const initialLoad = initial.load;
  const [data, setData] = useState<ProjectData>(initialLoad.data);
  const [projectRevision, setProjectRevision] = useState(0);
  const [storageConflict, setStorageConflict] = useState(false);
  const storageConflictRef = useRef(false);
  const dataRef = useRef(initialLoad.data);
  const dirtyRef = useRef(initialLoad.unreadable && initialLoad.backupPreserved);
  const lastSavedBytesRef = useRef<string | null>(initial.storedBytes);
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
    if (initial.storageUnavailable) onSaveErrorRef.current?.();
  }, [initial.storageUnavailable]);

  const updateProjectData = useCallback((update: (current: ProjectData) => ProjectData) => {
    const next = update(dataRef.current);
    dataRef.current = next;
    dirtyRef.current = true;
    setData(next);
  }, []);

  const persistLatest = useCallback(() => {
    if (writeBlockedRef.current || storageConflictRef.current || !dirtyRef.current) return;
    const snapshot = dataRef.current;
    const storage = getLocalStorage();
    if (!storage) {
      onSaveErrorRef.current?.();
      return;
    }
    let currentBytes: string | null;
    try {
      currentBytes = storage.getItem(STORAGE_KEY);
    } catch {
      onSaveErrorRef.current?.();
      return;
    }
    // shortcut: this check is not atomic; use transactional storage if concurrent editing is required.
    if (currentBytes !== lastSavedBytesRef.current) {
      storageConflictRef.current = true;
      setStorageConflict(true);
      return;
    }
    if (!saveStoredProject(storage, snapshot)) {
      onSaveErrorRef.current?.();
      return;
    }
    lastSavedBytesRef.current = serializeProject(snapshot);
    if (dataRef.current === snapshot) dirtyRef.current = false;
  }, []);

  useEffect(() => {
    if (writeBlockedRef.current) return;
    const timeoutId = setTimeout(persistLatest, 500);
    return () => clearTimeout(timeoutId);
  }, [data, persistLatest]);

  useEffect(() => {
    const flush = () => persistLatest();
    const flushWhenHidden = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flushWhenHidden);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flushWhenHidden);
    };
  }, [persistLatest]);

  useEffect(() => {
    const checkOtherTab = (event: StorageEvent) => {
      if (event.storageArea !== getLocalStorage() || event.key !== STORAGE_KEY) return;
      if (event.newValue !== lastSavedBytesRef.current) {
        storageConflictRef.current = true;
        setStorageConflict(true);
      }
    };
    window.addEventListener('storage', checkOtherTab);
    return () => window.removeEventListener('storage', checkOtherTab);
  }, []);

  const updateData = useCallback((updates: Partial<ProjectData>) => {
    updateProjectData(prev => ({ ...prev, ...updates }));
  }, [updateProjectData]);

  const addEpisode = useCallback((seasonId: string) => {
    updateProjectData(prev => {
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
  }, [t.newEpisode, updateProjectData]);

  const updateEpisode = useCallback((
    seasonId: string,
    episodeId: string,
    updates: Partial<Episode> | ((episode: Episode) => Partial<Episode>),
  ) => {
    let changed = false;
    updateProjectData(prev => ({
      ...prev,
      seasons: prev.seasons.map(s => {
        if (s.id === seasonId) {
          return {
            ...s,
            episodes: s.episodes.map(ep => {
              if (ep.id !== episodeId) return ep;
              const patch = typeof updates === 'function' ? updates(ep) : updates;
              if (Object.keys(patch).length === 0) return ep;
              changed = true;
              return { ...ep, ...patch };
            })
          };
        }
        return s;
      })
    }));
    return changed;
  }, [updateProjectData]);

  const removeEpisode = useCallback((seasonId: string, episodeId: string) => {
    updateProjectData(prev => ({
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
  }, [updateProjectData]);

  const moveEpisode = useCallback((seasonId: string, episodeId: string, direction: 'up' | 'down') => {
    updateProjectData(prev => ({
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
  }, [updateProjectData]);

  const updateSeason = useCallback((seasonId: string, title: string) => {
    updateProjectData(prev => ({
      ...prev,
      seasons: prev.seasons.map(s =>
        s.id === seasonId ? { ...s, title: title.slice(0, fieldLimits.seasonTitle) } : s,
      )
    }));
  }, [updateProjectData]);

  const removeSeason = useCallback((seasonId: string) => {
    updateProjectData(prev => {
      const newSeasons = prev.seasons.filter(s => s.id !== seasonId);
      // Ensure at least one season remains
      if (newSeasons.length === 0) {
        newSeasons.push({ id: `s_${Date.now()}`, title: `${t.lblSeasonN}1`, episodes: [] });
      }
      return { ...prev, seasons: newSeasons };
    });
  }, [t.lblSeasonN, updateProjectData]);

  const resetData = useCallback(() => {
    const nextData = createInitialProjectData(locale);
    // Reset is confirmed in the UI. Persist it before updating React state so
    // an immediate reload cannot resurrect the project the user just deleted.
    const storage = getLocalStorage();
    const projectSaved = !!storage && saveStoredProject(storage, nextData);
    let saved = projectSaved;
    if (storage) {
      try {
        storage.removeItem(UNREADABLE_BACKUP_KEY);
      } catch {
        saved = false;
      }
    }
    writeBlockedRef.current = false;
    setPersistenceBlocked(false);
    setRestoreFailed(false);
    dataRef.current = nextData;
    setProjectRevision(revision => revision + 1);
    storageConflictRef.current = false;
    setStorageConflict(false);
    dirtyRef.current = !saved;
    if (projectSaved) lastSavedBytesRef.current = serializeProject(nextData);
    setData(nextData);
    if (!saved) onSaveErrorRef.current?.();
  }, [locale]);

  const replaceData = useCallback((nextData: ProjectData, allowDiscardUnreadable = false): boolean => {
    // A normal import must not overwrite unreadable bytes when its recovery
    // copy failed. The caller may release this lock only after an explicit
    // destructive confirmation (examples already have one; imports will too).
    let saved = false;
    if (!writeBlockedRef.current || allowDiscardUnreadable) {
      const storage = getLocalStorage();
      saved = !!storage && saveStoredProject(storage, nextData);
      if (!saved) onSaveErrorRef.current?.();
      if (saved) {
        writeBlockedRef.current = false;
        setPersistenceBlocked(false);
        setRestoreFailed(false);
      }
    }
    dataRef.current = nextData;
    setProjectRevision(revision => revision + 1);
    storageConflictRef.current = false;
    setStorageConflict(false);
    dirtyRef.current = saved ? false : !writeBlockedRef.current;
    if (saved) lastSavedBytesRef.current = serializeProject(nextData);
    setData(nextData);
    return saved;
  }, []);

  return useMemo(() => ({
    data,
    projectRevision,
    storageConflict,
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
    projectRevision,
    storageConflict,
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
