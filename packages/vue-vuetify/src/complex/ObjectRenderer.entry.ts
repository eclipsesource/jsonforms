import {
  isObjectControl,
  rankWith,
  type JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import controlRenderer from './ObjectRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isObjectControl),
};
