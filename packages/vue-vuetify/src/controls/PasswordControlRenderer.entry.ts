import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  and,
  isStringControl,
  formatIs,
} from '@jsonforms/core';
import controlRenderer from './PasswordControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, and(isStringControl, formatIs('password'))),
};
