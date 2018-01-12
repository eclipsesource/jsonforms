var webpack = require('webpack');
var path = require("path");
var copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',
    './example/index.ts'
  ],
  output: {
    path: path.resolve("./", "dist"),
    publicPath: "/",
    filename: "bundle.js"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"]
  },
  devServer: {
    contentBase: ['./src','./icons', './example'],
    port: 8080
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new copyWebpackPlugin([
      {from: '../examples/lib/native-shim.js', to: 'assets/native-shim.js' },
      {from: '../examples/example.css', to: 'assets/jsonforms-example.css'},
      {from: './node_modules/materialize-css/dist/css/materialize.css', to: 'assets/materialize.css' },
      {from: './node_modules/materialize-css/dist/js/materialize.js', to: 'assets/materialize.js' },
      {from: './node_modules/materialize-css/dist/fonts', to: 'fonts'},
      {from: './node_modules/jquery/dist/jquery.js', to: 'assets/jquery.js' },
      {from: './jsoneditor.css', to: 'assets/jsoneditor.css' },
      {from: './jsoneditor.materialize.css', to: 'assets/jsoneditor.materialize.css' }
    ])
  ],
  module: {
    rules: [
      { enforce: 'pre', test: /\.js$/, exclude: /node_modules/, loader: 'source-map-loader' },
      { test: /\.tsx?$/, exclude: /node_modules/, loader: 'awesome-typescript-loader' }
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
