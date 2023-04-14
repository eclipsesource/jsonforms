var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          plugins: [
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
          ],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'ts-loader',
          },
          'angular2-template-loader',
        ],
      },
      {
        test: /.+\.ts$/,
        exclude: /(index.ts|mocks.ts|\.spec\.ts|\.test\.ts$)/,
        loader: 'istanbul-instrumenter-loader',
        enforce: 'post',
        query: {
          esModules: true,
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader?attrs=false',
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'null-loader',
      },
    ],
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /(angular(\\|\/)core(\\|\/)@angular)/,
      root('./src'), // location of your src
      {} // a map of your routes
    ),
  ],
};

function root(localPath) {
  return path.resolve(__dirname, localPath);
}
