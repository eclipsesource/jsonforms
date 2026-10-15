import typescript from 'rollup-plugin-typescript2';
import cleanup from 'rollup-plugin-cleanup';
import { visualizer } from 'rollup-plugin-visualizer';

const packageJson = require('./package.json');

const externalPackages = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
];

const isExternal = (id) =>
  externalPackages.some((pkg) => id === pkg || id.startsWith(pkg + '/')) ||
  /^lodash\//.test(id);

/**
 * rollup-plugin-typescript2 loads every file TypeScript resolves (to
 * type-check type-only imports) but only recognizes `.d.ts` as declarations.
 * Packages shipping `.d.mts` / `.d.cts` typings (e.g. valibot) would then be
 * parsed as JavaScript; hand Rollup an empty module for them instead.
 */
const ignoreModernDeclarations = {
  name: 'ignore-modern-declarations',
  load: (id) => (/\.d\.[mc]ts$/.test(id) ? 'export {};' : null),
};

const baseConfig = {
  input: 'src/index.ts',
  external: isExternal,
};

export default [
  {
    ...baseConfig,
    output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      ignoreModernDeclarations,
      typescript(),
      cleanup({ extensions: ['js', 'ts', 'jsx', 'tsx'] }),
      visualizer({ open: false }),
    ],
  },
  {
    ...baseConfig,
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      ignoreModernDeclarations,
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            target: 'ES5',
          },
        },
      }),
      cleanup({ extensions: ['js', 'ts', 'jsx', 'tsx'] }),
    ],
  },
];
