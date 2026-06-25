import { useState, useEffect } from 'react';
import type { ProjectData, Episode } from '../types';

const STORAGE_KEY = 'series_creator_data';

const INITIAL_DATA: ProjectData = {
  title: "Meine Neue Serie",
  subject: "",
  topic: "",
  author: "",
  description: "Eine fesselnde Reise durch das Thema...",
  matchPercentage: 99,
  ageRating: "ab 12",
  genre: "Dokumentation",
  cast: "Die Klasse",
  seasons: [
    {
      id: "s1",
      title: "Staffel 1",
      episodes: []
    }
  ],
};

export function useProjectStore() {
  const [data, setData] = useState<ProjectData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved project data", e);
      }
    }
    return INITIAL_DATA;
  });

  // Autosave
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
    setData(INITIAL_DATA);
  };

  return { data, updateData, addEpisode, updateEpisode, removeEpisode, moveEpisode, resetData, updateSeason, removeSeason };
}
