export { default as LabelRenderer } from './LabelRenderer.vue';
export { default as ListWithDetailRenderer } from './ListWithDetailRenderer.vue';

import { entry as labelRendererEntry } from './LabelRenderer.entry';
import { entry as listWithDetailRendererEntry } from './ListWithDetailRenderer.entry';

export const additionalRenderers = [
  labelRendererEntry,
  listWithDetailRendererEntry,
];

export { labelRendererEntry, listWithDetailRendererEntry };
