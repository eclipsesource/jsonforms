var webpack = require('webpack');
var path = require("path");
var copyWebpackPlugin = require("copy-webpack-plugin");


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
        extensions: [".ts", ".js", ".tsx"]
    },
    devServer: {
        contentBase: './example_plain'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new copyWebpackPlugin([
            { from: 'example/example.css' },
            { from: 'example/example.dark.css' },
            { from: 'example/example.labelfixed.css' },
            { from: 'lib/native-shim.js'  },
            { from: 'node_modules/jquery/dist/jquery.js'               },
            { from: 'node_modules/bootstrap/dist/css/bootstrap.css'    },
            { from: 'node_modules/bootstrap/dist/js/bootstrap.js'      },
            { from: 'node_modules/materialize-css/bin/materialize.css' },
            { from: 'node_modules/materialize-css/bin/materialize.js'  },
            { from: 'example/icons', to: 'icons' },
            { from: 'jsoneditor.css' }
        ])
    ],
    module: {
      rules: [
        { enforce: 'pre', test: /\.js$/, exclude: /node_modules/, loader: 'source-map-loader' },
        {
          test: /\.tsx?$/, 						  // All ts and tsx files will be process by
          loaders: [ 'babel-loader', 'ts-loader' ], // first babel-loader, then ts-loader
          exclude: /node_modules/                   // ignore node_modules
        },
        {
          test: /\.jsx?$/,                          // all js and jsx files will be processed by
          loader: 'babel-loader',                   // babel-loader
          exclude: /node_modules/                  // ignore node_modules
        },
       { test: /\.html$/, exclude: /node_modules/, loader: 'html-loader?exportAsEs6Default'}
      ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
    },
}
];
