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
import Ajv, { ErrorObject } from 'ajv';
import { coreReducer } from '../../src/reducers';
import {
  init,
  setSchema,
  setValidationMode,
  update,
  updateCore,
  updateErrors,
} from '../../src/actions';
import { JsonSchema } from '../../src/models/jsonSchema';

import { cloneDeep } from 'lodash';
import { createAjv, validate } from '../../src/util/validator';
import { JsonFormsCore, errorAt, subErrorsAt } from '../../src/store';
import { getControlPath } from '../../src/util';

test('core reducer should support v7', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar',
      },
    },
  };
  const after = coreReducer(
    undefined,
    init(
      {
        foo: 'baz',
      },
      schema
    )
  );
  t.is(after.errors.length, 1);
});

test('core reducer - no previous state - init without options should create new ajv', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar',
      },
    },
  };
  const after = coreReducer(undefined, init({}, schema, undefined, undefined));
  t.true(after.ajv !== undefined);
});

test('core reducer - no previous state - init with ajv as options object should use it', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar',
      },
    },
  };
  const myAjv = new Ajv();
  const after = coreReducer(undefined, init({}, schema, undefined, myAjv));
  t.deepEqual(after.ajv, myAjv);
});

test('core reducer - no previous state - init with empty options object', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar',
      },
    },
  };
  const after = coreReducer(undefined, init({}, schema, undefined, {}));
  t.true(after.ajv !== undefined);
});

test('core reducer - no previous state - init with options object with ajv', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar',
      },
    },
  };
  const myAjv = new Ajv();
  const after = coreReducer(
    undefined,
    init({}, schema, undefined, {
      ajv: myAjv,
    })
  );
  t.deepEqual(after.ajv, myAjv);
});

test('core reducer - previous state - init without options should keep previous objects', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar',
      },
    },
  };
  const myAjv = new Ajv();
  const additionalErrors = [
    {
      instancePath: '',
      dataPath: '',
      schemaPath: '#/required',
      keyword: 'required',
      params: {
        missingProperty: 'foo',
      },
    },
  ];
  const after = coreReducer(
    {
      data: {},
      schema: {},
      uischema: {
        type: 'Label',
      },
      ajv: myAjv,
      additionalErrors,
    },
    init({}, schema)
  );
  t.deepEqual(after.ajv, myAjv);
  t.deepEqual(after.additionalErrors, additionalErrors);
});

test('core reducer - previous state - init with ajv options object should overwrite ajv', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar',
      },
    },
  };
  const previousAjv = new Ajv();
  const newAjv = new Ajv();
  const after = coreReducer(
    {
      data: {},
      schema: {},
      uischema: {
        type: 'Label',
      },
      ajv: previousAjv,
    },
    init({}, schema, undefined, newAjv)
  );
  t.deepEqual(after.ajv, newAjv);
});

test('core reducer - previous state - init with additionalErrors option object should overwrite additionalErrors', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar',
      },
    },
  };

  const prevAdditionalErrors = [
    {
      instancePath: '',
      dataPath: '',
      schemaPath: '#/required',
      keyword: 'required',
      params: {
        missingProperty: 'foo',
      },
    },
  ];
  const currentAdditionalErrors = [
    {
      instancePath: '',
      dataPath: '',
      schemaPath: '#/required',
      keyword: 'required',
      params: {
        missingProperty: 'bar',
      },
    },
  ];
  const after = coreReducer(
    {
      data: {},
      schema: {},
      uischema: {
        type: 'Label',
      },
      additionalErrors: prevAdditionalErrors,
    },
    init({}, schema, undefined, { additionalErrors: currentAdditionalErrors })
  );
  t.deepEqual(after.additionalErrors, currentAdditionalErrors);
});

