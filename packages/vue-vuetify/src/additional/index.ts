export { default as LabelRenderer } from './LabelRenderer.vue';
// export { default as ListWithDetailRenderer } from './ListWithDetailRenderer.vue';

import { entry as labelRendererEntry } from './LabelRenderer.vue';
// import { entry as listWithDetailRendererEntry } from './ListWithDetailRenderer.vue';

export const additionalRenderers = [
  labelRendererEntry,
  // listWithDetailRendererEntry,
];
