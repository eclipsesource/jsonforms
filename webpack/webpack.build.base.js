const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
    mode: 'production',
    entry: './src/index.ts',
    output: {
      libraryTarget: 'umd',
      umdNamedDefine: true
    },

    
    plugins: [
    ],
    module: {
      rules: [
        { enforce: 'pre', test: /\.ts$/, exclude: /node_modules/, loader: 'tslint-loader',
          options: {
            configuration: require('../tslint.json'),
            failOnHint: false,
            typeCheck: true
          }
        }
      ]
    },

    
});
