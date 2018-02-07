var webpack = require('webpack');
const path = require("path");
const merge = require('webpack-merge');
const baseConfig = require('../../../webpack/webpack.base.js');

module.exports = merge(baseConfig, {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        //'./src/index.ts',
        './example/main.ts'
    ],
    output: {
      publicPath: "/assets/",
      filename: "bundle.js"
    },

    devServer: {
        contentBase: './example'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      rules: [
       { test: /\.html$/, exclude: /node_modules/, loader: 'html-loader?exportAsEs6Default'}
      ]
    },
    resolve: {
        // manually link to angular path in case of dev
        modules: [path.resolve(__dirname, "../../angular/node_modules"), "node_modules"]
    }
});