test('core reducer - previous state - init with empty options should not overwrite', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar',
      },
    },
  };
  const myAjv = new Ajv();
  const additionalErrors = [
    {
      instancePath: '',
      dataPath: '',
      schemaPath: '#/required',
      keyword: 'required',
      params: {
        missingProperty: 'foo',
      },
    },
  ];
  const after = coreReducer(
    {
      data: {},
      schema: {},
      uischema: {
        type: 'Label',
      },
      ajv: myAjv,
      additionalErrors,
    },
    init({}, schema, undefined, {})
  );
  t.deepEqual(after.ajv, myAjv);
  t.deepEqual(after.additionalErrors, additionalErrors);
});

test('core reducer - previous state - init with undefined data should not change data', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
      color: {
        type: 'string',
      },
    },
  };

  const after = coreReducer(
    {
      data: undefined,
      schema: {},
      uischema: {
        type: 'Label',
      },
    },
    init(undefined, schema, undefined, {})
  );
  t.deepEqual(after.data, undefined);
});

test('core reducer - previous state - init schema with id', (t) => {
  const schema: JsonSchema = {
    $id: 'https://www.jsonforms.io/example.json',
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };
  const updatedSchema = cloneDeep(schema);
  updatedSchema.properties.animal.minLength = 5;

  const before: JsonFormsCore = coreReducer(
    undefined,
    init(undefined, schema, undefined, undefined)
  );

  const after: JsonFormsCore = coreReducer(
    before,
    init(undefined, updatedSchema, before.uischema, undefined)
  );
  t.is(after.schema.properties.animal.minLength, 5);
});

test('core reducer - update - undefined data should update for given path', (t) => {
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
      },
    },
  };

  const before: JsonFormsCore = {
    data: undefined,
    schema: schema,
    uischema: {
      type: 'Label',
    },
    errors: [],
    validator: new Ajv().compile(schema),
  };

  const after = coreReducer(
    before,
    update('foo', (_) => {
      return 'bar';
    })
  );

  t.not(before, after);
  t.not(before.data, after.data);
  t.deepEqual(after, { ...before, data: { foo: 'bar' } });
});

test('core reducer - update - path is undefined state should remain same', (t) => {
  const before: JsonFormsCore = {
    data: {
      foo: 'bar',
      baz: {
        bar: 'bar',
      },
    },
    schema: {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
          const: 'bar',
        },
      },
    },
    uischema: {
      type: 'Label',
    },
  };

  const after = coreReducer(
    before,
    update(undefined, (_) => {
      return { foo: 'anything' };
    })
  );

  t.is(before, after);
  t.is(before.data, after.data);
  t.is(before.data.baz, after.data.baz);
  t.deepEqual(before, after);
});

test('core reducer - update - path is null state should remain same', (t) => {
  const before: JsonFormsCore = {
    data: {
      foo: 'bar',
      baz: {
        bar: 'bar',
      },
    },
    schema: {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
          const: 'bar',
        },
      },
    },
    uischema: {
      type: 'Label',
    },
  };

  const after = coreReducer(
    before,
    update(null, (_) => {
      return { foo: 'anything' };
    })
  );

  t.is(before, after);
  t.is(before.data, after.data);
  t.is(before.data.baz, after.data.baz);
  t.deepEqual(before, after);
});

test('core reducer - update - empty path should update root state', (t) => {
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
      },
    },
  };

  const before: JsonFormsCore = {
    data: {
      foo: 'bar',
      baz: {
        bar: 'bar',
      },
    },
    errors: [],
    schema,
    uischema: {
      type: 'Label',
    },
    validator: new Ajv().compile(schema),
  };

  const after = coreReducer(
    before,
    update('', (_) => {
      return { foo: 'xyz' };
    })
  );

  t.not(before, after);
  t.not(before.data, after.data);
  t.deepEqual(after, { ...before, data: { foo: 'xyz' } });
});

