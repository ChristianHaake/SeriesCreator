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

export function exportProjectToHtml(data: ProjectData): string {
  const jsonData = JSON.stringify(data);
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(data.title)} - Präsentation</title>
<style>
  body { margin: 0; background: #111; color: white; font-family: system-ui, sans-serif; overflow: hidden; display: flex; flex-direction: column; height: 100vh; }
  #close { position: absolute; top: 2rem; right: 2rem; background: rgba(0,0,0,0.5); border: none; color: white; padding: 0.5rem 1rem; border-radius: 50%; cursor: pointer; z-index: 110; font-size: 1.5rem; text-decoration: none; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; }
  #content { flex: 1; display: flex; align-items: center; justify-content: center; padding: 4rem; position: relative; }
  .center-container { text-align: center; max-width: 800px; margin: auto; }
  .cover { max-width: 400px; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
  h1 { font-size: 4rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
  p { font-size: 1.5rem; color: #ccc; line-height: 1.6; }
  
  .episode-container { display: flex; gap: 4rem; align-items: center; max-width: 1000px; width: 100%; margin: auto; }
  .episode-image { flex: 1; width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
  .episode-no-image { flex: 1; width: 100%; aspect-ratio: 16/9; background: #333; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 1.5rem; }
  .episode-text { flex: 1; }
  h2 { font-size: 2rem; color: #aaa; margin-bottom: 0.5rem; }
  
  .nav-buttons { position: absolute; bottom: 2rem; left: 0; right: 0; display: flex; justify-content: center; gap: 2rem; z-index: 110; }
  .nav-btn { background: transparent; border: none; color: white; font-size: 3rem; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; }
  .nav-btn:hover { opacity: 1; }
  .nav-btn:disabled { color: #333; cursor: default; }

  @keyframes scrollUp { from { transform: translateY(100vh); } to { transform: translateY(-100%); } }
  .credits { text-align: center; max-width: 800px; animation: scrollUp 20s linear infinite; margin: auto; }
</style>
</head>
<body>
  <button id="close" aria-label="Schließen" onclick="window.close()" title="Schließen">✕</button>
  <div id="content"></div>
  <div class="nav-buttons">
    <button id="prevBtn" class="nav-btn" aria-label="Vorherige Folie">❮</button>
    <button id="nextBtn" class="nav-btn" aria-label="Nächste Folie">❯</button>
  </div>
<script>
  const data = ${jsonData};
  const allEpisodes = data.seasons.flatMap(s => s.episodes);
  let currentIndex = -1;
  const maxIndex = allEpisodes.length + 2;

  const contentDiv = document.getElementById('content');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

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
      if (data.coverUrl) html += '<img class="cover" src="' + data.coverUrl + '" alt="Cover">';
      html += '<h1>' + escapeHtml(data.title) + '</h1>';
      html += '<p>' + escapeHtml(data.description) + '</p></div>';
    } else if (currentIndex < allEpisodes.length) {
      const ep = allEpisodes[currentIndex];
      html = '<div class="episode-container">';
      if (ep.thumbnailUrl) {
        html += '<img class="episode-image" src="' + ep.thumbnailUrl + '" alt="Thumbnail">';
      } else {
        html += '<div class="episode-no-image">Kein Bild</div>';
      }
      html += '<div class="episode-text"><h2>Episode ' + (currentIndex + 1) + '</h2>';
      html += '<h1 style="font-size: 3.5rem; margin-bottom: 2rem; line-height: 1.1">' + escapeHtml(ep.title) + '</h1>';
      html += '<p>' + escapeHtml(ep.summary) + '</p></div></div>';
    } else if (currentIndex === allEpisodes.length) {
      html = '<div class="center-container"><h1 style="font-size: 3rem; margin-bottom: 2rem; color: #fb923c">Projektverlauf & Reflexion</h1>';
      html += '<p style="white-space: pre-wrap; text-align: left;">' + escapeHtml(data.reflection || "Keine Reflexion hinterlegt.") + '</p>';
      if (data.customConceptTitle || data.customConceptText) {
        html += '<div style="margin-top: 3rem;"><h1 style="font-size: 3rem; margin-bottom: 2rem; color: #fb923c">' + escapeHtml(data.customConceptTitle || "Eigene Rubrik") + '</h1>';
        html += '<p style="white-space: pre-wrap; text-align: left;">' + escapeHtml(data.customConceptText || "") + '</p></div>';
      }
      html += '</div>';
    } else if (currentIndex === allEpisodes.length + 1) {
      html = '<div class="center-container"><h1 style="font-size: 3rem; margin-bottom: 2rem; color: #fb923c">Quellenverzeichnis</h1>';
      html += '<p style="white-space: pre-wrap; text-align: left;">' + escapeHtml(data.sources || "Keine Quellen hinterlegt.") + '</p></div>';
    } else {
      html = '<div class="credits"><h1>' + escapeHtml(data.title) + '</h1>';
      html += '<h2>Eine Produktion von</h2><p style="font-size: 2.5rem; margin-bottom: 3rem; font-weight: bold;">' + escapeHtml(data.cast || "Der Klasse") + '</p>';
      html += '<h2>Genre</h2><p style="font-size: 2.5rem; margin-bottom: 3rem; font-weight: bold;">' + escapeHtml(data.genre) + '</p>';
      html += '<div style="margin-top: 5rem; color: #fb923c; font-weight: bold; font-size: 2rem;">' + escapeHtml(data.previewBrand || "SeriesCreator") + '</div></div>';
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
