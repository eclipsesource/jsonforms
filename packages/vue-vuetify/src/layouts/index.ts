import {
  isLayout,
  rankWith,
  type JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';

import { entry as arrayLayoutRendererEntry } from './ArrayLayoutRenderer.entry';
import { entry as categorizationRendererEntry } from './CategorizationRenderer.entry';
import { entry as categorizationStepperRendererEntry } from './CategorizationStepperRenderer.entry';
import { entry as groupRendererEntry } from './GroupRenderer.entry';
import { entry as horizontalLayoutRendererEntry } from './HorizontalLayoutRenderer.entry';
import { entry as verticalLayoutRendererEntry } from './VerticalLayoutRenderer.entry';

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

export {
  layoutRendererEntry,
  arrayLayoutRendererEntry,
  categorizationRendererEntry,
  categorizationStepperRendererEntry,
  groupRendererEntry,
  horizontalLayoutRendererEntry,
  verticalLayoutRendererEntry,
};
