export { default as ObjectRenderer } from './ObjectRenderer.vue';
export { default as OneOfRenderer } from './OneOfRenderer.vue';

import { entry as objectRendererEntry } from './ObjectRenderer.vue';
import { entry as oneOfRendererEntry } from './OneOfRenderer.vue';

export const complexRenderers = [objectRendererEntry, oneOfRendererEntry];
