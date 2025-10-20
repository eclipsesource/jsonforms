import {
  and,
  isOneOfControl,
  optionIs,
  rankWith,
  type JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import controlRenderer from './OneOfTabRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(4, and(isOneOfControl, optionIs('variant', 'tab'))),
};
