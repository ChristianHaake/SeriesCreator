import { beforeEach, describe, expect, it, vi } from 'vitest';
import { attachExampleImages } from './exampleImageAssets';
import type { ProjectData } from '../types';
import { initialProjectData } from '../types';

function projectWithEpisodes(count: number): ProjectData {
  return {
    ...initialProjectData,
    seasons: [{
      id: 's1',
      title: 'Season 1',
      episodes: Array.from({ length: count }, (_, index) => ({
        id: `ep${index}`,
        title: `Episode ${index + 1}`,
        summary: '',
      })),
    }],
  };
}

describe('attachExampleImages', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(new Uint8Array([255, 216, 255, 217]), {
      headers: { 'Content-Type': 'image/jpeg' },
      status: 200,
    })));
  });

  it('attaches a thumbnail to every episode the example ships images for', async () => {
    const result = await attachExampleImages(projectWithEpisodes(6), 'school-climate-code');
    const episodes = result.seasons.flatMap((season) => season.episodes);

    expect(result.coverUrl).toMatch(/^data:image\/jpeg;base64,/);
    expect(episodes.every((episode) => episode.thumbnailUrl)).toBe(true);
  });

  it('leaves surplus episodes without a thumbnail instead of failing the load', async () => {
    // Seven episodes exceed the six bundled thumbnails; the lookup used to run
    // off the end and request an "-undefined.jpg" that 404s.
    const result = await attachExampleImages(projectWithEpisodes(9), 'school-climate-code');
    const episodes = result.seasons.flatMap((season) => season.episodes);

    expect(episodes.slice(0, 6).every((episode) => episode.thumbnailUrl)).toBe(true);
    expect(episodes.slice(6).every((episode) => episode.thumbnailUrl === undefined)).toBe(true);
  });
});
