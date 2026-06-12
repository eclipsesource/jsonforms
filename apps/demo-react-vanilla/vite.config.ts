import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const workspaceSource = (relativePath: string) =>
  fileURLToPath(new URL(relativePath, import.meta.url));

// In dev, consume the workspace libraries directly from source: instant HMR
// across packages without library watchers or intermediate builds. Production
// builds resolve the regular package entry points (dist), like any consumer.
const sourceAliases = [
  {
    find: /^@jsonforms\/core$/,
    replacement: workspaceSource('../../packages/core/src/index.ts'),
  },
  {
    find: /^@jsonforms\/react$/,
    replacement: workspaceSource('../../packages/react/src/index.ts'),
  },
  {
    find: /^@jsonforms\/react-vanilla$/,
    replacement: workspaceSource('../../packages/react-vanilla/src/index.ts'),
  },
  {
    find: /^@jsonforms\/validator-ajv$/,
    replacement: workspaceSource('../../packages/validator-ajv/src/index.ts'),
  },
  {
    find: /^@jsonforms\/validator-ajv\/draft-07$/,
    replacement: workspaceSource(
      '../../packages/validator-ajv/src/draft-07.ts',
    ),
  },
  {
    find: /^@jsonforms\/validator-ajv\/draft-2020$/,
    replacement: workspaceSource(
      '../../packages/validator-ajv/src/draft-2020.ts',
    ),
  },
  {
    find: /^@jsonforms\/examples$/,
    replacement: workspaceSource('../../packages/examples/src/index.ts'),
  },
  {
    find: /^@jsonforms\/demo-shared$/,
    replacement: workspaceSource('../../packages/demo-shared/src/index.ts'),
  },
];

export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: { port: 5174 },
  resolve: {
    alias: command === 'serve' ? sourceAliases : [],
    dedupe: ['react', 'react-dom'],
  },
}));
