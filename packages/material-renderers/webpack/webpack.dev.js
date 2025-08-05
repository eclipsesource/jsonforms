const merge = require('webpack-merge').merge;
const baseConfig = require('../../../webpack/webpack.dev.base.js');
var copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(baseConfig, {
  plugins: [
    new copyWebpackPlugin([{ from: '../examples-react/src/logo.svg' }]),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    alias: {
      'react/jsx-runtime': 'react/jsx-runtime.js',
    },
  },
});
