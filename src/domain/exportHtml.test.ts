import { describe, expect, it } from 'vitest';
import { getExampleProjects } from './exampleProjects';
import { exportProjectToHtml } from './exportHtml';

const translations = {
  exportPresentation: 'Presentation',
  lblClose: 'Close',
  ariaPrevSlide: 'Previous slide',
  ariaNextSlide: 'Next slide',
  noImage: 'No image',
  lblEpisodeN: 'Episode ',
  lblReflection: 'Reflection',
  noReflection: 'No reflection',
  lblCustomSection: 'Custom section',
  lblSources: 'Sources',
  noSources: 'No sources',
  presentationBy: 'By',
  presentationClassFallback: 'Class',
  lblGenre: 'Genre',
};

describe('exportProjectToHtml', () => {
  it('exports a responsive presentation without forced credits motion', () => {
    const project = getExampleProjects('en')[0].project;
    const html = exportProjectToHtml(project, translations, 'en');

    expect(html).toContain('@media (max-width: 640px)');
    expect(html).toContain('@media (max-height: 600px) and (min-width: 641px)');
    expect(html).toContain('@media (prefers-reduced-motion: reduce)');
    expect(html).toContain('grid-template-columns: minmax(0, 1fr)');
    expect(html).toContain('class="credits"');
    expect(html).toContain('<svg aria-hidden="true"');
    expect(html).not.toContain('scrollUp');
    expect(html).not.toContain('transition: all');
    expect(html).not.toContain('>✕<');
  });
});
