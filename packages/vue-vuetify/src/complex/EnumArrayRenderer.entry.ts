import { rankWith, type JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import controlRenderer from './EnumArrayRenderer.vue';
import { isMultiEnumControl } from '../util/tester';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(5, isMultiEnumControl),
};
