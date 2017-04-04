var webpack = require('webpack');
var path = require("path");

module.exports = [{
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        './src/index.ts',
        './example/index.ts'
    ],
    output: {
      path: path.resolve("./", "dist"),
      publicPath: "/assets/",
      filename: "bundle.js"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: [".ts", ".js"]
    },
    devServer: {
        contentBase: './example'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      rules: [
        { enforce: 'pre', test: /\.js$/, exclude: /node_modules/, loader: 'source-map-loader' },
        { test: /\.ts$/, exclude: /node_modules/, loader: 'awesome-typescript-loader' },
        { test: /\.html$/, exclude: /node_modules/, loader: 'html-loader?exportAsEs6Default'}
      ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
    },
}, {
    entry: [
       './lib/native-shim.js'
    ],
    output: {
        path: path.resolve("./", "dist"),
        publicPath: "/assets/",
        filename: "native-shim.js"
    }
}];
