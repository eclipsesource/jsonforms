import {
  and,
  isObjectArray,
  rankWith,
  uiTypeIs,
  type JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import controlRenderer from './ListWithDetailRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(4, and(uiTypeIs('ListWithDetail'), isObjectArray)),
};
