import { readFileSync } from 'node:fs';

const baseUrl = new URL(process.argv[2] || 'https://seriescreator.haak3.de/');
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const routes = ['/', '/hilfe', '/datenschutz', '/impressum'];
const rootSecurityHeaders = {
  'content-security-policy': [
    "default-src 'self'",
    "base-uri 'none'",
    "connect-src 'self' blob: https://cloudflareinsights.com",
    "font-src 'self'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' blob: data:",
    "manifest-src 'self'",
    "object-src 'none'",
    "script-src 'self' https://static.cloudflareinsights.com",
    "script-src-attr 'none'",
    "style-src 'self'",
    "worker-src 'self'",
    'upgrade-insecure-requests',
  ],
  'cross-origin-opener-policy': ['same-origin'],
  'cross-origin-resource-policy': ['same-origin'],
  'permissions-policy': ['camera=()', 'microphone=()', 'geolocation=()'],
  'referrer-policy': ['strict-origin-when-cross-origin'],
  'strict-transport-security': ['max-age=31536000'],
  'x-content-type-options': ['nosniff'],
  'x-frame-options': ['DENY'],
};

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

    if (!html.includes(`<meta name="app-version" content="${version}"`)) {
      throw new Error(`Deployed document does not report version ${version}.`);
    }

    for (const [header, expectedValues] of Object.entries(rootSecurityHeaders)) {
      const value = response.headers.get(header);
      if (!value) {
        throw new Error(`Root response is missing ${header}.`);
      }
      for (const expectedValue of expectedValues) {
        if (!value.includes(expectedValue)) {
          throw new Error(`Root response has an unexpected ${header} value.`);
        }
      }
    }
  }

  console.log(`ok ${response.status} ${new URL(route, baseUrl)}`);
}
