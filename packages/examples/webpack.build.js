const merge = require('webpack-merge');
const baseConfig = require('../../webpack/webpack.build.base.js');

module.exports = merge(baseConfig, {
    output: {
        filename: "jsonforms-example.js",
        library: "JSONFormsExample"
    },
    externals: {
        '@jsonforms/core': 'JSONFormsCore'
    },
});