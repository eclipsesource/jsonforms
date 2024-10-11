import {
  type JsonFormsRendererRegistryEntry,
  rankWith,
  isRangeControl,
} from '@jsonforms/core';
import controlRenderer from './SliderControlRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(4, isRangeControl),
};
