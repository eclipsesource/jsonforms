const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
  chainWebpack: (config) => {
    // remove typecheck
    config.plugins.delete('fork-ts-checker');

    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        // Languages are loaded on demand at runtime
        languages: ['json'],
      },
    ]);

    // config.resolve = {
    //   ...config.revolve,
    //   symlinks: false,
    //   alias: {
    //     vue: path.resolve(`../../node_modules/vue`),
    //   },
    // };

    return config;
  },
  // devServer: {
  //   watchOptions: {
  //     ignored: ['node_modules'],
  //     poll: true,
  //   },
  // },
  transpileDependencies: ['vuetify', '@jsonforms/core', '@jsonforms/vue'],
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
};
