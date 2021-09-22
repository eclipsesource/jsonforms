import vue from 'rollup-plugin-vue';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import packageJson from './package.json';

const buildFormats = [
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    external: [
      'vue',
      '@vue/composition-api',
      '@jsonforms/core',
      '@jsonforms/vue2',
      'lodash/startCase',
      'lodash/isEmpty',
      'lodash/findIndex',
      'lodash/merge',
      'lodash/cloneDeep',
      'lodash/mergeWith',
      'lodash/isArray',
      'lodash/every',
      'lodash/isString',
      'vuetify/lib',
      '@mdi/font',
    ],
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      }),
      commonjs({
        namedExports: {
          dayjs: ['dayjs'],
          'dayjs/plugin/customParseFormat': ['customParsing'],
          'dayjs/plugin/utc': ['utc'],
          'dayjs/plugin/timezone': ['timezone'],
        },
      }),
      vue({
        css: true,
        template: {
          isProduction: true,
        },
        // rollup-plugin-vue can't handle Vue source maps in watch mode
        // https://github.com/vuejs/rollup-plugin-vue/issues/238
        needMap: !process.env.ROLLUP_WATCH,
      }),
      typescript({
        emitDeclarationOnly: true,
      }),
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        babelHelpers: 'bundled',
      }),
    ],
  },
];

export default buildFormats;
