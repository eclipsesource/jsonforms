const path = require("path");
const webpack = require('webpack');

module.exports = {
    entry: './src/jsoneditor.ts',
    output: {
      path: path.resolve("./", "dist"),
      filename: "jsoneditor.js"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: [".ts", ".js"]
    },
    plugins: [
    //   new webpack.LoaderOptionsPlugin({
    //    minimize: true,
    //    debug: false
    //  }),
    //  new webpack.optimize.UglifyJsPlugin({
    //    compress: {
    //      warnings: false,
    //      screw_ie8: true,
    //      conditionals: true,
    //      unused: true,
    //      comparisons: true,
    //      sequences: true,
    //      dead_code: true,
    //      evaluate: true,
    //      if_return: true,
    //      join_vars: true,
    //    },
    //    output: {
    //      comments: false,
    //    },
    //  })
    ],
    module: {
      rules: [
        { enforce: 'pre', test: /\.js$/, exclude: /node_modules/, loader: 'source-map-loader' },
        { test: /\.ts$/, exclude: /node_modules/, loader: 'awesome-typescript-loader' }
      ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
    },
    node: {
      fs: 'empty'
    }
};
