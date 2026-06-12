import { describe, expect, test } from 'vitest';
import type { FormValidator, SchemaSource } from '@jsonforms/core';
import {
  createFormEngine,
  isControlNode,
  jsonSchemaSource,
} from '@jsonforms/core';
import { ajvValidator as draft07Validator } from '@jsonforms/validator-ajv/draft-07';
import { ajvValidator as draft2020Validator } from '@jsonforms/validator-ajv/draft-2020';
import { zodSchemaSource, zodValidator } from '@jsonforms/zod';
import type { Example } from '../src';
import { allExamples } from '../src';

const sourceFor = (example: Example): SchemaSource =>
  example.format === 'zod'
    ? zodSchemaSource(example.schema)
    : jsonSchemaSource(example.schema);

const validatorFor = (example: Example): FormValidator => {
  if (example.format === 'zod') {
    return zodValidator(example.schema);
  }
  return typeof example.schema.$schema === 'string' &&
    example.schema.$schema.includes('2020-12')
    ? draft2020Validator(example.schema)
    : draft07Validator(example.schema);
};

describe('examples', () => {
  test('example ids are unique', () => {
    const ids = allExamples.map((example) => example.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const example of allExamples) {
    test(`'${example.id}' builds a presentation model without configuration issues`, () => {
      const engine = createFormEngine({
        schemaSource: sourceFor(example),
        uischema: example.uischema,
        data: example.data,
        validator: validatorFor(example),
      });
      const nodes = Object.values(engine.getModel().nodes);
      expect(nodes.length).toBeGreaterThan(1);
      const unknownScopes = nodes.filter(
        (node) =>
          isControlNode(node) &&
          node.issues.some((issue) => issue.key === 'unknown-scope'),
      );
      expect(unknownScopes).toEqual([]);
    });
  }
});
