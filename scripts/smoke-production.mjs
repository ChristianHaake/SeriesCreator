const baseUrl = new URL(process.argv[2] || 'https://seriescreator.haak3.de/');
const routes = ['/', '/hilfe', '/datenschutz', '/impressum'];

for (const route of routes) {
  const response = await fetch(new URL(route, baseUrl), { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`${route} returned HTTP ${response.status}`);
  }

  if (route === '/') {
    const html = await response.text();
    if (!html.includes('<title>SeriesCreator</title>')) {
      throw new Error('Root document does not identify SeriesCreator.');
    }

    for (const header of [
      'content-security-policy',
      'referrer-policy',
      'x-content-type-options',
    ]) {
      if (!response.headers.get(header)) {
        throw new Error(`Root response is missing ${header}.`);
      }
    }
  }

  console.log(`ok ${response.status} ${new URL(route, baseUrl)}`);
}
