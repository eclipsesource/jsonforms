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
import test from 'ava';

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
