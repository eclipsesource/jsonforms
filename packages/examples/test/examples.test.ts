import { describe, expect, test } from 'vitest';
import {
  createFormEngine,
  isControlNode,
  jsonSchemaSource,
} from '@jsonforms/core';
import { ajvValidator } from '@jsonforms/validator-ajv';
import { allExamples } from '../src';

describe('examples', () => {
  test('example ids are unique', () => {
    const ids = allExamples.map((example) => example.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const example of allExamples) {
    test(`'${example.id}' builds a presentation model without configuration issues`, () => {
      const engine = createFormEngine({
        schemaSource: jsonSchemaSource(example.schema),
        uischema: example.uischema,
        data: example.data,
        validator: ajvValidator(example.schema),
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
