import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  isEnumControl,
} from '@jsonforms/core';
import controlRenderer from './EnumControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isEnumControl),
};
