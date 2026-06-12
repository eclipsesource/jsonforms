import type { ExampleGroup } from '../types';
import { zodRegistration } from './registration';
import { zodCrossField } from './cross-field';

export { zodRegistration, zodCrossField };

/** All examples driven by a zod schema. */
export const zodExamples: ExampleGroup = {
  id: 'zod',
  title: 'Zod',
  examples: [zodRegistration, zodCrossField],
};