test('core reducer - update - providing a path should update data only belonging to path', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
      color: {
        type: 'string',
      },
    },
  };

  const before: JsonFormsCore = {
    data: {
      animal: 'Sloth',
      color: 'Blue',
      baz: {
        bar: 'bar',
      },
    },
    errors: [],
    schema,
    uischema: {
      type: 'Label',
    },
    validator: new Ajv().compile(schema),
  };

  const after = coreReducer(
    before,
    update('color', (_) => {
      return 'Green';
    })
  );

  t.not(before, after);
  t.not(before.data, after.data);
  t.is(before.data.baz, after.data.baz);
  t.deepEqual(after, { ...before, data: { ...before.data, color: 'Green' } });
});

test('core reducer - update - should update errors', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
      color: {
        type: 'string',
        enum: ['Blue', 'Green'],
      },
    },
  };

  const before: JsonFormsCore = {
    data: {
      animal: 'Sloth',
      color: 'Blue',
    },
    errors: [],
    schema,
    uischema: {
      type: 'Label',
    },
    validator: new Ajv().compile(schema),
  };

  const after = coreReducer(
    before,
    update('color', (_) => {
      return 'Yellow';
    })
  );

  t.deepEqual(after, {
    ...before,
    data: { ...before.data, color: 'Yellow' },
    errors: [
      {
        instancePath: '/color',
        keyword: 'enum',
        message: 'must be equal to one of the allowed values',
        params: {
          allowedValues: ['Blue', 'Green'],
        },
        schemaPath: '#/properties/color/enum',
      },
    ],
  });
});

test('core reducer - update - setting a state slice as undefined should remove the slice', (t) => {
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
      },
      fizz: {
        type: 'string',
      },
    },
  };

  const before: JsonFormsCore = {
    data: {
      foo: 'bar',
      fizz: 42,
    },
    schema: schema,
    uischema: {
      type: 'Label',
    },
    errors: [],
    validator: new Ajv().compile(schema),
  };

  const after = coreReducer(
    before,
    update('foo', (_) => {
      return undefined;
    })
  );

  t.not(before, after);
  t.not(before.data, after.data);
  t.deepEqual(Object.keys(after.data), ['fizz']);
});

test('core reducer - updateErrors - should update errors with empty list', (t) => {
  const before: JsonFormsCore = {
    data: {},
    schema: {},
    uischema: undefined,
  };

  const after = coreReducer(before, updateErrors([]));
  t.deepEqual(after, { ...before, errors: [] });
});

test('core reducer - updateErrors - should update errors with error', (t) => {
  const before: JsonFormsCore = {
    data: {},
    schema: {},
    uischema: undefined,
    errors: [],
  };

  const error = {
    instancePath: '/color',
    keyword: 'enum',
    message: 'should be equal to one of the allowed values',
    params: {
      allowedValues: ['Blue', 'Green'],
    },
    schemaPath: '#/properties/color/enum',
  };

  const after = coreReducer(before, updateErrors([error]));
  t.deepEqual(after, { ...before, errors: [error] });
});

test('core reducer - updateErrors - should update errors with undefined', (t) => {
  const before: JsonFormsCore = {
    data: {},
    schema: {},
    uischema: undefined,
    errors: [],
  };

  const after = coreReducer(before, updateErrors(undefined));
  t.deepEqual(after, { ...before, errors: undefined });
});

