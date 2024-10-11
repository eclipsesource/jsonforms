import {
  and,
  categorizationHasCategory,
  isCategorization,
  rankWith,
  type JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import layoutRenderer from './CategorizationRenderer.vue';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, and(isCategorization, categorizationHasCategory)),
};
