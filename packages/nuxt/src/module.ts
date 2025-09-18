import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addComponent,
  addImports,
} from '@nuxt/kit';

// Module options TypeScript interface definition
export interface ModuleOptions {
  renderers: {
    export: string;
    from: string;
  };
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@jsonforms/nuxt',
    configKey: 'jsonforms',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    if (options.renderers) {
      addImports({
        name: options.renderers.export,
        as: 'defaultRenderers',
        from: options.renderers.from,
      });
    }

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'));

    addComponent({
      name: 'VueJsonForms',
      export: 'JsonForms',
      filePath: '@jsonforms/vue',
    });
    addComponent({
      name: 'JsonForms',
      filePath: resolver.resolve('./runtime/components/JsonForms.vue'),
    });
  },
});
