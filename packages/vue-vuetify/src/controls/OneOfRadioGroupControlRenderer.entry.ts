import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  and,
  isOneOfEnumControl,
  optionIs,
} from '@jsonforms/core';
import controlRenderer from './OneOfRadioGroupControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(20, and(isOneOfEnumControl, optionIs('format', 'radio'))),
};
