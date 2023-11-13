var webpack = require('webpack');
var path = require('path');
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    parser: { javascript: { strictExportPresence: true } },
    rules: [
      {
        test: /\.?(svg|html)$/,
        resourceQuery: /\?ngResource/,
        type: 'asset/source'
      },
      { test: /[/\\]rxjs[/\\]add[/\\].+\.js$/, sideEffects: true },
      {
        test: /\.[cm]?tsx?$/,
        loader: '@ngtools/webpack',
        exclude: [
          /[\\/]node_modules[/\\](?:css-loader|mini-css-extract-plugin|webpack-dev-server|webpack)[/\\]/
        ]
      },
      { // Angular linker needed to link partial-ivy code
        // See https://angular.io/guide/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli
        test: /[/\\]@angular[/\\].+\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@angular/compiler-cli/linker/babel'],
            compact: false,
            cacheDirectory: true
          }
        }
      },
      // {
      //   test: /.+\.ts$/,
      //   exclude: /(index.ts|mocks.ts|\.spec\.ts|\.test\.ts$)/,
      //   use: "coverage-istanbul-loader"
      // },
      {
        test: /\.html$/,
        loader: 'html-loader',
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
    new AngularWebpackPlugin({
      tsconfig: './test/tsconfig.test.json'
    })
  ],
};

function root(localPath) {
  return path.resolve(__dirname, localPath);
}
