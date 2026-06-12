import type { ExampleGroup } from '../types';
import { person } from './person';
import { primitives } from './primitives';
import { validation } from './validation';
import { layouts } from './layouts';
import { generated } from './generated';

export { person, primitives, validation, layouts, generated };

/** All examples driven by a JSON Schema. */
export const jsonSchemaExamples: ExampleGroup = {
  id: 'json-schema',
  title: 'JSON Schema',
  examples: [person, primitives, validation, layouts, generated],
};
