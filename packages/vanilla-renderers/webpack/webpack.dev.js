const merge = require('webpack-merge');
const baseConfig = require('../../../webpack/webpack.dev.base.js');
var copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(baseConfig, {
  plugins: [
    new copyWebpackPlugin([
      { from: './example/example.css' },
      { from: './example/example.dark.css' },
      { from: '../examples-react/src/logo.svg' },
    ]),
  ],
});
