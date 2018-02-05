const merge = require('webpack-merge');
const baseConfig = require('../../webpack/webpack.build.base.js');

module.exports = merge(baseConfig, {
    output: {
        filename: "jsonforms-i18n.js",
        library: "JSONFormsI18n"
      },
});