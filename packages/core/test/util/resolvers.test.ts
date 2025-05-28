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
import test from 'ava';
import { resolveData, resolveSchema } from '../../src/util/resolvers';

test('resolveSchema - resolves schema with any ', (t) => {
  const schema = {
    $defs: {
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
          { $ref: '#/$defs/Base' },
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
                $ref: '#/$defs/Child',
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

test('resolveSchema - root schema with top-level $ref', (t) => {
  const schema = {
    $ref: '#/definitions/person',
    definitions: {
      person: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
      },
    },
  };

  const resolved = resolveSchema(schema, '', schema);
  t.is(resolved.type, 'object');
  t.truthy(resolved.properties);
  t.truthy(resolved.properties?.name);
  t.truthy(resolved.properties?.age);
});

test('resolveSchema - self-references in root schema', (t) => {
  const schema = {
    $ref: '#',
    type: 'object',
    properties: {
      name: { type: 'string' },
      child: { $ref: '#' },
    },
  };

  const resolved = resolveSchema(schema, '', schema);
  t.is(resolved.type, 'object');
  t.truthy(resolved.properties);
  t.truthy(resolved.properties?.name);
  t.truthy(resolved.properties?.child);
});

test('resolveSchema - nested paths after resolving root schema $ref', (t) => {
  const schema = {
    $ref: '#/definitions/parent',
    definitions: {
      parent: {
        type: 'object',
        properties: {
          child: { $ref: '#/definitions/child' },
        },
      },
      child: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      },
    },
  };

  // First resolve the root schema
  const resolved = resolveSchema(schema, '', schema);
  t.is(resolved.type, 'object');

  // Then resolve the path to the child properties
  const childSchema = resolveSchema(schema, '/properties/child', schema);
  t.is(childSchema.type, 'object');
  t.truthy(childSchema.properties);
  t.is(childSchema.properties?.name.type, 'string');
});

test('resolveSchema should resolve a root schema with top-level $ref', (t) => {
  const schema = {
    $ref: '#/definitions/person',
    definitions: {
      person: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
      },
    },
  };

  const resolved = resolveSchema(schema, '', schema);
  t.is(resolved.type, 'object');
  t.deepEqual(resolved.properties?.name, { type: 'string' });
  t.deepEqual(resolved.properties?.age, { type: 'number' });
});

test('resolveSchema should handle self-references in root schema', (t) => {
  const schema = {
    $ref: '#',
    type: 'object',
    properties: {
      name: { type: 'string' },
      child: { $ref: '#' },
    },
  };

  const resolved = resolveSchema(schema, '', schema);
  t.is(resolved.type, 'object');
  t.deepEqual(resolved.properties?.name, { type: 'string' });
  t.is(resolved.properties?.child.$ref, '#');
});

test('resolveSchema should resolve nested paths after resolving root schema $ref', (t) => {
  const schema = {
    $ref: '#/definitions/parent',
    definitions: {
      parent: {
        type: 'object',
        properties: {
          child: { $ref: '#/definitions/child' },
        },
      },
      child: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      },
    },
  };

  const childSchema = resolveSchema(schema, '/properties/child', schema);
  t.is(childSchema.type, 'object');
  t.deepEqual(childSchema.properties?.name, { type: 'string' });
});

describe('resolveSchema - root schema with $ref', () => {
  test('should resolve root schema with top-level $ref', () => {
    const rootSchema = {
      $ref: '#/definitions/person',
      definitions: {
        person: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        },
      },
    };

    const resolved = resolveSchema(rootSchema, '', rootSchema);
    expect(resolved).toBeDefined();
    expect(resolved.type).toBe('object');
    expect(resolved.properties).toBeDefined();
    if (resolved.properties) {
      expect(resolved.properties.name).toBeDefined();
      expect(resolved.properties.age).toBeDefined();
    }
  });

  test('should handle self-references in root schema', () => {
    const rootSchema = {
      $ref: '#',
      type: 'object',
      properties: {
        name: { type: 'string' },
        child: { $ref: '#' },
      },
    };

    const resolved = resolveSchema(rootSchema, '', rootSchema);
    expect(resolved).toBeDefined();
    expect(resolved.type).toBe('object');
    expect(resolved.properties).toBeDefined();
    if (resolved.properties) {
      expect(resolved.properties.name).toBeDefined();
      expect(resolved.properties.child).toBeDefined();
    }
  });

  test('should correctly resolve nested paths after resolving root schema $ref', () => {
    const rootSchema = {
      $ref: '#/definitions/parent',
      definitions: {
        parent: {
          type: 'object',
          properties: {
            child: { $ref: '#/definitions/child' },
          },
        },
        child: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        },
      },
    };

    // First resolve the root schema
    const resolved = resolveSchema(rootSchema, '', rootSchema);
    expect(resolved).toBeDefined();
    expect(resolved.type).toBe('object');

    // Then resolve the path to the child properties
    const childSchema = resolveSchema(
      rootSchema,
      '/properties/child',
      rootSchema
    );
    expect(childSchema).toBeDefined();
    expect(childSchema.type).toBe('object');
    expect(childSchema.properties).toBeDefined();
    if (childSchema.properties) {
      expect(childSchema.properties.name).toBeDefined();
      expect(childSchema.properties.name.type).toBe('string');
    }
  });
});
