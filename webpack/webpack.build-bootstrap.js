var loaders = require("./loaders");
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: {
        'dist/jsonforms-bootstrap': './bootstrap/jsonforms-bootstrap.ts',
        'examples/assets/jsonforms': './bootstrap/jsonforms-bootstrap.ts'
    },
    output: {
        filename: '[name].js',
        path: './'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json']
    },
    resolveLoader: {
        modulesDirectories: ["node_modules"]
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
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/jsonforms.css',
                to:   'dist/jsonforms.css'
            },
            {
                from: 'bootstrap/jsonforms-bootstrap.css',
                to:   'dist/jsonforms-bootstrap.css'
            },
            {
                from: 'bootstrap/jsonforms-bootstrap.css',
                to:   'examples/assets/jsonforms.css'
            }
        ])
    ],
    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: "tslint"
            }
        ],
        loaders: loaders
    },
    tslint: {
        // These options are useful if you want to save output to files
        // for your continuous integration server
        fileOutput: {
            // The directory where each file's report is saved
            dir: "./reports/tslint",

            // The extension to use for each report's filename. Defaults to "txt"
            ext: "xml",

            // If true, all files are removed from the report directory at the beginning of run
            clean: true,

            // A string to include at the top of every report file.
            // Useful for some report formats.
            header: "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<checkstyle version=\"5.7\">",

            // A string to include at the bottom of every report file.
            // Useful for some report formats.
            footer: "</checkstyle>"
        }
    }
};
