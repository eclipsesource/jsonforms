#!/usr/bin/env node

import { copySync } from 'fs-extra/esm';
import { copyFileSync, mkdirSync, rmdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = join(__dirname, 'dist');
const packagesDir = join(__dirname, '..');
const examples = {
  'react-vanilla': join(packagesDir, 'vanilla-renderers', 'example', 'dist'),
  'react-material': join(packagesDir, 'material-renderers', 'example', 'dist'),
  'angular-material': join(packagesDir, 'angular-material', 'example', 'dist'),
  'vue-vanilla': join(packagesDir, 'vue', 'vue-vanilla', 'example', 'dist'),
};

// Clean and recreate dist dir
console.log('Clean and recreate dist dir...');
rmdirSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

// Copy index and built examples
console.log('Copy index.html...');
console.log('Copy example apps...');
copyFileSync(join(__dirname, 'index.html'), join(distDir, 'index.html'));
Object.keys(examples).forEach((key) => {
  console.log(`Copying example ${key}...`);
  const path = examples[key];
  copySync(path, join(distDir, key));
});

console.log('...finished');
