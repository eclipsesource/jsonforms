import type { ExampleGroup, JsonSchemaExample } from './types';
import { jsonSchemaExamples } from './json-schema';

export * from './types';
export * from './json-schema';

/** All example groups, ordered by schema format. */
export const exampleGroups: readonly ExampleGroup[] = [jsonSchemaExamples];

/** All examples across all groups. */
export const allExamples: readonly JsonSchemaExample[] = exampleGroups.flatMap(
  (group) => group.examples,
);

export const findExample = (id: string): JsonSchemaExample | undefined =>
  allExamples.find((example) => example.id === id);
