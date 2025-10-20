import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  isTimeControl,
} from '@jsonforms/core';
import controlRenderer from './TimeControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isTimeControl),
};
