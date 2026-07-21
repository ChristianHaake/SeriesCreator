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
  `import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getExampleProjects } from '../../../src/domain/exampleProjects';
import { makeProjectFilename, parseProjectJson, serializeProject } from '../../../src/domain/projectCodec';

const outputDir = resolve(process.cwd(), 'examples');
await mkdir(outputDir, { recursive: true });
const writtenFiles: string[] = [];

for (const locale of ['de', 'en'] as const) {
  for (const example of getExampleProjects(locale)) {
    const filename = \`\${locale}-\${makeProjectFilename(example.project.title)}\`;
    const serialized = \`\${serializeProject(example.project)}\\n\`;
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
