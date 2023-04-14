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

import { generateJsonSchema } from '../../src/generators/schema';

test('default schema generation basic types', (t) => {
  const instance: any = {
    boolean: false,
    number: 3.14,
    integer: 3,
    string: 'PI',
    null: null,
    undefined: undefined,
  };
  const schema = generateJsonSchema(instance);
  // FIXME: Should a property be generated for properties with undefined?
  t.deepEqual(schema, {
    type: 'object',
    properties: {
      boolean: {
        type: 'boolean',
      },
      number: {
        type: 'number',
      },
      integer: {
        type: 'integer',
      },
      string: {
        type: 'string',
      },
      null: {
        type: 'null',
      },
      undefined: {},
    },
    additionalProperties: true,
    required: ['boolean', 'number', 'integer', 'string', 'null', 'undefined'],
  });
});
test('default schema generation array types', (t) => {
  const instance: any = {
    emptyArray: [],
    booleanArray: [false, false],
    numberArray: [3.14, 2.71],
    integerArray: [3, 2],
    stringArray: ['PI', 'e'],
    nullArray: [null, null],
  };
  const schema = generateJsonSchema(instance);
  t.deepEqual(schema, {
    type: 'object',
    properties: {
      emptyArray: {
        type: 'array',
        items: {},
      },
      booleanArray: {
        type: 'array',
        items: { type: 'boolean' },
      },
      numberArray: {
        type: 'array',
        items: { type: 'number' },
      },
      integerArray: {
        type: 'array',
        items: { type: 'integer' },
      },
      stringArray: {
        type: 'array',
        items: { type: 'string' },
      },
      nullArray: {
        type: 'array',
        items: { type: 'null' },
      },
    },
    additionalProperties: true,
    required: [
      'emptyArray',
      'booleanArray',
      'numberArray',
      'integerArray',
      'stringArray',
      'nullArray',
    ],
  });
});
test.failing('default schema generation tuple array types', (t) => {
  const instance: any = { tupleArray: [3.14, 'PI'] };
  const schema = generateJsonSchema(instance);
  // FIXME: This assumption is the correct one, but we crteate a oneOf in this case
  t.deepEqual(schema, {
    type: 'object',
    properties: {
      tupleArray: {
        type: 'array',
        items: [{ type: 'number' }, { type: 'string' }],
      },
    },
    additionalProperties: true,
    required: ['tupleArray'],
  });
});
test('default schema generation ', (t) => {
  const instance: any = {
    address: {
      streetAddress: '21 2nd Street',
      city: 'New York',
    },
    phoneNumber: [
      {
        location: 'home',
        code: 44,
        private: true,
      },
    ],
  };
  const schema = generateJsonSchema(instance);
  t.deepEqual(schema, {
    type: 'object',
    properties: {
      address: {
        type: 'object',
        properties: {
          streetAddress: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
        },
        additionalProperties: true,
        required: ['streetAddress', 'city'],
      },
      phoneNumber: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
            },
            code: {
              type: 'integer',
            },
            private: {
              type: 'boolean',
            },
          },
          additionalProperties: true,
          required: ['location', 'code', 'private'],
        },
      },
    },
    additionalProperties: true,
    required: ['address', 'phoneNumber'],
  });
});

test('schema generation with options ', (t) => {
  const instance: any = {
    address: {
      streetAddress: '21 2nd Street',
      city: 'New York',
    },
  };
  const schema = generateJsonSchema(instance, {
    additionalProperties: false,
    required: (props: string[]) => {
      const keys = Object.keys(props);
      if (props !== undefined && keys.length > 0) {
        return [keys[0]];
      } else {
        return [];
      }
    },
  });

  t.deepEqual(schema, {
    type: 'object',
    properties: {
      address: {
        type: 'object',
        properties: {
          streetAddress: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
        },
        additionalProperties: false,
        required: ['streetAddress'],
      },
    },
    additionalProperties: false,
    required: ['address'],
  });
});
