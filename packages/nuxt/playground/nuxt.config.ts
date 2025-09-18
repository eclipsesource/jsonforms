export default defineNuxtConfig({
  modules: ['../src/module'],
  jsonforms: {
    renderers: { export: 'vanillaRenderers', from: '@jsonforms/vue-vanilla' },
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-09-18',
});
