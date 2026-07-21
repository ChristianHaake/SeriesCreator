import type { ProjectData } from '../types';
import type { ExampleProjectId } from './exampleProjects';

const imageNames = ['cover', 'episode-1', 'episode-2', 'episode-3', 'episode-4', 'episode-5', 'episode-6'] as const;

function imagePath(exampleId: ExampleProjectId, name: (typeof imageNames)[number]) {
  return `/example-assets/${exampleId}-${name}.jpg`;
}

async function toDataUrl(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Example image could not be loaded: ${path}`);
  }

  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return `data:image/jpeg;base64,${btoa(binary)}`;
}

export async function attachExampleImages(project: ProjectData, exampleId: ExampleProjectId) {
  const projectWithImages = structuredClone(project);
  projectWithImages.coverUrl = await toDataUrl(imagePath(exampleId, 'cover'));

  const episodes = projectWithImages.seasons.flatMap((season) => season.episodes);
  for (const [index, episode] of episodes.entries()) {
    episode.thumbnailUrl = await toDataUrl(imagePath(exampleId, imageNames[index + 1]));
  }

  return projectWithImages;
}
