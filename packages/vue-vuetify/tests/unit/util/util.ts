import type {
  JsonFormsI18nState,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  UISchemaElement,
} from '@jsonforms/core';
import { mount } from '@vue/test-utils';
import TestComponent from './TestComponent.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { markRaw } from 'vue';

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require('resize-observer-polyfill');

export const mountJsonForms = (
  data: any,
  schema: JsonSchema,
  renderers: JsonFormsRendererRegistryEntry[],
  uischema?: UISchemaElement,
  config?: any,
  i18n?: JsonFormsI18nState,
) => {
  return mount(TestComponent, {
    global: {
      plugins: [vuetify],
    },
    propsData: {
      data: data,
      schema,
      uischema,
      config,
      renderers: markRaw(renderers),
      i18n,
    },
    attachTo: document.body,
  });
};
