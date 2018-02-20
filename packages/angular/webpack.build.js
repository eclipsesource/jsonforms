const merge = require('webpack-merge');
const baseConfig = require('../../webpack/webpack.build.base.js');

module.exports = merge(baseConfig, {
    output: {
        filename: "jsonforms-angular.js",
        library: "JSONFormsAngular"
      },
      externals: {
          '@jsonforms/core': 'JSONFormsCore',
    },
});