test('errorAt filters enum', (t) => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      bar: {
        type: 'string',
        enum: ['f', 'b'],
      },
      foo: {
        type: 'string',
        enum: ['f', 'b'],
      },
    },
  };
  const data = { foo: '', bar: '' };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt('foo', schema.properties.foo)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters required', (t) => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      bar: {
        type: 'string',
        enum: ['f', 'b'],
      },
      foo: {
        type: 'string',
        enum: ['f', 'b'],
      },
    },
    required: ['bar', 'foo'],
  };
  const data = {};
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt('foo', schema.properties.foo)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters required in oneOf object', (t) => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      fooOrBar: {
        oneOf: [
          {
            title: 'Foo',
            type: 'object',
            properties: {
              foo: {
                type: 'string',
              },
            },
            required: ['foo'],
            additionalProperties: false,
          },
          {
            title: 'Bar',
            type: 'object',
            properties: {
              bar: {
                type: 'number',
              },
            },
            required: ['bar'],
            additionalProperties: false,
          },
        ],
      },
    },
    additionalProperties: false,
  };
  const data = { fooOrBar: {} };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt(
    'fooOrBar.foo',
    schema.properties.fooOrBar.oneOf[0].properties.foo
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0].keyword, 'required');
});

test('errorAt filters required in anyOf object', (t) => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      fooOrBar: {
        anyOf: [
          {
            title: 'Foo',
            type: 'object',
            properties: {
              foo: {
                type: 'string',
              },
            },
            required: ['foo'],
            additionalProperties: false,
          },
          {
            title: 'Bar',
            type: 'object',
            properties: {
              bar: {
                type: 'number',
              },
            },
            required: ['bar'],
            additionalProperties: false,
          },
        ],
      },
    },
    additionalProperties: false,
  };
  const data = { fooOrBar: {} };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt(
    'fooOrBar.foo',
    schema.properties.fooOrBar.anyOf[0].properties.foo
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0].keyword, 'required');
});

test('errorAt filters array minItems', (t) => {
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
          enum: ['One', 'Two', 'Three'],
        },
        minItems: 1,
      },
      colours: {
        title: 'Colours',
        type: 'array',
        items: {
          title: 'Type',
          type: 'string',
          enum: ['Red', 'Green', 'Blue'],
        },
        minItems: 1,
      },
    },
  };
  const data: { colours: string[]; numbers: string[] } = {
    colours: [],
    numbers: [],
  };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt('colours', schema.properties.colours)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters array inner value', (t) => {
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
          enum: ['One', 'Two', 'Three'],
        },
        minItems: 1,
      },
      colours: {
        title: 'Colours',
        type: 'array',
        items: {
          title: 'Type',
          type: 'string',
          enum: ['Red', 'Green', 'Blue'],
        },
        minItems: 1,
      },
    },
  };
  const data: { colours: string[]; numbers: string[] } = {
    colours: ['Foo'],
    numbers: ['Bar'],
  };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt('colours.0', schema.properties.colours)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters oneOf enum', (t) => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      oneOfEnum: {
        type: 'string',
        oneOf: [
          { title: 'Number', const: '1' },
          { title: 'Color', const: '2' },
        ],
      },
    },
  };
  const data: { oneOfEnum: string } = { oneOfEnum: '3' };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt('oneOfEnum', schema.properties.oneOfEnum)(state);
  t.is(filtered.length, 1);
  // in the state, we get 3 errors: one for each const value in the oneOf (we have two consts here) and one for the oneOf property itself
  // we only display the last error on the control
  t.deepEqual(filtered[0], state.errors[2]);
});

test('errorAt filters array with inner oneOf enum', (t) => {
  const ajv = createAjv();
  const schema = {
    type: 'object',
    properties: {
      parentArray: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            oneOfEnumWithError: {
              type: 'string',
              oneOf: [
                { title: 'Number', const: '1' },
                { title: 'Color', const: '2' },
              ],
            },
          },
        },
      },
    },
  };
  const data: { parentArray: { oneOfEnumWithError: string }[] } = {
    parentArray: [{ oneOfEnumWithError: 'test' }],
  };
  const v = ajv.compile(schema);
  const errors = validate(v, data);
  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt(
    'parentArray.0.oneOfEnumWithError',
    schema.properties.parentArray.items.properties.oneOfEnumWithError
  )(state);
  t.is(filtered.length, 1);
  // in the state, we get 3 errors: one for each const value in the oneOf (we have two consts here) and one for the oneOf property itself
  // we only display the last error on the control
  t.deepEqual(filtered[0], state.errors[2]);
});

