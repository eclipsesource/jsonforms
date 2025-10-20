/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { resolveData, resolveSchema } from '../../src/util/resolvers';
import { JsonSchema } from '../../src';
import test from 'ava';

test('resolveSchema - resolves schema with any ', (t) => {
  const schema: JsonSchema = {
    definitions: {
      Base: {
        type: 'object',
        properties: {
          width: {
            type: 'integer',
          },
        },
      },
      Child: {
        type: 'object',
        allOf: [
          { $ref: '#/definitions/Base' },
          {
            properties: {
              geometry: {
                type: 'string',
              },
            },
          },
        ],
      },
    },
    type: 'object',
    properties: {
      description: {
        oneOf: [
          {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
            },
          },
          {
            type: 'object',
            properties: {
              index: {
                type: 'number',
              },
            },
          },
          {
            type: 'object',
            properties: {
              exist: {
                type: 'boolean',
              },
            },
          },
          {
            type: 'object',
            properties: {
              element: {
                $ref: '#/definitions/Child',
              },
            },
          },
        ],
      },
    },
    anyOf: [
      {
        if: {
          properties: {
            exist: {
              const: true,
            },
          },
        },
        then: {
          properties: {
            lastname: {
              type: 'string',
            },
          },
        },
        else: {
          properties: {
            firstname: {
              type: 'string',
            },
            address: {
              type: 'object',
              anyOf: [
                {
                  properties: {
                    street: {
                      type: 'string',
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ],
  };
  // test backward compatibility
  t.deepEqual(
    resolveSchema(
      schema,
      '#/properties/description/oneOf/0/properties/name',
      schema
    ),
    { type: 'string' }
  );
  t.deepEqual(
    resolveSchema(
      schema,
      '#/properties/description/oneOf/1/properties/index',
      schema
    ),
    { type: 'number' }
  );
  t.deepEqual(
    resolveSchema(schema, '#/anyOf/0/then/properties/lastname', schema),
    { type: 'string' }
  );
  t.deepEqual(
    resolveSchema(schema, '#/anyOf/0/else/properties/firstname', schema),
    { type: 'string' }
  );
  t.deepEqual(
    resolveSchema(
      schema,
      '#/anyOf/0/else/properties/address/anyOf/0/properties/street',
      schema
    ),
    { type: 'string' }
  );
  // new simple approach
  t.deepEqual(
    resolveSchema(schema, '#/properties/description/properties/name', schema),
    { type: 'string' }
  );
  t.deepEqual(
    resolveSchema(schema, '#/properties/description/properties/index', schema),
    { type: 'number' }
  );
  t.deepEqual(
    resolveSchema(schema, '#/properties/description/properties/exist', schema),
    { type: 'boolean' }
  );
  t.deepEqual(resolveSchema(schema, '#/properties/lastname', schema), {
    type: 'string',
  });
  t.deepEqual(resolveSchema(schema, '#/properties/firstname', schema), {
    type: 'string',
  });
  t.deepEqual(
    resolveSchema(schema, '#/properties/address/properties/street', schema),
    { type: 'string' }
  );
  t.is(
    resolveSchema(
      schema,
      '#/properties/description/properties/notfound',
      schema
    ),
    undefined
  );
  // refs
  t.deepEqual(
    resolveSchema(
      schema,
      '#/properties/description/properties/element/properties/geometry',
      schema
    ),
    { type: 'string' }
  );
  t.deepEqual(
    resolveSchema(
      schema,
      '#/properties/description/properties/element/properties/width',
      schema
    ),
    { type: 'integer' }
  );
});

test('resolveSchema - resolves schema with encoded characters', (t) => {
  const schema = {
    type: 'object',
    properties: {
      'foo / ~ bar': {
        type: 'integer',
      },
    },
  };
  t.deepEqual(resolveSchema(schema, '#/properties/foo ~1 ~0 bar', schema), {
    type: 'integer',
  });
  t.is(resolveSchema(schema, '#/properties/foo / bar', schema), undefined);
});

test('resolveData - resolves data with % characters', (t) => {
  const data = {
    'foo%': '123',
  };
  t.deepEqual(resolveData(data, 'foo%'), '123');
});

test('resolveSchema - Should be able to resolve schema with a root ref', (t) => {
  const schema: JsonSchema = {
    definitions: {
      foo: {
        type: 'string',
      },
    },
    $ref: '#/definitions/foo',
  };
  const resolvedSchema = resolveSchema(schema, '#', schema);
  t.deepEqual(resolvedSchema, { type: 'string' });
});

test('resolveSchema - Should be able to resolve ref links containing root', (t) => {
  const schema: JsonSchema = {
    definitions: {
      foo: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          children: {
            type: 'array',
            items: {
              $ref: '#',
            },
          },
        },
      },
    },
    $ref: '#/definitions/foo',
  };
  const resolvedSchema = resolveSchema(schema, '#/properties/name', schema);
  t.deepEqual(resolvedSchema, { type: 'string' });
});

test('resolveSchema - Can follow same reference multiple times', (t) => {
  const schema: JsonSchema = {
    definitions: {
      foo: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          children: {
            type: 'array',
            items: {
              $ref: '#',
            },
          },
        },
      },
    },
    $ref: '#/definitions/foo',
  };
  const deepNestedResolvedSchema = resolveSchema(
    schema,
    '#/properties/children/items/properties/children/items/properties/children/items/properties/name',
    schema
  );
  t.deepEqual(deepNestedResolvedSchema, { type: 'string' });
});

test('resolveSchema - Resolve multiple definitions', (t) => {
  const schema: JsonSchema = {
    definitions: {
      foo: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          children: {
            type: 'array',
            items: {
              $ref: '#',
            },
          },
        },
      },
      bar: {
        $ref: '#/properties/children/items/properties/children/items/properties/children/items/properties/name',
      },
    },
    $ref: '#/definitions/foo',
  };
  const deepNestedResolvedSchema = resolveSchema(
    schema,
    '#/definitions/bar',
    schema
  );
  t.deepEqual(deepNestedResolvedSchema, { type: 'string' });
});

test('resolveSchema - handles simple direct circular reference', (t) => {
  const schema: JsonSchema = {
    $ref: '#',
  };

  const result = resolveSchema(schema, '#', schema);
  t.is(result, undefined);
});

test('resolveSchema - handles indirect circular reference (A->B->A)', (t) => {
  const schema: JsonSchema = {
    definitions: {
      nodeA: {
        $ref: '#/definitions/nodeB',
      },
      nodeB: {
        $ref: '#/definitions/nodeA',
      },
    },
    properties: {
      nodeA: { $ref: '#/definitions/nodeA' },
      nodeB: { $ref: '#/definitions/nodeB' },
    },
  };

  const circularResult1 = resolveSchema(schema, '#/properties/nodeA', schema);
  t.is(circularResult1, undefined);

  const circularResult2 = resolveSchema(
    schema,
    '#/properties/nodeB/properties/nodeA/properties/nodeB',
    schema
  );
  t.is(circularResult2, undefined);

  // But should resolve non-circular paths
  const valueResult = resolveSchema(schema, '#', schema);
  t.deepEqual(valueResult, {
    definitions: {
      nodeA: {
        $ref: '#/definitions/nodeB',
      },
      nodeB: {
        $ref: '#/definitions/nodeA',
      },
    },
    properties: {
      nodeA: { $ref: '#/definitions/nodeA' },
      nodeB: { $ref: '#/definitions/nodeB' },
    },
  });
});

test('resolveSchema - handles long circular reference chain (A->B->C->D->A)', (t) => {
  const schema: JsonSchema = {
    definitions: {
      nodeA: {
        $ref: '#/definitions/nodeB',
      },
      nodeB: {
        $ref: '#/definitions/nodeC/properties/nodeD',
      },
      nodeC: {
        properties: {
          value: { type: 'number' },
          nodeD: { $ref: '#/definitions/nodeD/properties/nodeA' },
        },
      },
      nodeD: {
        properties: {
          value: { type: 'number' },
          nodeA: { $ref: '#/definitions/nodeA' },
        },
      },
    },
    properties: {
      nodeA: { $ref: '#/definitions/nodeA' },
      nodeB: { $ref: '#/definitions/nodeB' },
      nodeC: { $ref: '#/definitions/nodeC' },
      nodeD: { $ref: '#/definitions/nodeD' },
    },
  };

  // Should return undefined for the circular path
  const circularResult = resolveSchema(schema, '#/properties/nodeA', schema);
  t.is(circularResult, undefined);

  // Should resolve non circular path
  const partialResult1 = resolveSchema(
    schema,
    '#/properties/nodeC/properties/value',
    schema
  );
  t.deepEqual(partialResult1, { type: 'number' });
});

test('resolveSchema - handles self-referencing root schema', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      children: {
        type: 'array',
        items: { $ref: '#' },
      },
    },
  };

  // Should be able to resolve the root schema reference
  const circularResult = resolveSchema(
    schema,
    '#/properties/children/items',
    schema
  );
  t.deepEqual(circularResult, schema);

  // Other properties should also resolve normally
  const nameResult = resolveSchema(schema, '#/properties/name', schema);
  t.deepEqual(nameResult, { type: 'string' });

  const childrenResult = resolveSchema(schema, '#/properties/children', schema);
  t.deepEqual(childrenResult, {
    type: 'array',
    items: { $ref: '#' },
  });
});

