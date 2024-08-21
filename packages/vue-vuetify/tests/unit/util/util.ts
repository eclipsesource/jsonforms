import type {
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  UISchemaElement,
} from '@jsonforms/core';
import { mount } from '@vue/test-utils';
import TestComponent from './TestComponent.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

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
      renderers: renderers,
    },
    attachTo: document.body,
  });
};
