const merge = require('webpack-merge');
const baseConfig = require('../../../webpack/webpack.build.base.js');

module.exports = merge(baseConfig, {
    output: {
        filename: "jsonforms-material.js",
        library: "JSONFormsMaterial"
    },
    externals: {
        '@jsonforms/core': 'JSONFormsCore',
        '@jsonforms/webcomponent': 'JSONFormsWebcomponent'
    },
});