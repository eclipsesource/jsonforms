import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  and,
  isLayout,
  uiTypeIs,
} from '@jsonforms/core';
import layoutRenderer from './GroupRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, and(isLayout, uiTypeIs('Group'))),
};
