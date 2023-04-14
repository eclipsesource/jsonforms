import vue from 'rollup-plugin-vue';
import alias from '@rollup/plugin-alias';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import cleanup from 'rollup-plugin-cleanup';
import { visualizer } from 'rollup-plugin-visualizer';

const packageJson = require('./package.json');

const baseConfig = {
  input: 'src/index.ts',
  external: [
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.peerDependencies),
    /^lodash\/.*/,
  ],
};

const buildFormats = [
  {
    ...baseConfig,
    output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      typescript({
        check: false, // types are incompatible with Vue3
        tsconfigOverride: {
          include: null,
          exclude: ['node_modules', 'tests', 'dev'],
        },
      }),
      alias({
        resolve: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      }),
      vue({
        css: false,
        template: {
          isProduction: true,
        },
      }),
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      }),
      cleanup({ extensions: ['js', 'ts', 'jsx', 'tsx', 'vue'] }),
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
        check: false, // types are incompatible with Vue3
        tsconfigOverride: {
          include: null,
          exclude: ['node_modules', 'tests', 'dev'],
          target: 'ES5',
        },
      }),
      alias({
        resolve: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      }),
      vue({
        css: false,
        template: {
          isProduction: true,
        },
      }),
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      }),
      cleanup({ extensions: ['js', 'ts', 'jsx', 'tsx', 'vue'] }),
    ],
  },
];

export default buildFormats;
