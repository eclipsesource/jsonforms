/* eslint-env node */
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  // There is no file include in ESLint. Thus, ignore all and include files via negative ignore (!)
  ignorePatterns: ['/*', '!/src', '!/test', '!/example', '/example/dist'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-named-as-default': 'off',
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
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      // Scoped to src/ - example/ and test/ aren't part of the published
      // bundle, so their import shape doesn't affect consumers' bundle size.
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@mui/material',
                message:
                  "Import from the specific component path instead (e.g. '@mui/material/Button') - importing from the package root pulls in the whole barrel. See https://mui.com/material-ui/guides/minimizing-bundle-size/",
              },
              {
                name: '@mui/icons-material',
                message:
                  "Import from the specific icon path instead (e.g. '@mui/icons-material/Add') - importing from the package root pulls in the whole barrel. See https://mui.com/material-ui/guides/minimizing-bundle-size/",
              },
              {
                name: '@mui/x-date-pickers',
                message:
                  "Import from the specific component path instead (e.g. '@mui/x-date-pickers/DatePicker') - importing from the package root pulls in the whole barrel. See https://mui.com/material-ui/guides/minimizing-bundle-size/",
              },
            ],
          },
        ],
      },
    },
  ],
};
