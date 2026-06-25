import { useState, useEffect } from 'react';
import type { ProjectData, Episode } from '../types';
import { initialProjectData } from '../types';
import { normalizeProject, serializeProject } from '../domain/projectCodec';

const STORAGE_KEY = 'series_creator_data';

export function loadStoredProject(storage: Storage): ProjectData {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (!saved) return initialProjectData;

    const parsed = normalizeProject(JSON.parse(saved));
    if (parsed.ok) return parsed.data;
  } catch {
    // Blocked storage or corrupt JSON falls back to a fresh local project.
  }

  return initialProjectData;
}

export function saveStoredProject(storage: Storage, data: ProjectData) {
  try {
    storage.setItem(STORAGE_KEY, serializeProject(data));
    return true;
  } catch {
    return false;
  }
}

export function useProjectStore() {
  const [data, setData] = useState<ProjectData>(() => {
    return loadStoredProject(window.localStorage);
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveStoredProject(window.localStorage, data);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [data]);

  const updateData = (updates: Partial<ProjectData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const addEpisode = (seasonId: string) => {
    setData(prev => {
      const newId = `ep_${Date.now()}`;
      return {
        ...prev,
        seasons: prev.seasons.map(s => {
          if (s.id === seasonId) {
            return {
              ...s,
              episodes: [...s.episodes, { id: newId, title: "Neue Episode", summary: "" }]
            };
          }
          return s;
        })
      };
    });
  };

  const updateEpisode = (seasonId: string, episodeId: string, updates: Partial<Episode>) => {
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
  };

  const removeEpisode = (seasonId: string, episodeId: string) => {
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
  };

  const moveEpisode = (seasonId: string, episodeId: string, direction: 'up' | 'down') => {
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
  };

  const updateSeason = (seasonId: string, title: string) => {
    setData(prev => ({
      ...prev,
      seasons: prev.seasons.map(s => s.id === seasonId ? { ...s, title } : s)
    }));
  };

  const removeSeason = (seasonId: string) => {
    setData(prev => {
      const newSeasons = prev.seasons.filter(s => s.id !== seasonId);
      // Ensure at least one season remains
      if (newSeasons.length === 0) {
        newSeasons.push({ id: `s_${Date.now()}`, title: "Staffel 1", episodes: [] });
      }
      return { ...prev, seasons: newSeasons };
    });
  };

  const resetData = () => {
    setData(initialProjectData);
  };

  const replaceData = (nextData: ProjectData) => {
    setData(nextData);
  };

  return {
    data,
    updateData,
    replaceData,
    addEpisode,
    updateEpisode,
    removeEpisode,
    moveEpisode,
    resetData,
    updateSeason,
    removeSeason,
  };
}
