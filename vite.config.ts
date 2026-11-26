import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'))
const buildCommit = process.env.BUILD_COMMIT || process.env.GITHUB_SHA
if (buildCommit && !/^[a-f0-9]{40}$/.test(buildCommit)) {
  throw new Error('BUILD_COMMIT must be a 40-character Git SHA')
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // Stamps the built version so the production smoke test can prove which
      // release is actually deployed.
      name: 'app-version-meta',
      transformIndexHtml: (html) =>
        html.replace(
          '</head>',
          `  <meta name="app-version" content="${version}" />\n${buildCommit ? `  <meta name="build-commit" content="${buildCommit}" />\n` : ''}  </head>`,
        ),
    },
  ],
})
