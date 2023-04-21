import typescript from 'rollup-plugin-typescript2';
import cleanup from 'rollup-plugin-cleanup';
import { visualizer } from 'rollup-plugin-visualizer';
import alias from '@rollup/plugin-alias';

const packageJson = require('./package.json');

const baseConfig = {
  input: 'src/index.ts',
  external: [
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.peerDependencies),
    /^lodash\/.*/,
  ],
};

const baseReduxConfig = {
  input: 'src/redux/index.ts',
  external: [
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.peerDependencies),
    ...Object.keys(packageJson.optionalPeerDependencies),
    /^lodash\/.*/,
    '@jsonforms/react',
    'redux',
  ],
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
  // Redux compatibility
  {
    ...baseReduxConfig,
    output: {
      file: 'lib/redux/index.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      alias({
        entries: [{ find: '..', replacement: '@jsonforms/react' }],
      }),
      typescript({
        tsconfig: './tsconfig.redux.json',
        useTsconfigDeclarationDir: true,
      }),
      cleanup({ extensions: ['js', 'ts', 'jsx', 'tsx'] }),
    ],
  },
  {
    ...baseReduxConfig,
    output: {
      file: 'lib/redux/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      alias({
        entries: [{ find: '..', replacement: '@jsonforms/react' }],
      }),
      typescript({
        tsconfig: './tsconfig.redux.json',
        useTsconfigDeclarationDir: true,
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