test('resolveSchema - combinator fallback should not cause false-positive circular detection', (t) => {
  const schema: JsonSchema = {
    definitions: {
      base: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
      derived: {
        allOf: [
          { $ref: '#/definitions/base' },
          {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
        ],
      },
    },
    type: 'object',
    properties: {
      item1: { $ref: '#/definitions/derived' },
      item2: { $ref: '#/definitions/derived' },
    },
  };

  // Both should resolve successfully - no circular reference here
  const result1 = resolveSchema(
    schema,
    '#/properties/item1/properties/id',
    schema
  );
  t.deepEqual(result1, { type: 'string' });

  const result2 = resolveSchema(
    schema,
    '#/properties/item1/properties/name',
    schema
  );
  t.deepEqual(result2, { type: 'string' });

  const result3 = resolveSchema(
    schema,
    '#/properties/item2/properties/id',
    schema
  );
  t.deepEqual(result3, { type: 'string' });

  const result4 = resolveSchema(
    schema,
    '#/properties/item2/properties/name',
    schema
  );
  t.deepEqual(result4, { type: 'string' });
});

test('resolveSchema - combinator with circular reference in one branch', (t) => {
  const schema: JsonSchema = {
    definitions: {
      circular: {
        $ref: '#/definitions/circular',
      },
      normal: {
        type: 'object',
        properties: {
          value: { type: 'string' },
        },
      },
    },
    type: 'object',
    properties: {
      mixed: {
        oneOf: [
          { $ref: '#/definitions/circular' },
          { $ref: '#/definitions/normal' },
        ],
      },
    },
  };

  // Should resolve the non-circular branch via combinator fallback
  const result = resolveSchema(
    schema,
    '#/properties/mixed/properties/value',
    schema
  );
  t.deepEqual(result, { type: 'string' });
});

test('resolveSchema - nested combinators with recursive references', (t) => {
  const schema: JsonSchema = {
    definitions: {
      node: {
        type: 'object',
        properties: {
          data: { type: 'string' },
        },
        anyOf: [
          {
            properties: {
              left: { $ref: '#/definitions/node' },
            },
          },
          {
            properties: {
              right: { $ref: '#/definitions/node' },
            },
          },
          {
            properties: {
              leaf: { type: 'boolean' },
            },
          },
        ],
      },
    },
    $ref: '#/definitions/node',
  };

  // Should resolve the leaf property via combinator fallback
  const leafResult = resolveSchema(schema, '#/properties/leaf', schema);
  t.deepEqual(leafResult, { type: 'boolean' });

  // Should resolve the data property
  const dataResult = resolveSchema(schema, '#/properties/data', schema);
  t.deepEqual(dataResult, { type: 'string' });

  // Recursive references resolve
  const leftRecursive = resolveSchema(
    schema,
    '#/properties/left/properties/left/properties/data',
    schema
  );
  t.deepEqual(leftRecursive, { type: 'string' });

  const rightRecursive = resolveSchema(
    schema,
    '#/properties/right/properties/right/properties/leaf',
    schema
  );
  t.deepEqual(rightRecursive, { type: 'boolean' });
});
