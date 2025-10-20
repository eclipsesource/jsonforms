import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  and,
  isStringControl,
  hasOption,
} from '@jsonforms/core';
import controlRenderer from './StringMaskControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, and(isStringControl, hasOption('mask'))),
};
