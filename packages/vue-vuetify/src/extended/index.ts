export { default as AutocompleteEnumControlRenderer } from './AutocompleteEnumControlRenderer.vue';
export { default as AutocompleteOneOfEnumControlRenderer } from './AutocompleteOneOfEnumControlRenderer.vue';

import { entry as autocompleteEnumControlRendererEntry } from './AutocompleteEnumControlRenderer.entry';
import { entry as autocompleteOneOfEnumControlRendererEntry } from './AutocompleteOneOfEnumControlRenderer.entry';

export const extendedRenderers = [
  autocompleteEnumControlRendererEntry,
  autocompleteOneOfEnumControlRendererEntry,
];

export {
  autocompleteEnumControlRendererEntry,
  autocompleteOneOfEnumControlRendererEntry,
};
