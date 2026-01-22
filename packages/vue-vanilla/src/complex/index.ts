export { default as ObjectRenderer } from './ObjectRenderer.vue';
export { default as OneOfRenderer } from './OneOfRenderer.vue';
export { default as EnumArrayRenderer } from './EnumArrayRenderer.vue';
export { default as RadioGroupEnumControlRenderer } from './RadioGroupEnumControlRenderer.vue';
export { default as RadioGroupControlRenderer } from './RadioGroupOneOfControlRenderer.vue';

import { entry as objectRendererEntry } from './ObjectRenderer.vue';
import { entry as oneOfRendererEntry } from './OneOfRenderer.vue';
import { entry as enumArrayRendererEntry } from './EnumArrayRenderer.vue';
import { entry as radioGroupEnumControlEntry } from './RadioGroupEnumControlRenderer.vue';
import { entry as radioGroupOneOfControlEntry } from './RadioGroupOneOfControlRenderer.vue';

export const complexRenderers = [
  objectRendererEntry,
  oneOfRendererEntry,
  enumArrayRendererEntry,
  radioGroupEnumControlEntry,
  radioGroupOneOfControlEntry,
];
