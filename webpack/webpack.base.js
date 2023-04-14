const path = require('path');
module.exports = {
  output: {
    path: path.resolve('./', 'lib'),
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' as resolvable extensions.
    extensions: ['.ts', '.js', '.tsx'],
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
      },
      {
        test: /\.tsx?$/, // All ts and tsx files will be process by
        use: [
          // first ts-loader, then babel-loader
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
              ],
            },
          },
          { loader: 'ts-loader' },
        ],
        exclude: /node_modules/, // ignore node_modules
      },
      {
        test: /\.jsx?$/, // all js and jsx files will be processed by
        loader: 'babel-loader', // babel-loader
        options: {
          plugins: [
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
          ],
        },
        exclude: /node_modules/, // ignore node_modules
      },
    ],
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {},
};
