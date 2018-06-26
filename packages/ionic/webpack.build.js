const merge = require('webpack-merge');
const baseConfig = require('../../webpack/webpack.build.base.js');

module.exports = merge(baseConfig, {
    output: {
        filename: "jsonforms-ionic.js",
        library: "JSONFormsIonic"
      },
      externals: {
          '@jsonforms/core': 'JSONFormsCore',
          '@jsonforms/angular': 'JSONFormsAngular',
    },
});