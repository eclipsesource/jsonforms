import vue from 'rollup-plugin-vue';
import alias from '@rollup/plugin-alias';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';

const buildFormats = [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/jsonforms-vue.js',
      format: 'esm',
      exports: 'named',
      sourcemap: true
    },
    external: ['vue', '@vue/composition-api', '@jsonforms/core', 'lodash/maxBy'],
    plugins: [
      typescript({
        check: false, // types are incompatible with Vue3
        module: 'esnext',
        tsconfig: 'tsconfig.json',
        tsconfigOverride: {
          include: null,
          exclude: ['node_modules', 'tests', 'dev']
        }
      }),
      alias({
        resolve: ['.js', '.jsx', '.ts', '.tsx', '.vue']
      }),
      vue({
        css: false,
        template: {
          isProduction: true
        }
      }),
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
      })
    ]
  }
];

export default buildFormats;
