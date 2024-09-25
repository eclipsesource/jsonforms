import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  isBooleanControl,
} from '@jsonforms/core';
import controlRenderer from './BooleanControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, isBooleanControl),
};
