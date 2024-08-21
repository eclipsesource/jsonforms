module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transformIgnorePatterns: ['node_modules/(?!vue-router|@babel|vuetify)'],
  moduleNameMapper: {
    '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  snapshotSerializers: ['jest-serializer-html'],
  setupFiles: ['<rootDir>tests/index.ts'],
};
