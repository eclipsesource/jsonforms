import { describe, expect, it } from 'vitest';
import { createAjv, type JsonSchema } from '@jsonforms/core';
import { literalPropertySchema } from '../../../src/util/literalPropertySchema';

describe('literal property schema', () => {
  it('preserves recursive root references without rewriting data inside defaults', () => {
    const root: JsonSchema = {
      type: 'object',
      properties: {
        next: { $ref: '#' },
        count: { type: 'integer', minimum: 1 },
      },
    };
    const schema: JsonSchema = { $ref: '#', default: { $ref: '#', count: 1 } };
    const isolated = literalPropertySchema(schema, root);
    const validate = createAjv().compile(isolated);
    expect(validate({ count: 1, next: { count: 2 } })).toBe(true);
    expect(validate({ next: { count: 0 } })).toBe(false);
    expect(isolated.default).toEqual(schema.default);
    expect(root.properties?.next.$ref).toBe('#');
  });
});
