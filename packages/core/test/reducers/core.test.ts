/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
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
import { coreReducer } from '../../src/reducers';
import { init } from '../../src/actions';
import { JsonSchema } from '../../src/models/jsonSchema';
import {
  errorAt,
  JsonFormsCore,
  sanitizeErrors,
  subErrorsAt
} from '../../src/reducers/core';

import { createAjv } from '../../src';

test('core reducer should support v7', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar'
      }
    }
  };
  const after = coreReducer(
    undefined,
    init(
      {
        foo: 'baz'
      },
      schema
    )
  );
  t.is(after.errors.length, 1);
});

test('errorAt filters enum', t => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      bar: {
        type: 'string',
        enum: ['f', 'b']
      },
      foo: {
        type: 'string',
        enum: ['f', 'b']
      }
    }
  };
  const data = { foo: '', bar: '' };
  const v = ajv.compile(schema);
  const errors = sanitizeErrors(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors
  };
  const filtered = errorAt('foo', schema.properties.foo)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters required', t => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      bar: {
        type: 'string',
        enum: ['f', 'b']
      },
      foo: {
        type: 'string',
        enum: ['f', 'b']
      }
    },
    required: ['bar', 'foo']
  };
  const data = {};
  const v = ajv.compile(schema);
  const errors = sanitizeErrors(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors
  };
  const filtered = errorAt('foo', schema.properties.foo)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters array minItems', t => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      numbers: {
        title: 'Numbers',
        type: 'array',
        items: {
          title: 'Type',
          type: 'string',
          enum: ['One', 'Two', 'Three']
        },
        minItems: 1
      },
      colours: {
        title: 'Colours',
        type: 'array',
        items: {
          title: 'Type',
          type: 'string',
          enum: ['Red', 'Green', 'Blue']
        },
        minItems: 1
      }
    }
  };
  const data: { colours: string[]; numbers: string[] } = {
    colours: [],
    numbers: []
  };
  const v = ajv.compile(schema);
  const errors = sanitizeErrors(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors
  };
  const filtered = errorAt('colours', schema.properties.colours)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters array inner value', t => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      numbers: {
        title: 'Numbers',
        type: 'array',
        items: {
          title: 'Type',
          type: 'string',
          enum: ['One', 'Two', 'Three']
        },
        minItems: 1
      },
      colours: {
        title: 'Colours',
        type: 'array',
        items: {
          title: 'Type',
          type: 'string',
          enum: ['Red', 'Green', 'Blue']
        },
        minItems: 1
      }
    }
  };
  const data: { colours: string[]; numbers: string[] } = {
    colours: ['Foo'],
    numbers: ['Bar']
  };
  const v = ajv.compile(schema);
  const errors = sanitizeErrors(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors
  };
  const filtered = errorAt('colours.0', schema.properties.colours)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters oneOf simple', t => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      coloursOrNumbers: {
        oneOf: [
          {
            title: 'Numbers',
            type: 'string',
              enum: ['One', 'Two', 'Three']
          },
          {
            title: 'Colours',
            type: 'string',
              enum: ['Red', 'Green', 'Blue']
          }
        ]
      }
    }
  };
  const data: { coloursOrNumbers: string } = { coloursOrNumbers: 'Foo' };
  const v = ajv.compile(schema);
  const errors = sanitizeErrors(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors
  };
  const filtered = errorAt(
    'coloursOrNumbers',
    schema.properties.coloursOrNumbers.oneOf[1]
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters oneOf objects', t => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      coloursOrNumbers: {
        oneOf: [
          {
            title: 'Numbers',
            type: 'object',
            properties: {
              number: {
                title: 'Type',
                type: 'string',
                enum: ['One', 'Two', 'Three']
              }
            },
            additionalProperties: false
          },
          {
            title: 'Colours',
            type: 'object',
            properties: {
              colour: {
              title: 'Type',
              type: 'string',
              enum: ['Red', 'Green', 'Blue']
              }
            },
            additionalProperties: false
          }
        ]
      }
    },
    additionalProperties: false
  };
  const data = { coloursOrNumbers: {colour: 'Foo'} };
  const v = ajv.compile(schema);
  const errors = sanitizeErrors(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors
  };
  const filtered = errorAt(
    'coloursOrNumbers.colour',
    schema.properties.coloursOrNumbers.oneOf[1].properties.colour
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters oneOf objects same properties', t => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      coloursOrNumbers: {
        oneOf: [
          {
            title: 'Numbers',
            type: 'object',
            properties: {
              colourOrNumber: {
                title: 'Type',
                type: 'string',
                enum: ['One', 'Two', 'Three']
              }
            }
          },
          {
            title: 'Colours',
            type: 'object',
            properties: {
              colourOrNumber: {
              title: 'Type',
              type: 'string',
              enum: ['Red', 'Green', 'Blue']
              }
            }
          }
        ]
      }
    }
  };
  const data = { coloursOrNumbers: {colourOrNumber: 'Foo'} };
  const v = ajv.compile(schema);
  const errors = sanitizeErrors(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors
  };
  const filtered = errorAt(
    'coloursOrNumbers.colourOrNumber',
    schema.properties.coloursOrNumbers.oneOf[1].properties.colourOrNumber
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters oneOf array', t => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      coloursOrNumbers: {
        oneOf: [
          {
            title: 'Numbers',
            type: 'array',
            items: {
              title: 'Type',
              type: 'string',
              enum: ['One', 'Two', 'Three']
            },
            minItems: 1
          },
          {
            title: 'Colours',
            type: 'array',
            items: {
              title: 'Type',
              type: 'string',
              enum: ['Red', 'Green', 'Blue']
            },
            minItems: 1
          }
        ]
      }
    }
  };
  const data: { coloursOrNumbers: string[] } = { coloursOrNumbers: [] };
  const v = ajv.compile(schema);
  const errors = sanitizeErrors(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors
  };
  const filtered = errorAt(
    'coloursOrNumbers',
    schema.properties.coloursOrNumbers.oneOf[1]
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters oneOf array inner', t => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      coloursOrNumbers: {
        oneOf: [
          {
            title: 'Numbers',
            type: 'array',
            items: {
              title: 'Type',
              type: 'string',
              enum: ['One', 'Two', 'Three']
            },
            minItems: 1
          },
          {
            title: 'Colours',
            type: 'array',
            items: {
              title: 'Type',
              type: 'string',
              enum: ['Red', 'Green', 'Blue']
            },
            minItems: 1
          }
        ]
      }
    }
  };
  const data: { coloursOrNumbers: string[] } = { coloursOrNumbers: ['Foo'] };
  const v = ajv.compile(schema);
  const errors = sanitizeErrors(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors
  };
  const filtered = errorAt(
    'coloursOrNumbers',
    schema.properties.coloursOrNumbers.oneOf[1]
  )(state);
  t.is(filtered.length, 0);
});

