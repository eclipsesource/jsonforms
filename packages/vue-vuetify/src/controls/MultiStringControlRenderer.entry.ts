import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  and,
  isStringControl,
  isMultiLineControl,
} from '@jsonforms/core';
import controlRenderer from './MultiStringControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, and(isStringControl, isMultiLineControl)),
};