test('errorAt filters oneOf simple', (t) => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      coloursOrNumbers: {
        oneOf: [
          {
            title: 'Numbers',
            type: 'string',
            enum: ['One', 'Two', 'Three'],
          },
          {
            title: 'Colours',
            type: 'string',
            enum: ['Red', 'Green', 'Blue'],
          },
        ],
      },
    },
  };
  const data: { coloursOrNumbers: string } = { coloursOrNumbers: 'Foo' };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt(
    'coloursOrNumbers',
    schema.properties.coloursOrNumbers.oneOf[1]
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters anyOf simple', (t) => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      coloursOrNumbers: {
        anyOf: [
          {
            title: 'Numbers',
            type: 'string',
            enum: ['One', 'Two', 'Three'],
          },
          {
            title: 'Colours',
            type: 'string',
            enum: ['Red', 'Green', 'Blue'],
          },
        ],
      },
    },
  };
  const data: { coloursOrNumbers: string } = { coloursOrNumbers: 'Foo' };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt(
    'coloursOrNumbers',
    schema.properties.coloursOrNumbers.anyOf[1]
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters oneOf objects', (t) => {
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
                enum: ['One', 'Two', 'Three'],
              },
            },
            additionalProperties: false,
          },
          {
            title: 'Colours',
            type: 'object',
            properties: {
              colour: {
                title: 'Type',
                type: 'string',
                enum: ['Red', 'Green', 'Blue'],
              },
            },
            additionalProperties: false,
          },
        ],
      },
    },
    additionalProperties: false,
  };
  const data = { coloursOrNumbers: { colour: 'Foo' } };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt(
    'coloursOrNumbers.colour',
    schema.properties.coloursOrNumbers.oneOf[1].properties.colour
  )(state);
  t.is(filtered.length, 1);
  t.is(filtered[0].keyword, 'enum');
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters oneOf objects same properties', (t) => {
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
                enum: ['One', 'Two', 'Three'],
              },
            },
          },
          {
            title: 'Colours',
            type: 'object',
            properties: {
              colourOrNumber: {
                title: 'Type',
                type: 'string',
                enum: ['Red', 'Green', 'Blue'],
              },
            },
          },
        ],
      },
    },
  };
  const data = { coloursOrNumbers: { colourOrNumber: 'Foo' } };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt(
    'coloursOrNumbers.colourOrNumber',
    schema.properties.coloursOrNumbers.oneOf[1].properties.colourOrNumber
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters oneOf array', (t) => {
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
              enum: ['One', 'Two', 'Three'],
            },
            minItems: 1,
          },
          {
            title: 'Colours',
            type: 'array',
            items: {
              title: 'Type',
              type: 'string',
              enum: ['Red', 'Green', 'Blue'],
            },
            minItems: 1,
          },
        ],
      },
    },
  };
  const data: { coloursOrNumbers: string[] } = { coloursOrNumbers: [] };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt(
    'coloursOrNumbers',
    schema.properties.coloursOrNumbers.oneOf[1]
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters oneOf array inner', (t) => {
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
              enum: ['One', 'Two', 'Three'],
            },
            minItems: 1,
          },
          {
            title: 'Colours',
            type: 'array',
            items: {
              title: 'Type',
              type: 'string',
              enum: ['Red', 'Green', 'Blue'],
            },
            minItems: 1,
          },
        ],
      },
    },
  };
  const data: { coloursOrNumbers: string[] } = { coloursOrNumbers: ['Foo'] };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = errorAt(
    'coloursOrNumbers',
    schema.properties.coloursOrNumbers.oneOf[1]
  )(state);
  t.is(filtered.length, 0);
});

