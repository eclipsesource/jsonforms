export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2025-09-18',
  jsonforms: {
    renderers: { export: 'vanillaRenderers', from: '@jsonforms/vue-vanilla' },
  },
})
