import {
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  UISchemaElement,
} from '@jsonforms/core';
import { createLocalVue, mount } from '@vue/test-utils';
import TestComponent from './TestComponent.vue';
import Vuetify from 'vuetify';

const localVue = createLocalVue();
const vuetify = new Vuetify();

export const mountJsonForms = (
  data: any,
  schema: JsonSchema,
  renderers: JsonFormsRendererRegistryEntry[],
  uischema?: UISchemaElement,
  config?: any
) => {
  return mount(TestComponent, {
    localVue,
    vuetify,
    propsData: {
      initialData: data,
      schema,
      uischema,
      config,
      initialRenderers: renderers,
    },
    attachTo: document.body,
  });
};