test('subErrorsAt filters array inner', (t) => {
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
          enum: ['One', 'Two', 'Three'],
        },
        minItems: 1,
      },
      colours: {
        title: 'Colours',
        type: 'array',
        items: {
          title: 'Type',
          type: 'string',
          enum: ['Red', 'Green', 'Blue'],
        },
        minItems: 1,
      },
    },
  };
  const data: { colours: string[]; numbers: string[] } = {
    colours: ['Foo'],
    numbers: ['Bar'],
  };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = subErrorsAt(
    'colours',
    schema.properties.colours.items as JsonSchema
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('subErrorsAt only returning suberrors', (t) => {
  const ajv = createAjv();
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      numbers: {
        title: 'Numbers',
        type: 'array',
        minItems: 1,
        items: {
          title: 'Type',
          type: 'string',
          enum: ['One', 'Two', 'Three'],
        },
      },
    },
  };
  const data: { numbers: string[] } = {
    numbers: [],
  };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const subErrors = subErrorsAt(
    'numbers',
    schema.properties.numbers.items as JsonSchema
  )(state);
  t.is(subErrors.length, 0);
});

test('subErrorsAt filters oneOf array inner', (t) => {
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
              enum: ['One', 'Two', 'Three'],
            },
            minItems: 1,
          },
          {
            title: 'Colours',
            type: 'array',
            items: {
              title: 'Type',
              type: 'string',
              enum: ['Red', 'Green', 'Blue'],
            },
            minItems: 1,
          },
        ],
      },
    },
  };
  const data: { coloursOrNumbers: string[] } = { coloursOrNumbers: ['Foo'] };
  const v = ajv.compile(schema);
  const errors = validate(v, data);

  const state: JsonFormsCore = {
    data,
    schema,
    uischema: undefined,
    errors,
  };
  const filtered = subErrorsAt(
    'coloursOrNumbers',
    schema.properties.coloursOrNumbers.oneOf[1].items as JsonSchema
  )(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt respects hide validation mode', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 100,
  };

  const core: JsonFormsCore = coreReducer(
    undefined,
    init(data, schema, undefined, { validationMode: 'ValidateAndHide' })
  );
  t.is(core.errors.length, 1);
  t.is(errorAt('animal', schema)(core).length, 0);
});

test('errorAt contains additionalErrors', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 100,
  };

  const additionalErrors = [
    {
      instancePath: '',
      dataPath: '',
      schemaPath: '#/required',
      keyword: 'required',
      params: {
        missingProperty: 'animal',
      },
    },
  ];
  const core: JsonFormsCore = coreReducer(
    undefined,
    init(data, schema, undefined, { additionalErrors })
  );
  t.is(core.errors.length, 1);
  t.is(core.additionalErrors.length, 1);
  const errorsAt = errorAt('animal', schema)(core);
  t.is(errorsAt.length, 2);
  t.true(errorsAt.indexOf(additionalErrors[0]) > -1);
});

test('errorAt contains additionalErrors for validation mode NoValidation ', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 100,
  };

  const additionalErrors = [
    {
      instancePath: '',
      dataPath: '',
      schemaPath: '#/required',
      keyword: 'required',
      params: {
        missingProperty: 'animal',
      },
    },
  ];
  const core: JsonFormsCore = coreReducer(
    undefined,
    init(data, schema, undefined, {
      additionalErrors,
      validationMode: 'NoValidation',
    })
  );
  t.is(core.errors.length, 0);
  t.is(core.additionalErrors.length, 1);
  const errorsAt = errorAt('animal', schema)(core);
  t.is(errorsAt.length, 1);
  t.is(errorsAt.indexOf(additionalErrors[0]), 0);
});

