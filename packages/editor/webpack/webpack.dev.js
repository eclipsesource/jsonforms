const merge = require('webpack-merge');
const baseConfig = require('../../../webpack/webpack.dev.base.js');
var copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(baseConfig, {
  devServer: {
    contentBase: ['./src','./example/icons', './example'],
    port: 8080
  },
  plugins: [
    new copyWebpackPlugin([
      {from: './jsoneditor.css'}
    ])
  ]
});
