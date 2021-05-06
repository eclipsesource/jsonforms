module.exports = function () {
  return {
    name: 'custom-webpack',
    configureWebpack() {
      return {
        optimization: {
          splitChunks: {
            cacheGroups: {
              common: {
                minChunks: 5,
              },
            },
          },
        },
      };
    },
  };
};
