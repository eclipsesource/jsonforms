module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@vue/test-utils$':
      '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
};
