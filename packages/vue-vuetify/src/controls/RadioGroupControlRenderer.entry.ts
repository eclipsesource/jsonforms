import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  and,
  isEnumControl,
  optionIs,
} from '@jsonforms/core';
import controlRenderer from './RadioGroupControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(20, and(isEnumControl, optionIs('format', 'radio'))),
};
