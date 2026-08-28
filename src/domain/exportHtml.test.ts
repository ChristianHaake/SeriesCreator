import { describe, expect, it } from 'vitest';
import { getExampleProjects } from './exampleProjects';
import { exportProjectToHtml } from './exportHtml';

const translations = {
  exportPresentation: 'Presentation',
  lblClose: 'Close',
  lblCoverArt: 'Cover art',
  ariaPrevSlide: 'Previous slide',
  ariaNextSlide: 'Next slide',
  noImage: 'No image',
  lblEpisodeN: 'Episode ',
  episodeLearningDepthLabel: 'Academic deepening',
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
    expect(html).toContain('ep.altText || ep.title');
    expect(html).toContain('episode-learning-depth');
    expect(html).toContain('Academic deepening');
    expect(html).toContain("default-src 'none'; base-uri 'none'; connect-src 'none'");
    expect(html).toContain("script-src 'nonce-");
    expect(html).toContain("style-src 'nonce-");
    expect(html).toMatch(/<style nonce="[a-f0-9]{32}">/);
    expect(html).toMatch(/<script nonce="[a-f0-9]{32}">/);
    const cspNonce = html.match(/script-src 'nonce-([a-f0-9]{32})'/)?.[1];
    const styleNonce = html.match(/<style nonce="([a-f0-9]{32})">/)?.[1];
    const scriptNonce = html.match(/<script nonce="([a-f0-9]{32})">/)?.[1];
    expect(styleNonce).toBe(cspNonce);
    expect(scriptNonce).toBe(cspNonce);
    expect(html).toContain("document.getElementById('close').addEventListener('click', () => window.close());");
    expect(html).not.toContain('onclick=');
    expect(html).not.toContain('<div style=');
    expect(html).not.toContain('scrollUp');
    expect(html).not.toContain('transition: all');
    expect(html).not.toContain('>✕<');
  });
});
