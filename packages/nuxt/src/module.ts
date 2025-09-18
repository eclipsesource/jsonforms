import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addImports,
} from '@nuxt/kit'
import type { ViteConfig } from 'nuxt/schema'

// Module options TypeScript interface definition
export interface ModuleOptions {
  renderers: {
    export: string
    from: string
  }
}

function optimizeDeps(config: ViteConfig, dep: string) {
  const lodashIndex = config.optimizeDeps.exclude.indexOf(dep)
  if (lodashIndex > -1) {
    config.optimizeDeps.exclude.splice(lodashIndex, 1)
  }

  if (!config.optimizeDeps.include.includes(dep)) {
    config.optimizeDeps.include.push(dep)
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@jsonforms/nuxt',
    configKey: 'jsonforms',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (options.renderers) {
      addImports({
        name: options.renderers.export,
        as: 'defaultRenderers',
        from: options.renderers.from,
      })
    }

    addComponent({
      name: 'VueJsonForms',
      export: 'JsonForms',
      filePath: '@jsonforms/vue',
    })
    addComponent({
      name: 'JsonForms',
      filePath: resolver.resolve('./runtime/components/JsonForms.vue'),
    })

    nuxt.hook('vite:extendConfig', (config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
      optimizeDeps(config, '@jsonforms/core > ajv')
      optimizeDeps(config, '@jsonforms/core > ajv-formats')
      optimizeDeps(config, '@jsonforms/core > lodash')
      optimizeDeps(config, '@jsonforms/core > lodash/isEmpty')
      optimizeDeps(config, '@jsonforms/core > lodash/startCase')
      optimizeDeps(config, '@jsonforms/core > lodash/keys')
      optimizeDeps(config, '@jsonforms/core > lodash/range')
      optimizeDeps(config, '@jsonforms/core > lodash/get')
      optimizeDeps(config, '@jsonforms/core > lodash/has')
      optimizeDeps(config, '@jsonforms/core > lodash/find')
      optimizeDeps(config, '@jsonforms/core > lodash/isArray')
      optimizeDeps(config, '@jsonforms/core > lodash/includes')
      optimizeDeps(config, '@jsonforms/core > lodash/filter')
      optimizeDeps(config, '@jsonforms/core > lodash/isEqual')
      optimizeDeps(config, '@jsonforms/core > lodash/merge')
      optimizeDeps(config, '@jsonforms/core > lodash/cloneDeep')
      optimizeDeps(config, '@jsonforms/core > lodash/fp/set')
      optimizeDeps(config, '@jsonforms/core > lodash/fp/unset')
      optimizeDeps(config, '@jsonforms/core > lodash/isFunction')
      optimizeDeps(config, '@jsonforms/core > lodash/maxBy')
      optimizeDeps(config, '@jsonforms/core > lodash/remove')
      optimizeDeps(config, '@jsonforms/core > lodash/endsWith')
      optimizeDeps(config, '@jsonforms/core > lodash/last')
      optimizeDeps(config, '@jsonforms/core > lodash/reduce')
      optimizeDeps(config, '@jsonforms/core > lodash/toPairs')
      optimizeDeps(config, '@jsonforms/core > lodash/isUndefined')
      optimizeDeps(config, '@jsonforms/core > lodash/mergeWith')
      optimizeDeps(config, '@jsonforms/core > lodash/omit')
    })
  },
})
