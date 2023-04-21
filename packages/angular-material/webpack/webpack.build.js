const merge = require('webpack-merge');
const baseConfig = require('../../../webpack/webpack.build.base.js');

module.exports = merge(baseConfig, {
  output: {
    filename: 'jsonforms-angular-material.js',
    library: 'JSONFormsAngularMaterial',
  },
  externals: {
    '@jsonforms/core': 'JSONFormsCore',
    '@jsonforms/angular': 'JSONFormsAngular',
  },
});
