import type { ProjectData } from '../types';

function escapeHtml(unsafe: string | undefined): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createCspNonce() {
  return Array.from(
    crypto.getRandomValues(new Uint8Array(16)),
    (byte) => byte.toString(16).padStart(2, '0'),
  ).join('');
}

export function exportProjectToHtml(
  data: ProjectData,
  t: Record<string, string>,
  locale: string
): string {
  // Replace </ to prevent XSS via </script> injection
  const jsonData = JSON.stringify(data).replace(/<\//g, '<\\/');
  const cspNonce = createCspNonce();
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; img-src data:; object-src 'none'; script-src 'nonce-${cspNonce}'; style-src 'nonce-${cspNonce}'">
<title>${escapeHtml(data.title)} - ${t.exportPresentation}</title>
<style nonce="${cspNonce}">
  * { box-sizing: border-box; }
  body { margin: 0; background: #111; color: white; font-family: system-ui, sans-serif; overflow: hidden; display: flex; flex-direction: column; height: 100dvh; -webkit-font-smoothing: antialiased; }
  #close { position: absolute; top: clamp(1rem, 3vw, 2rem); right: clamp(1rem, 3vw, 2rem); background: rgba(0,0,0,0.5); border: none; color: white; padding: 0; border-radius: 50%; cursor: pointer; z-index: 110; font-size: 1.5rem; text-decoration: none; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; }
  #content { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 4rem 4rem 6rem; position: relative; }
  .center-container, .credits { text-align: center; max-height: 100%; max-width: 800px; overflow-y: auto; padding: 1rem; width: 100%; margin: auto; }
  .cover { max-width: min(400px, 100%); max-height: min(400px, 45dvh); object-fit: cover; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5); outline: 1px solid oklch(1 0 0 / 0.1); outline-offset: -1px; }
  h1, h2 { text-wrap: balance; }
  h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
  p { font-size: clamp(1rem, 2.5vw, 1.5rem); color: #ccc; line-height: 1.6; text-wrap: pretty; }
  
  .episode-container { align-items: center; display: grid; gap: clamp(2rem, 5vw, 4rem); grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); max-height: 100%; max-width: 1000px; width: 100%; margin: auto; }
  .episode-image, .episode-no-image { width: 100%; aspect-ratio: 16/9; border-radius: 8px; }
  .episode-image { object-fit: cover; box-shadow: 0 10px 25px rgba(0,0,0,0.5); outline: 1px solid oklch(1 0 0 / 0.1); outline-offset: -1px; }
  .episode-no-image { background: #333; display: flex; align-items: center; justify-content: center; color: #8a8a8a; font-size: 1.25rem; }
  .episode-text { min-width: 0; max-height: 100%; overflow-y: auto; }
  .episode-title { font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: clamp(1rem, 3vw, 2rem); line-height: 1.1; }
  .episode-learning-depth { border-top: 1px solid rgba(255,255,255,0.2); margin-top: 1.25rem; padding-top: 1rem; }
  .episode-learning-depth h2 { color: #fb923c; font-size: clamp(1.1rem, 2.5vw, 1.4rem); margin: 0 0 0.5rem; }
  .custom-concept { margin-top: 3rem; }
  h2 { font-size: clamp(1.25rem, 3vw, 2rem); color: #aaa; margin-bottom: 0.5rem; }
  .section-title { color: #fb923c; font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 2rem; }
  .preformatted { text-wrap: wrap; white-space: pre-wrap; text-align: left; }
  .episode-kicker { font-variant-numeric: tabular-nums; }
  .credit-value { font-size: clamp(1.5rem, 4vw, 2.5rem); margin-bottom: 3rem; font-weight: 700; }
  .credit-brand { margin-top: 4rem; color: #fb923c; font-weight: 700; font-size: clamp(1.25rem, 3vw, 2rem); }
  
  .nav-buttons { position: absolute; bottom: 1.5rem; left: 0; right: 0; display: flex; justify-content: center; gap: 2rem; z-index: 110; pointer-events: none; }
  .nav-btn { align-items: center; background: rgba(0,0,0,0.55); border: none; border-radius: 50%; color: white; cursor: pointer; display: inline-flex; font-size: 2.25rem; height: 48px; justify-content: center; opacity: 0.7; padding: 0; pointer-events: auto; transition: background-color 0.15s ease-out, opacity 0.15s ease-out; width: 48px; }
  .nav-btn:hover { opacity: 1; }
  .nav-btn:disabled { cursor: default; opacity: 0.28; }
  #close svg, .nav-btn svg { fill: none; height: 24px; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.5; width: 24px; }
  #close:focus-visible, .nav-btn:focus-visible { outline: 3px solid white; outline-offset: 3px; }

  @media (max-width: 640px) {
    #content { align-items: stretch; padding: 4.75rem 1rem 5rem; }
    .center-container, .credits { padding: 0; }
    .cover { max-height: 30dvh; }
    .episode-container { align-content: start; gap: 1rem; grid-template-columns: minmax(0, 1fr); overflow-y: auto; }
    .episode-image, .episode-no-image { max-height: 30dvh; }
    .episode-text { overflow: visible; }
    .credit-value { margin-bottom: 2rem; }
    .credit-brand { margin-top: 2.5rem; }
    .nav-buttons { bottom: 1rem; gap: 1.5rem; }
  }

  @media (max-height: 600px) and (min-width: 641px) {
    #content { padding: 3.75rem 2rem 4.5rem; }
    .center-container, .credits { padding: 0.5rem; }
    .cover { margin-bottom: 1rem; max-height: 34dvh; }
    .episode-container { gap: 2rem; }
    .episode-image, .episode-no-image { max-height: calc(100dvh - 8.25rem); }
    .credit-value { margin-bottom: 1.25rem; }
    .credit-brand { margin-top: 1.5rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; scroll-behavior: auto !important; transition: none !important; }
  }
</style>
</head>
<body>
  <button id="close" aria-label="${t.lblClose}" title="${t.lblClose}">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
  </button>
  <div id="content"></div>
  <div class="nav-buttons">
    <button id="prevBtn" class="nav-btn" aria-label="${t.ariaPrevSlide}">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
    </button>
    <button id="nextBtn" class="nav-btn" aria-label="${t.ariaNextSlide}">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
    </button>
  </div>
<script nonce="${cspNonce}">
  const data = ${jsonData};
  const allEpisodes = data.seasons.flatMap(s => s.episodes);
  let currentIndex = -1;
  const maxIndex = allEpisodes.length + 2;

  const contentDiv = document.getElementById('content');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  document.getElementById('close').addEventListener('click', () => window.close());

  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function render() {
    prevBtn.disabled = currentIndex === -1;
    nextBtn.disabled = currentIndex === maxIndex;
    let html = '';

    if (currentIndex === -1) {
      html = '<div class="center-container">';
      if (data.coverUrl) html += '<img class="cover" src="' + escapeHtml(data.coverUrl) + '" alt="${t.lblCoverArt}">';
      html += '<h1>' + escapeHtml(data.title) + '</h1>';
      html += '<p>' + escapeHtml(data.description) + '</p></div>';
    } else if (currentIndex < allEpisodes.length) {
      const ep = allEpisodes[currentIndex];
      html = '<div class="episode-container">';
      if (ep.thumbnailUrl) {
        html += '<img class="episode-image" src="' + escapeHtml(ep.thumbnailUrl) + '" alt="' + escapeHtml(ep.altText || ep.title) + '">';
      } else {
        html += '<div class="episode-no-image">${t.noImage}</div>';
      }
      html += '<div class="episode-text"><h2 class="episode-kicker">${t.lblEpisodeN}' + (currentIndex + 1) + '</h2>';
      html += '<h1 class="episode-title">' + escapeHtml(ep.title) + '</h1>';
      html += '<p>' + escapeHtml(ep.summary) + '</p>';
      if (ep.learningDepth) html += '<section class="episode-learning-depth"><h2>${t.episodeLearningDepthLabel}</h2><p class="preformatted">' + escapeHtml(ep.learningDepth) + '</p></section>';
      html += '</div></div>';
    } else if (currentIndex === allEpisodes.length) {
      html = '<div class="center-container"><h1 class="section-title">${t.lblReflection}</h1>';
      html += '<p class="preformatted">' + escapeHtml(data.reflection || "${t.noReflection}") + '</p>';
      if (data.customConceptTitle || data.customConceptText) {
        html += '<div class="custom-concept"><h1 class="section-title">' + escapeHtml(data.customConceptTitle || "${t.lblCustomSection}") + '</h1>';
        html += '<p class="preformatted">' + escapeHtml(data.customConceptText || "") + '</p></div>';
      }
      html += '</div>';
    } else if (currentIndex === allEpisodes.length + 1) {
      html = '<div class="center-container"><h1 class="section-title">${t.lblSources}</h1>';
      html += '<p class="preformatted">' + escapeHtml(data.sources || "${t.noSources}") + '</p></div>';
    } else {
      html = '<div class="credits"><h1>' + escapeHtml(data.title) + '</h1>';
      html += '<h2>${t.presentationBy}</h2><p class="credit-value">' + escapeHtml(data.author || data.cast || "${t.presentationClassFallback}") + '</p>';
      html += '<h2>${t.lblGenre}</h2><p class="credit-value">' + escapeHtml(data.genre) + '</p>';
      html += '<div class="credit-brand">' + escapeHtml(data.previewBrand || "SeriesCreator") + '</div></div>';
    }
    contentDiv.innerHTML = html;
  }

  prevBtn.onclick = () => { currentIndex = Math.max(currentIndex - 1, -1); render(); };
  nextBtn.onclick = () => { currentIndex = Math.min(currentIndex + 1, maxIndex); render(); };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { currentIndex = Math.min(currentIndex + 1, maxIndex); render(); }
    if (e.key === 'ArrowLeft') { currentIndex = Math.max(currentIndex - 1, -1); render(); }
  });

  render();
</script>
</body>
</html>`;
}
