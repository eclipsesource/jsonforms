import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      outDir: 'lib', // specify the output directory for .d.ts files
      tsconfigPath: './tsconfig.lib.json', // specify the path to your tsconfig.json file
      entryRoot: 'src', // root directory for the declaration files
      cleanVueFileName: true, // removes .vue suffix from filenames
      staticImport: true, // uses static imports in declaration files
    }),
  ],
  build: {
    outDir: 'lib',
    lib: {
      // tell the build process to treat this project as library
      entry: resolve(__dirname, 'src/index.ts'),
      name: packageJson.name,
      formats: ['es', 'cjs', 'umd'],
      fileName: (format: string) => {
        if (format === 'es') {
          format = 'esm';
        }
        return `jsonforms-vue-vuetify.${format}.js`;
      },
    },
    rollupOptions: {
      external: [
        ...Object.keys(packageJson.peerDependencies),
        'vue',
        /^lodash\/.*/,
        /^dayjs\/.*/,
        /^ajv\/.*/,
        /^vuetify\/.*/,
      ],
      output: {
        globals: (name: string) => {
          if (name === 'vue') {
            return 'Vue';
          } else if (name.startsWith('vuetify')) {
            // check https://vuetifyjs.com/en/getting-started/installation/#using-cdn
            // Replace all slashes with dots
            let result = name.replace(/\//g, '.');

            // Capitalize the first letter
            result = result.charAt(0).toUpperCase() + result.slice(1);

            return result;
          } else if (name.startsWith('lodash')) {
            if (name === 'lodash') {
              return '_';
            }
            // Replace occurrences of 'lodash/XYZ' with '_.XYZ'
            const result = name.replace(/lodash\/(.*)/g, (match, p1) => {
              return '_.' + p1.replace(/\//g, '.');
            });

            return result;
          } else if (name.startsWith('dayjs')) {
            if (name === 'dayjs') {
              return 'dayjs';
            }
            // check https://day.js.org/docs/en/plugin/loading-into-browser
            // Replace occurrences of 'dayjs/XYZ' with 'dayjs_XYZ'
            const result = name.replace(/dayjs\/(.*)/g, (match, p1) => {
              return 'dayjs_' + p1.replace(/\//g, '_');
            });

            return result;
          }
          return name;
        },
        assetFileNames: 'jsonforms-vue-vuetify.[ext]',
      },
    },
    minify: false, // builds unminified files
    sourcemap: true, // generates sourcemap files
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