test('errorAt contains additionalErrors for validation mode ValidateAndHide ', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 100,
  };

  const additionalErrors = [
    {
      instancePath: '',
      dataPath: '',
      schemaPath: '#/required',
      keyword: 'required',
      params: {
        missingProperty: 'animal',
      },
    },
  ];
  const core: JsonFormsCore = coreReducer(
    undefined,
    init(data, schema, undefined, {
      additionalErrors,
      validationMode: 'ValidateAndHide',
    })
  );
  t.is(core.errors.length, 1);
  t.is(core.additionalErrors.length, 1);
  const errorsAt = errorAt('animal', schema)(core);
  t.is(errorsAt.length, 1);
  t.is(errorsAt.indexOf(additionalErrors[0]), 0);
});

test('core reducer - setValidationMode - No validation should not produce errors', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 100,
  };

  const core: JsonFormsCore = coreReducer(
    undefined,
    init(data, schema, undefined, { validationMode: 'NoValidation' })
  );
  t.is(core.errors.length, 0);
  t.is(core.validationMode, 'NoValidation');
});

test('core reducer - setValidationMode - No validation should remove errors', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 100,
  };

  const before: JsonFormsCore = coreReducer(undefined, init(data, schema));
  t.is(before.errors.length, 1);

  const after = coreReducer(before, setValidationMode('NoValidation'));
  t.is(after.errors.length, 0);
  t.is(after.validationMode, 'NoValidation');
});

test('core reducer - init - ValidateAndShow should be default validationMode', (t) => {
  const data = {
    animal: 100,
  };

  const core: JsonFormsCore = coreReducer(undefined, init(data));
  t.is(core.validationMode, 'ValidateAndShow');
});

test('core reducer - init - Validation should produce errors', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 100,
  };

  const coreShow: JsonFormsCore = coreReducer(
    undefined,
    init(data, schema, undefined, { validationMode: 'ValidateAndShow' })
  );
  t.is(coreShow.errors.length, 1);
  t.is(coreShow.validationMode, 'ValidateAndShow');

  const coreHide: JsonFormsCore = coreReducer(
    undefined,
    init(data, schema, undefined, { validationMode: 'ValidateAndHide' })
  );
  t.is(coreHide.errors.length, 1);
  t.is(coreHide.validationMode, 'ValidateAndHide');
});

test('core reducer - setValidationMode - Validation should produce errors', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 100,
  };

  const before: JsonFormsCore = coreReducer(
    undefined,
    init(data, schema, undefined, { validationMode: 'NoValidation' })
  );
  t.is(before.errors.length, 0);

  const coreShow: JsonFormsCore = coreReducer(
    before,
    setValidationMode('ValidateAndShow')
  );
  t.is(coreShow.errors.length, 1);

  const coreHide: JsonFormsCore = coreReducer(
    before,
    setValidationMode('ValidateAndHide')
  );
  t.is(coreHide.errors.length, 1);
});

test('core reducer - setValidationMode - Hide validation should preserve errors', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 100,
  };

  const before: JsonFormsCore = coreReducer(undefined, init(data, schema));
  t.is(before.errors.length, 1);

  const after: JsonFormsCore = coreReducer(
    before,
    setValidationMode('ValidateAndHide')
  );
  t.is(after.errors.length, 1);
});

test('core reducer - update - NoValidation should not produce errors', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 'dog',
  };

  const before: JsonFormsCore = coreReducer(
    undefined,
    init(data, schema, undefined, { validationMode: 'NoValidation' })
  );
  t.is(before.errors.length, 0);

  const after: JsonFormsCore = coreReducer(
    before,
    update('animal', () => 100)
  );
  t.is(after.errors.length, 0);
});

test('core reducer - update - ValidateAndHide should produce errors', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 'dog',
  };

  const before: JsonFormsCore = coreReducer(
    undefined,
    init(data, schema, undefined, { validationMode: 'ValidateAndHide' })
  );
  t.is(before.errors.length, 0);

  const after: JsonFormsCore = coreReducer(
    before,
    update('animal', () => 100)
  );
  t.is(after.errors.length, 1);
});

