import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const rootUrl = new URL('../', import.meta.url);
const tmpUrl = new URL('../node_modules/.tmp/seriescreator-example-export/', import.meta.url);
const entryUrl = new URL('entry.ts', tmpUrl);
const bundleDirUrl = new URL('bundle/', tmpUrl);
const bundleUrl = new URL('export-examples.mjs', bundleDirUrl);

await mkdir(tmpUrl, { recursive: true });
await writeFile(
  entryUrl,
  `import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getExampleProjects } from '../../../src/domain/exampleProjects';
import { makeProjectFilename, parseProjectJson, serializeProject } from '../../../src/domain/projectCodec';
import type { ProjectData } from '../../../src/types';

const outputDir = resolve(process.cwd(), 'examples');
const assetDir = resolve(process.cwd(), 'examples/assets/generated');
const publicAssetDir = resolve(process.cwd(), 'public/example-assets');
await mkdir(outputDir, { recursive: true });
await mkdir(publicAssetDir, { recursive: true });
const writtenFiles: string[] = [];
const exampleIds = ['school-climate-code', 'weimar-file'] as const;
const imageNames = ['cover', 'episode-1', 'episode-2', 'episode-3', 'episode-4', 'episode-5', 'episode-6'] as const;

for (const exampleId of exampleIds) {
  for (const imageName of imageNames) {
    const filename = \`\${exampleId}-\${imageName}.jpg\`;
    await copyFile(resolve(assetDir, filename), resolve(publicAssetDir, filename));
  }
}

async function imageDataUrl(slug: string, name: string) {
  const buffer = await readFile(resolve(assetDir, \`\${slug}-\${name}.jpg\`));
  return \`data:image/jpeg;base64,\${buffer.toString('base64')}\`;
}

async function addExampleImages(project: ProjectData, slug: string) {
  const projectWithImages = structuredClone(project);
  projectWithImages.coverUrl = await imageDataUrl(slug, 'cover');
  const episodes = projectWithImages.seasons.flatMap((season) => season.episodes);

  for (const [index, episode] of episodes.entries()) {
    episode.thumbnailUrl = await imageDataUrl(slug, \`episode-\${index + 1}\`);
  }

  return projectWithImages;
}

for (const locale of ['de', 'en'] as const) {
  for (const example of getExampleProjects(locale)) {
    const filename = \`\${locale}-\${makeProjectFilename(example.project.title)}\`;
    const project = await addExampleImages(example.project, example.id);
    const serialized = \`\${serializeProject(project)}\\n\`;
    const parsed = parseProjectJson(serialized);
    if (!parsed.ok) {
      throw new Error(\`Generated example is not importable: \${filename}: \${parsed.message}\`);
    }
    await writeFile(resolve(outputDir, filename), serialized, 'utf8');
    writtenFiles.push(filename);
    console.log(\`wrote examples/\${filename}\`);
  }
}

for (const filename of writtenFiles) {
  const parsed = parseProjectJson(await import('node:fs/promises').then(({ readFile }) => readFile(resolve(outputDir, filename), 'utf8')));
  if (!parsed.ok) {
    throw new Error(\`Written example is not importable: \${filename}: \${parsed.message}\`);
  }
  console.log(\`validated examples/\${filename}\`);
}
`,
  'utf8',
);

await build({
  root: fileURLToPath(rootUrl),
  configFile: false,
  logLevel: 'error',
  build: {
    emptyOutDir: true,
    outDir: fileURLToPath(bundleDirUrl),
    ssr: fileURLToPath(entryUrl),
    rollupOptions: {
      output: {
        entryFileNames: 'export-examples.mjs',
      },
    },
  },
});

await import(`${bundleUrl.href}?t=${Date.now()}`);
