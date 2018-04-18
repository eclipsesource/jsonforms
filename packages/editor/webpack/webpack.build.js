const merge = require('webpack-merge');
const baseConfig = require('../../../webpack/webpack.build.base.js');

module.exports = merge(baseConfig, {
    output: {
        filename: "jsonforms-editor.js",
        library: "JSONFormsEditor"
    },
    externals: {
        '@jsonforms/core': 'JSONFormsCore',
        '@jsonforms/react': 'JSONFormsReact',
        '@jsonforms/webcomponent': 'JSONFormsWebcomponent'
    },
});
