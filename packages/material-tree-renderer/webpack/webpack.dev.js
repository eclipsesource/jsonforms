const merge = require('webpack-merge');
const baseConfig = require('../../../webpack/webpack.dev.base.js');

module.exports = merge(baseConfig, {
  devServer: {
    contentBase: ['./src','./example/icons', './example'],
    port: 8080
  }
});