test('core reducer - update core - state should be unchanged when nothing changes', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 'dog',
  };
  const before: JsonFormsCore = coreReducer(undefined, init(data, schema));

  const after: JsonFormsCore = coreReducer(
    before,
    updateCore(before.data, before.schema, before.uischema, before.ajv)
  );
  t.true(before === after);
});

test('core reducer - update core - unchanged state properties should be unchanged when state changes', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 'dog',
  };
  const before: JsonFormsCore = coreReducer(undefined, init(data, schema));

  const afterDataUpdate: JsonFormsCore = coreReducer(
    before,
    updateCore(
      {
        animal: 'cat',
      },
      before.schema,
      before.uischema,
      { ajv: before.ajv, additionalErrors: before.additionalErrors }
    )
  );
  t.true(before.schema === afterDataUpdate.schema);
  t.true(before.ajv === afterDataUpdate.ajv);
  t.true(before.errors === afterDataUpdate.errors);
  t.true(before.uischema === afterDataUpdate.uischema);
  t.true(before.validationMode === afterDataUpdate.validationMode);
  t.true(before.validator === afterDataUpdate.validator);
  t.true(before.additionalErrors === afterDataUpdate.additionalErrors);

  const updatedSchema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
      id: {
        type: 'number',
      },
    },
  };
  // check that data stays unchanged as well
  const afterSchemaUpdate: JsonFormsCore = coreReducer(
    before,
    updateCore(before.data, updatedSchema, before.uischema, before.ajv)
  );
  t.true(before.data === afterSchemaUpdate.data);
});

test('core reducer - update core - additionalErrors should update', (t) => {
  const schema = {
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };

  const data = {
    animal: 'dog',
  };
  const before: JsonFormsCore = coreReducer(
    undefined,
    init(data, schema, undefined, { additionalErrors: [] })
  );

  const additionalErrors = [
    {
      instancePath: '',
      dataPath: '',
      schemaPath: '#/required',
      keyword: 'required',
      params: {
        missingProperty: 'animal',
      },
    },
  ];
  const after: JsonFormsCore = coreReducer(
    before,
    updateCore(before.data, before.schema, before.uischema, {
      additionalErrors,
    })
  );
  t.true(after.additionalErrors === additionalErrors);
});

test('core reducer - setSchema - schema with id', (t) => {
  const schema: JsonSchema = {
    $id: 'https://www.jsonforms.io/example.json',
    type: 'object',
    properties: {
      animal: {
        type: 'string',
      },
    },
  };
  const updatedSchema = cloneDeep(schema);
  updatedSchema.properties.animal.minLength = 5;

  const before: JsonFormsCore = coreReducer(
    undefined,
    init(undefined, schema, undefined, undefined)
  );

  const after: JsonFormsCore = coreReducer(before, setSchema(updatedSchema));
  t.is(after.schema.properties.animal.minLength, 5);
});

test('core reducer helpers - getControlPath - converts JSON Pointer notation to dot notation', (t) => {
  const errorObject = { instancePath: '/group/name' } as ErrorObject;
  const controlPath = getControlPath(errorObject);
  t.is(controlPath, 'group.name');
});

test('core reducer helpers - getControlPath - fallback to AJV <=7 errors', (t) => {
  const errorObject = { dataPath: '/group/name' } as unknown as ErrorObject;
  const controlPath = getControlPath(errorObject);
  t.is(controlPath, 'group.name');
});

test('core reducer helpers - getControlPath - fallback to AJV <=7 errors does not crash for empty paths', (t) => {
  const errorObject = { dataPath: '' } as unknown as ErrorObject;
  const controlPath = getControlPath(errorObject);
  t.is(controlPath, '');
});

test('core reducer helpers - getControlPath - decodes JSON Pointer escape sequences', (t) => {
  const errorObject = { instancePath: '/~0group/~1name' } as ErrorObject;
  const controlPath = getControlPath(errorObject);
  t.is(controlPath, '~group./name');
});
