/**
 * Builds the combined examples app:
 * every renderer-set demo app is built with `--base=/<id>/` directly into
 * `dist/<id>/`, and the landing page (index.html) is copied to the dist root.
 *
 * Adding a renderer set later (Vue, Angular, …) only requires a new entry here
 * and a card on the landing page — sub-apps are framework-agnostic.
 */
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(root, '..', '..');
const dist = join(root, 'dist');

const apps = [
  { id: 'react-material', package: '@jsonforms/demo-react-material' },
  { id: 'react-vanilla', package: '@jsonforms/demo-react-vanilla' },
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const app of apps) {
  const outDir = join(dist, app.id);
  console.log(`\nBuilding ${app.package} → dist/${app.id}/`);
  execSync(
    `pnpm --filter ${app.package} exec vite build --base=/${app.id}/ --outDir ${outDir} --emptyOutDir`,
    { stdio: 'inherit', cwd: workspaceRoot },
  );
}

cpSync(join(root, 'index.html'), join(dist, 'index.html'));
console.log(
  '\nCombined demo app written to dist/. Serve it with `pnpm preview`.',
);
