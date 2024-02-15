export { default as ObjectRenderer } from './ObjectRenderer.vue';
export { default as OneOfRenderer } from './OneOfRenderer.vue';
export { default as EnumArrayRenderer } from './EnumArrayRenderer.vue';
export { default as CategorizationRenderer } from './CategorizationRenderer.vue';
export { default as CategorizationStepperRenderer } from './CategorizationStepperRenderer.vue';

import { entry as objectRendererEntry } from './ObjectRenderer.vue';
import { entry as oneOfRendererEntry } from './OneOfRenderer.vue';
import { entry as enumArrayRendererEntry } from './EnumArrayRenderer.vue';
import { entry as categorizationEntry } from './CategorizationRenderer.vue';
import { entry as categorizationStepperEntry } from './CategorizationStepperRenderer.vue';

export const complexRenderers = [
  objectRendererEntry,
  oneOfRendererEntry,
  enumArrayRendererEntry,
  categorizationEntry,
  categorizationStepperEntry,
];
