const path = require('path');

// When JSONFORMS_LOCAL=true, resolve @jsonforms/* to the monorepo's locally
// built packages instead of the versions installed from npm. Build the
// packages first (`pnpm build` at the repo root), then run `npm run
// start:local` / `npm run build:local` in this folder. Without the flag the
// site uses the published @jsonforms/* versions from package.json, which is
// what CI and the production (Netlify) build rely on.
const useLocalJsonForms = process.env.JSONFORMS_LOCAL === 'true';

const localPackage = (name) =>
  path.resolve(__dirname, `../../../packages/${name}`);

const localJsonFormsAliases = useLocalJsonForms
  ? {
      '@jsonforms/core': localPackage('core'),
      '@jsonforms/react': localPackage('react'),
      '@jsonforms/material-renderers': localPackage('material-renderers'),
      '@jsonforms/examples': localPackage('examples'),
      // Force a single React instance so the aliased packages don't pull in
      // their own nested copy (which would break hooks).
      react: path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
    }
  : {};

module.exports = function () {
  return {
    name: 'custom-webpack',
    configureWebpack() {
      return {
        resolve: {
          alias: localJsonFormsAliases,
        },
        optimization: {
          splitChunks: {
            cacheGroups: {
              common: {
                minChunks: 5,
              },
            },
          },
        },
      };
    },
  };
};
