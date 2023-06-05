import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-import-css';
import typescript from 'rollup-plugin-typescript2';

// This little plugin mitigates Rollup's lack of support for pre-built CommonJS dependencies with
// default exports.
// For mor details see here: https://github.com/eclipsesource/jsonforms/pull/2139
function cjsCompatPlugin() {
  return {
    name: 'cjs-compat-plugin',
    transform(code, id) {
      // ignore all packages which are not @mui/utils
      if (
        !/@mui\/utils.*.js$/.test(id) ||
        id.includes('@mui/utils/node_modules')
      ) {
        return code;
      }

      // try to extract the commonjs namespace variable
      const moduleName = code.match(
        /(?<module>[a-zA-Z0-9_$]*).default = _default;/
      )?.groups?.module;

      if (!moduleName || !code.includes(`return ${moduleName};`)) {
        return code;
      }

      // return default export instead of namespace
      return code.replace(
        `return ${moduleName}`,
        `return ${moduleName}.default`
      );
    },
  };
}

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
    cjsCompatPlugin(),
    copy({
      targets: [
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
