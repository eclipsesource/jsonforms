export * from './controls';
export * from './layouts';

import { controlRenderers } from './controls';
import { layoutRenderers } from './layouts';

export const vuetifyRenderers = [...controlRenderers, ...layoutRenderers];
