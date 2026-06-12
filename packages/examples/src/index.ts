import type { Example, ExampleGroup } from './types';
import { jsonSchemaExamples } from './json-schema';
import { zodExamples } from './zod';

export * from './types';
export * from './json-schema';
export * from './zod';

/** All example groups, ordered by schema format. */
export const exampleGroups: readonly ExampleGroup[] = [
  jsonSchemaExamples,
  zodExamples,
];

/** All examples across all groups. */
export const allExamples: readonly Example[] = exampleGroups.flatMap(
  (group) => group.examples,
);

export const findExample = (id: string): Example | undefined =>
  allExamples.find((example) => example.id === id);
