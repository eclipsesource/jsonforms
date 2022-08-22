import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  isLayout,
} from '@jsonforms/core';

import { entry as arrayLayoutRendererEntry } from './ArrayLayoutRenderer.vue';
import { entry as categorizationRendererEntry } from './CategorizationRenderer.vue';
import { entry as categorizationStepperRendererEntry } from './CategorizationStepperRenderer.vue';
import { entry as groupRendererEntry } from './GroupRenderer.vue';
import { entry as horizontalLayoutRendererEntry } from './HorizontalLayoutRenderer.vue';
import { entry as verticalLayoutRendererEntry } from './VerticalLayoutRenderer.vue';

export {
  arrayLayoutRendererEntry,
  categorizationRendererEntry,
  categorizationStepperRendererEntry,
  groupRendererEntry,
  horizontalLayoutRendererEntry,
  verticalLayoutRendererEntry,
};

import { default as VerticalLayoutRenderer } from './VerticalLayoutRenderer.vue';
export { default as ArrayLayoutRenderer } from './ArrayLayoutRenderer.vue';
export { default as CategorizationRenderer } from './CategorizationRenderer.vue';
export { default as CategorizationStepperRenderer } from './CategorizationStepperRenderer.vue';
export { default as GroupRenderer } from './GroupRenderer.vue';
export { default as HorizontalLayoutRenderer } from './HorizontalLayoutRenderer.vue';
export { default as VerticalLayoutRenderer } from './VerticalLayoutRenderer.vue';

// default layout renderer is the VerticalLayoutRenderer
const layoutRendererEntry: JsonFormsRendererRegistryEntry = {
  renderer: VerticalLayoutRenderer,
  tester: rankWith(1, isLayout),
};

export const layoutRenderers = [
  layoutRendererEntry,
  arrayLayoutRendererEntry,
  categorizationRendererEntry,
  categorizationStepperRendererEntry,
  groupRendererEntry,
  horizontalLayoutRendererEntry,
  verticalLayoutRendererEntry,
];
