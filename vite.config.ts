import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'))

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
          `  <meta name="app-version" content="${version}" />\n  </head>`,
        ),
    },
  ],
})
