var loaders = require("./loaders");
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        './bootstrap/bootstrap-index.ts',
        './examples/data/jsonforms-examples.ts'
    ],
    output: {
        filename: 'jsonforms.js',
        publicPath: '/assets/'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json']
    },
    resolveLoader: {
        modulesDirectories: ["node_modules"]
    },
    devServer: {
        contentBase: './examples'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // TODO
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.jquery': 'jquery'
        }),
        new CopyWebpackPlugin([
            {
                from: 'bootstrap/jsonforms-bootstrap.css',
                to: 'examples/assets/jsonforms.css'
            }
        ])
    ],
    module:{
        loaders: loaders
    }
};
