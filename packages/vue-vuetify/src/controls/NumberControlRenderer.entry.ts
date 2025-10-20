import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  isNumberControl,
} from '@jsonforms/core';
import controlRenderer from './NumberControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, isNumberControl),
};
