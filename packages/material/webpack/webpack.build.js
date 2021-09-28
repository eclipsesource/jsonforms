const merge = require('webpack-merge');
const baseConfig = require('../../../webpack/webpack.build.base.js');

module.exports = merge(baseConfig, {
  output: {
    filename: "jsonforms-material.js",
    library: "JSONFormsMaterial"
  },
  externals: [
    {
      '@jsonforms/core': 'JSONFormsCore',
      '@jsonforms/react': 'JSONFormsReact',
      "react": "React",
      "redux": "Redux",
      "react-redux": "ReactRedux"
    },
    /@mui\/material\/.*/,
    /@mui\/icons-material\/.*/,
    /@mui\/lab\/.*/,
  ],
});
