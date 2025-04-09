/* eslint-env node */
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    /* Reset project because @angular-eslint/recommended sets this to an incompatible value */
    project: null,
  },
  // There is no file include in ESLint. Thus, ignore all and include files via negative ignore (!)
  ignorePatterns: ['/*', '!/src', '!/test'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@angular-eslint/recommended',
    'plugin:@angular-eslint/template/process-inline-templates',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@angular-eslint/component-class-suffix': 'off',
    '@angular-eslint/directive-class-suffix': 'off',
    '@angular-eslint/no-conflicting-lifecycle': 'warn',
    // Angular ESLint 19+ reports non-standalone components as errors
    // However, we want keep using non-standalone components in the library
    // as changing this is a major breaking change for adopters
    '@angular-eslint/prefer-standalone': 'off',
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
    'import/no-unresolved': [
      'error',
      {
        // Ignore ava import because it is incorrectly reported as unresolved despite working as expected.
        ignore: ['^ava$'],
      },
    ],
  },
};
