#!/usr/bin/env node
/*
  Serves a built example app with a Content Security Policy that forbids
  `unsafe-eval`, to prove a form validated through @jsonforms/standard-schema
  (or compiledAjvValidator) works where Ajv's runtime compilation cannot.

  Usage:
    node scripts/serve-csp.cjs <directory> [port]
  Example:
    pnpm lerna run build:examples-app --scope=@jsonforms/vue-vanilla
    node packages/standard-schema/scripts/serve-csp.cjs packages/vue-vanilla/example/dist 9091
*/
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] || '.');
const port = Number(process.argv[3] || 9091);

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data:",
  "connect-src 'self'",
].join('; ');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.join(root, url);
    if (!file.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file)) {
      file = path.join(root, 'index.html');
    }
    res.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Content-Security-Policy': CSP,
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => {
    console.log(`Serving ${root}`);
    console.log(`  http://localhost:${port}/`);
    console.log(`  Content-Security-Policy: ${CSP}`);
    console.log(
      'Open the "Standard Schema (Valibot)" or "Custom validator" example: it validates.'
    );
    console.log(
      'Open any other example: Ajv compilation is blocked by the CSP (see the console).'
    );
  });
