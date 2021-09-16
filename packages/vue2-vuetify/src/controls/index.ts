export { default as ControlRenderer } from './ControlRenderer.vue';
import { entry as controlRendererEntry } from './ControlRenderer.vue';

export { default as EnumControlRenderer } from './EnumControlRenderer.vue';
import { entry as enumControlRendererEntry } from './EnumControlRenderer.vue';

export const controlRenderers = [
  controlRendererEntry,
  enumControlRendererEntry,
];
