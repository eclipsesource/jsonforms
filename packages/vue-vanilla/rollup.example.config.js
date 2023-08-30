import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-import-css';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'dev/serve.ts',
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
    vue(),
    nodeResolve({ browser: true }),
    // Transform mixed because some JsonForms modules use import and require
    commonjs({ transformMixedEsModules: true }),
    css({
      output: 'bundle.css',
    }),
    json(),
    typescript({
      tsconfigOverride: {
        include: null,
        compilerOptions: {
          // Do not emit typescript declarations for our bundled example app
          declaration: false,
        },
      },
    }),
    copy({
      targets: [
        {
          src: 'example/index.bundled.html',
          dest: 'example/dist',
          rename: () => 'index.html',
        },
      ],
    }),
  ],
};

export default config;
