import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  and,
  isBooleanControl,
  optionIs,
} from '@jsonforms/core';
import controlRenderer from './BooleanToggleControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(3, and(isBooleanControl, optionIs('toggle', true))),
};
