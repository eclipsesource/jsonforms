# JSON Forms Nuxt

This is the JSON Forms Nuxt module which provides the necessary bindings for Nuxt. It uses [JSON Forms Core](https://github.com/eclipsesource/jsonforms/blob/master/packages/core) and [JSON Forms Vue](https://github.com/eclipsesource/jsonforms/blob/master/packages/vue).

## Features

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add @jsonforms/nuxt
```

The module replaces the `JsonForms` component from [JSON Forms Vue](https://github.com/eclipsesource/jsonforms/blob/master/packages/vue) with a Nuxt compatible component.

You can define the renderers to use in the Nuxt configuration. Remember to install the renderers package you want to use, this module does not provide them.

```ts
export default defineNuxtConfig({
  jsonforms: {
    renderers: {
      export: 'vanillaRenderers',
      from: '@jsonforms/vue-vanilla',
    },
  },
});
```

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->
