var webpack = require('webpack');
const merge = require('webpack-merge').merge;
const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',
    './src/index.ts',
    '../examples/src/index.ts',
    './example/index.tsx',
  ],
  output: {
    publicPath: '/assets/',
    filename: 'bundle.js',
  },

  devServer: {
    static: './example',
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader',
        options: {
          exportAsEs6Default: true,
        },
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
});
