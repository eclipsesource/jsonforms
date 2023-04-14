import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-import-css';
import typescript from 'rollup-plugin-typescript2';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'example/index.ts',
  output: {
    file: 'example/dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true, // recommended to be set by library to be forward compatible
    }),
    nodeResolve({ browser: true }),
    // Transform mixed because some JsonForms modules use import and require
    commonjs({ transformMixedEsModules: true }),
    css(),
    json(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          // Do not emit typescript declarations for our bundled example app
          declaration: false,
        },
      },
    }),
    copy({
      targets: [
        {
          src: 'example/example*.css',
          dest: 'example/dist',
        },
        {
          src: 'example/index.bundled.html',
          dest: 'example/dist',
          rename: () => 'index.html',
        },
        {
          src: '../examples-react/src/logo.svg',
          dest: 'example/dist/assets',
        },
      ],
    }),
  ],
};

export default config;
