const merge = require('webpack-merge');
const baseConfig = require('../../../webpack/webpack.dev.base.js');
var copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(baseConfig, {
    plugins: [
        new copyWebpackPlugin([
            { from: '../example/src/logo.svg'  },
        ])
    ],
});