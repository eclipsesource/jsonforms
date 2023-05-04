/* eslint-env node */
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  // There is no file include in ESLint. Thus, ignore all and include files via negative ignore (!)
  ignorePatterns: ['/*', '!/src', '!/tests', '!/dev', '!/config'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    'plugin:prettier-vue/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    // Base rule must be disabled to avoid incorrect errors
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn', // or "error"
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
};
