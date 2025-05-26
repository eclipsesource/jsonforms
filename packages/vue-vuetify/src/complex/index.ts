export { default as AllOfRenderer } from './AllOfRenderer.vue';
export { default as AnyOfRenderer } from './AnyOfRenderer.vue';
export { default as ArrayControlRenderer } from './ArrayControlRenderer.vue';
export { default as EnumArrayRenderer } from './EnumArrayRenderer.vue';
export { default as ObjectRenderer } from './ObjectRenderer.vue';
export { default as OneOfRenderer } from './OneOfRenderer.vue';
export { default as OneOfTabRenderer } from './OneOfTabRenderer.vue';
export { default as MixedRenderer } from './MixedRenderer.vue';

import { entry as allOfRendererEntry } from './AllOfRenderer.entry';
import { entry as anyOfRendererEntry } from './AnyOfRenderer.entry';
import { entry as arrayControlRendererEntry } from './ArrayControlRenderer.entry';
import { entry as enumArrayRendererEntry } from './EnumArrayRenderer.entry';
import { entry as objectRendererEntry } from './ObjectRenderer.entry';
import { entry as oneOfRendererEntry } from './OneOfRenderer.entry';
import { entry as oneOfTabRendererEntry } from './OneOfTabRenderer.entry';
import { entry as mixedRendererEntry } from './MixedRenderer.entry';

export const complexRenderers = [
  allOfRendererEntry,
  anyOfRendererEntry,
  arrayControlRendererEntry,
  enumArrayRendererEntry,
  objectRendererEntry,
  oneOfRendererEntry,
  oneOfTabRendererEntry,
  mixedRendererEntry,
];

export {
  allOfRendererEntry,
  anyOfRendererEntry,
  arrayControlRendererEntry,
  enumArrayRendererEntry,
  objectRendererEntry,
  oneOfRendererEntry,
  oneOfTabRendererEntry,
  mixedRendererEntry,
};
