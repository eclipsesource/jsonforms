export { default as AllOfRenderer } from './AllOfRenderer.vue';
export { default as AnyOfRenderer } from './AnyOfRenderer.vue';
export { default as ArrayControlRenderer } from './ArrayControlRenderer.vue';
export { default as EnumArrayRenderer } from './EnumArrayRenderer.vue';
export { default as ObjectRenderer } from './ObjectRenderer.vue';
export { default as OneOfRenderer } from './OneOfRenderer.vue';
export { default as OneOfTabRenderer } from './OneOfTabRenderer.vue';

import { entry as allOfRendererEntry } from './AllOfRenderer.vue';
import { entry as anyOfRendererEntry } from './AnyOfRenderer.vue';
import { entry as arrayControlRendererEntry } from './ArrayControlRenderer.vue';
import { entry as enumArrayRendererEntry } from './EnumArrayRenderer.vue';
import { entry as objectRendererEntry } from './ObjectRenderer.vue';
import { entry as oneOfRendererEntry } from './OneOfRenderer.vue';
import { entry as oneOfTabRendererEntry } from './OneOfTabRenderer.vue';

export const complexRenderers = [
  allOfRendererEntry,
  anyOfRendererEntry,
  arrayControlRendererEntry,
  enumArrayRendererEntry,
  objectRendererEntry,
  oneOfRendererEntry,
  oneOfTabRendererEntry,
];

export {
  allOfRendererEntry,
  anyOfRendererEntry,
  arrayControlRendererEntry,
  enumArrayRendererEntry,
  objectRendererEntry,
  oneOfRendererEntry,
  oneOfTabRendererEntry,
}