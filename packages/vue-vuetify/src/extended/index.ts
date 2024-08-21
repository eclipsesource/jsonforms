export { default as AutocompleteEnumControlRenderer } from './AutocompleteEnumControlRenderer.vue';
export { default as AutocompleteOneOfEnumControlRenderer } from './AutocompleteOneOfEnumControlRenderer.vue';

import { entry as autocompleteEnumControlRendererEntry } from './AutocompleteEnumControlRenderer.vue';
import { entry as autocompleteOneOfEnumControlRendererEntry } from './AutocompleteOneOfEnumControlRenderer.vue';

export const extendedRenderers = [
  autocompleteEnumControlRendererEntry,
  autocompleteOneOfEnumControlRendererEntry,
];

export {
  autocompleteEnumControlRendererEntry,
  autocompleteOneOfEnumControlRendererEntry,
}