test('subErrorsAt filters array inner', t => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      numbers: {
        title: 'Numbers',
        type: 'array',
        items: {
          title: 'Type',
          type: 'string',
          enum: ['One', 'Two', 'Three']
        },
        minItems: 1
      },
      colours: {
        title: 'Colours',
        type: 'array',
        items: {
          title: 'Type',
          type: 'string',
          enum: ['Red', 'Green', 'Blue']
        },
        minItems: 1
      }
    }
  };
  const data: { colours: string[]; numbers: string[] } = {
    colours: ['Foo'],
    numbers: ['Bar']
  };
  const v = ajv.compile(schema);
  const errors = sanitizeErrors(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors
  };
  const filtered = subErrorsAt('colours', schema.properties.colours
    .items as JsonSchema)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('subErrorsAt filters oneOf array inner', t => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      coloursOrNumbers: {
        oneOf: [
          {
            title: 'Numbers',
            type: 'array',
            items: {
              title: 'Type',
              type: 'string',
              enum: ['One', 'Two', 'Three']
            },
            minItems: 1
          },
          {
            title: 'Colours',
            type: 'array',
            items: {
              title: 'Type',
              type: 'string',
              enum: ['Red', 'Green', 'Blue']
            },
            minItems: 1
          }
        ]
      }
    }
  };
  const data: { coloursOrNumbers: string[] } = { coloursOrNumbers: ['Foo'] };
  const v = ajv.compile(schema);
  const errors = sanitizeErrors(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors
  };
  const filtered = subErrorsAt('coloursOrNumbers', schema.properties
    .coloursOrNumbers.oneOf[1].items as JsonSchema)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});
