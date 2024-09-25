import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  isIntegerControl,
} from '@jsonforms/core';
import controlRenderer from './IntegerControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, isIntegerControl),
};
