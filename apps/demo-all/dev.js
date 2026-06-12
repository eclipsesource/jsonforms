/**
 * Dev server for the combined demo app: serves the landing page at `/` and
 * mounts every renderer-set demo app as Vite dev-server middleware under
 * `/<id>/` — one process, one port, full HMR everywhere. The sub-apps resolve
 * the @jsonforms/* packages from source (see their vite.config.ts), so editing
 * any library hot-reloads the running apps without watchers or rebuilds.
 */
import { createServer as createHttpServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));
const port = 5170;

const apps = [
  { id: 'react-material', directory: '../demo-react-material', hmrPort: 5171 },
  { id: 'react-vanilla', directory: '../demo-react-vanilla', hmrPort: 5172 },
];

const servers = await Promise.all(
  apps.map(async (app) => {
    const appRoot = resolve(root, app.directory);
    const vite = await createViteServer({
      root: appRoot,
      configFile: join(appRoot, 'vite.config.ts'),
      base: `/${app.id}/`,
      clearScreen: false,
      server: {
        middlewareMode: true,
        hmr: { port: app.hmrPort },
      },
    });
    return { ...app, vite };
  }),
);

const landingPage = readFileSync(join(root, 'index.html'));

const httpServer = createHttpServer((request, response) => {
  const url = request.url ?? '/';
  for (const { id, vite } of servers) {
    if (url === `/${id}`) {
      response.writeHead(302, { location: `/${id}/` });
      response.end();
      return;
    }
    if (url.startsWith(`/${id}/`)) {
      vite.middlewares(request, response, () => {
        response.statusCode = 404;
        response.end('Not found');
      });
      return;
    }
  }
  if (url === '/' || url === '/index.html') {
    response.writeHead(200, { 'content-type': 'text/html' });
    response.end(landingPage);
    return;
  }
  response.statusCode = 404;
  response.end('Not found');
});

httpServer.listen(port, () => {
  console.log(`\n  Combined demo app: http://localhost:${port}/\n`);
  for (const { id } of servers) {
    console.log(`  • http://localhost:${port}/${id}/`);
  }
  console.log();
});

const shutdown = async () => {
  await Promise.all(servers.map(({ vite }) => vite.close()));
  httpServer.close(() => process.exit(0));
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
