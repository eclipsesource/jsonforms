export { default as ObjectRenderer } from './ObjectRenderer.vue';
export { default as OneOfRenderer } from './OneOfRenderer.vue';
export { default as EnumArrayRenderer } from './EnumArrayRenderer.vue';
export { default as CategorizationRenderer } from './Categorization.vue';

import { entry as objectRendererEntry } from './ObjectRenderer.vue';
import { entry as oneOfRendererEntry } from './OneOfRenderer.vue';
import { entry as enumArrayRendererEntry } from './EnumArrayRenderer.vue';
import { entry as categorizationEntry } from './Categorization.vue';

export const complexRenderers = [
  objectRendererEntry,
  oneOfRendererEntry,
  enumArrayRendererEntry,
  categorizationEntry,
];
