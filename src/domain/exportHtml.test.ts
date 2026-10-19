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

  it('starts with a season-preserving overview and opens episode details from it', () => {
    const project = getExampleProjects('en')[0].project;
    const html = exportProjectToHtml(project, translations, 'en');

    expect(project.seasons).toHaveLength(2);
    expect(html).toContain('class="series-overview"');
    expect(html).toContain('class="series-overview__season"');
    expect(html).toContain("data-episode-index=\"' + (episodeOffset + episodeIndex)");
    expect(html).toContain('currentIndex = -2');
    expect(html).toContain("currentIndex = -2;\n      render();");
    expect(html.indexOf(project.seasons[0].title)).toBeLessThan(html.indexOf(project.seasons[1].title));
  });

  it('returns from an episode to its season and restores focus to that card', () => {
    const project = getExampleProjects('en')[0].project;
    const html = exportProjectToHtml(project, translations, 'en');

    expect(html).toContain('let selectedSeasonIndex = null');
    expect(html).toContain('function getSeasonIndexForEpisode(episodeIndex)');
    expect(html).toContain("data-season-index=\"' + seasonIndex + '\"");
    expect(html).toContain("selectedSeasonIndex = getSeasonIndexForEpisode(currentIndex)");
    expect(html).toContain("document.getElementById('episode-card-' + focusEpisodeIndex)?.focus()");
    expect(html).toContain('id="backToAllSeasons"');

    const script = html.match(/<script nonce="[a-f0-9]{32}">([\s\S]*?)<\/script>/)?.[1];
    expect(script).toBeDefined();
    const previousMarkup = document.body.innerHTML;
    document.body.innerHTML = '<button id="close"></button><div id="content"></div><button id="prevBtn"></button><button id="nextBtn"></button>';
    try {
      new Function('document', 'window', script!)(document, window);
      const seasonTwoEpisode = document.querySelector<HTMLButtonElement>('[data-season-index="1"][data-episode-index="3"]');
      seasonTwoEpisode?.click();
      expect(document.querySelector('.episode-title')?.textContent).toBe(project.seasons[1].episodes[0].title);

      document.querySelector<HTMLButtonElement>('#backToOverview')?.click();
      expect(document.querySelector('.series-overview__hero h1')?.textContent).toContain('Season 2');
      expect(document.activeElement?.id).toBe('episode-card-3');
    } finally {
      document.body.innerHTML = previousMarkup;
    }
  });

  it('includes episode content blocks in the offline detail view', () => {
    const project = getExampleProjects('en')[0].project;
    project.seasons[0].episodes[0].contentBlocks = [
      { id: 'text-1', type: 'text', title: 'Timeline', body: 'First observation' },
      { id: 'image-1', type: 'image', imageUrl: 'data:image/png;base64,AAAA', altText: 'Chart', caption: 'Measured values' },
    ];

    const html = exportProjectToHtml(project, translations, 'en');

    expect(html).toContain('episode-content-block');
    expect(html).toContain("(ep.contentBlocks || []).forEach");
    expect(html).toContain('Timeline');
    expect(html).toContain('Measured values');
  });
});
