module.exports = {
  chainWebpack: (config) => {
    // remove typecheck
    config.plugins.delete('fork-ts-checker');
    return config;
  },
};
