import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  isDateControl,
} from '@jsonforms/core';
import controlRenderer from './DateControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isDateControl),
};
