var loaders = require("./loaders");
var webpack = require('webpack');


module.exports = {
    entry: [
        "bootstrap-webpack!./bootstrap.config.js",
        './src/index.ts'
    ],
    output: {
        filename: 'build.js',
        path: 'dist/js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(
            {
                warning: false,
                mangle: true,
                comments: false
            }
        ),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.jquery': 'jquery'
        })
    ],
    devtool: 'source-map',
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json']
    },
    resolveLoader: {
        modulesDirectories: ["node_modules"]
    },
    module: {
        loaders: loaders
    }
}