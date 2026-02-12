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

test('core reducer - FILL_VALUE rule updates the data state when the condition is met', (t) => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      type: { type: 'string', enum: ['person', 'organization'] },
      contactName: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name',
      },
      {
        type: 'Control',
        scope: '#/properties/type',
      },
      {
        type: 'Control',
        scope: '#/properties/contactName',
        rule: {
          effect: 'FILL_VALUE',
          condition: {
            scope: '#',
            schema: {
              type: 'object',
              properties: {
                type: {
                  const: 'organization',
                },
              },
              required: ['type'],
            },
          },
          options: {
            value: 'Contact Person',
          },
        },
      },
    ],
  };

  // Initial data with type not matching condition
  const initialData = {
    name: 'John Doe',
    type: 'person',
    contactName: '',
  };

  // Create initial state
  const initialState = coreReducer(
    undefined,
    init(initialData, schema, uischema)
  );

  // Verify initial state is unchanged (condition not met)
  t.is(
    initialState.data.contactName,
    '',
    'Contact name should be empty initially'
  );

  // Update only the type field to trigger the FILL_VALUE effect
  const updatedState = coreReducer(
    initialState,
    updateCore(
      {
        ...initialState.data,
        type: 'organization',
      },
      initialState.schema,
      initialState.uischema
    )
  );

  // Expected data after update
  const expectedData = {
    ...initialState.data,
    type: 'organization',
    contactName: 'Contact Person',
  };

  // Verify the entire state was updated correctly
  t.deepEqual(
    updatedState.data,
    expectedData,
    'Data should be updated with contactName filled when type is organization'
  );
});

test('core reducer - CLEAR_VALUE rule clears the data state when the condition is met', (t) => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      type: { type: 'string', enum: ['person', 'organization'] },
      personalInfo: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name',
      },
      {
        type: 'Control',
        scope: '#/properties/type',
      },
      {
        type: 'Control',
        scope: '#/properties/personalInfo',
        rule: {
          effect: 'CLEAR_VALUE',
          condition: {
            scope: '#',
            schema: {
              type: 'object',
              properties: {
                type: {
                  const: 'organization',
                },
              },
              required: ['type'],
            },
          },
        },
      },
    ],
  };

  // Initial data with personal info and type not triggering the condition
  const initialData = {
    name: 'John Doe',
    type: 'person',
    personalInfo: 'Some personal details',
  };

  // Create initial state
  const initialState = coreReducer(
    undefined,
    init(initialData, schema, uischema)
  );

  // Verify initial state has personal info
  t.is(
    initialState.data.personalInfo,
    'Some personal details',
    'Personal info should be present initially'
  );

  // Update only the type field to trigger the CLEAR_VALUE effect
  const updatedState = coreReducer(
    initialState,
    updateCore(
      {
        ...initialState.data,
        type: 'organization',
      },
      initialState.schema,
      initialState.uischema
    )
  );

  // Expected data after update
  const expectedData = {
    ...initialState.data,
    type: 'organization',
    personalInfo: undefined,
  };

  // Verify the entire state was updated correctly
  t.deepEqual(
    updatedState.data,
    expectedData,
    'Personal info should be cleared when type is organization'
  );
});

test('SHOW rule with preserveValueOnHide should preserve field values when hidden', (t) => {
  // Create a schema with minimal fields to test functionality
  const schema = {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['person', 'organization'] },
      firstName: { type: 'string' },
      companyName: { type: 'string' },
    },
  };

  // Create a UI schema with SHOW rules and preserveValueOnHide setting
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/type',
      },
      {
        type: 'Control',
        scope: '#/properties/firstName',
        rule: {
          effect: 'SHOW',
          condition: {
            scope: '#',
            schema: {
              type: 'object',
              properties: {
                type: {
                  const: 'person',
                },
              },
              required: ['type'],
            },
          },
          options: {
            preserveValueOnHide: true,
          },
        },
      },
      {
        type: 'Control',
        scope: '#/properties/companyName',
      },
    ],
  };

  // Initial data with type 'person' and firstName filled out
  const initialData = {
    type: 'person',
    firstName: 'John',
  };

  // Create initial state
  const initialState = coreReducer(
    undefined,
    init(initialData, schema, uischema)
  );

  // Switch type to 'organization' which should hide firstName but preserve its value
  const updatedState = coreReducer(
    initialState,
    updateCore(
      {
        ...initialData,
        type: 'organization',
      },
      initialState.schema,
      initialState.uischema
    )
  );

  // Verify firstName is preserved even when hidden
  t.is(
    updatedState.data.firstName,
    initialData.firstName,
    'firstName should be preserved when hidden'
  );
});

test('SHOW rule without preserveValueOnHide should clear field values when hidden', (t) => {
  // Create a schema with minimal fields to test functionality
  const schema = {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['person', 'organization'] },
      firstName: { type: 'string' },
      companyName: { type: 'string' },
    },
  };

  // Create a UI schema with SHOW rules without preserveValueOnHide
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/type',
      },
      {
        type: 'Control',
        scope: '#/properties/firstName',
      },
      {
        type: 'Control',
        scope: '#/properties/companyName',
        rule: {
          effect: 'SHOW',
          condition: {
            scope: '#',
            schema: {
              type: 'object',
              properties: {
                type: {
                  const: 'organization',
                },
              },
              required: ['type'],
            },
          },
          // No preserveValueOnHide option - should clear when hidden
        },
      },
    ],
  };

  // Initial data with type 'organization' and companyName filled out
  const initialData = {
    type: 'organization',
    companyName: 'Acme Corp',
  };

  // Create initial state
  const initialState = coreReducer(
    undefined,
    init(initialData, schema, uischema)
  );

  // Switch type to 'person' which should hide companyName and clear its value
  const updatedState = coreReducer(
    initialState,
    updateCore(
      {
        ...initialData,
        type: 'person',
      },
      initialState.schema,
      initialState.uischema
    )
  );

  // Verify companyName was cleared when hidden
  t.is(
    updatedState.data.companyName,
    undefined,
    'companyName should be cleared when hidden'
  );
});

test('HIDE rule with preserveValueOnHide should preserve field values when hidden', (t) => {
  // Create a schema with minimal fields to test functionality
  const schema = {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['simple', 'detailed'] },
      name: { type: 'string' },
      address: { type: 'string' },
    },
  };

  // Create a UI schema with HIDE rules and preserveValueOnHide setting
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/type',
      },
      {
        type: 'Control',
        scope: '#/properties/name',
        rule: {
          effect: 'HIDE',
          condition: {
            scope: '#',
            schema: {
              type: 'object',
              properties: {
                type: {
                  const: 'detailed',
                },
              },
              required: ['type'],
            },
          },
          options: {
            preserveValueOnHide: true,
          },
        },
      },
      {
        type: 'Control',
        scope: '#/properties/address',
      },
    ],
  };

  // Initial data with type 'simple' and name filled out
  const initialData = {
    type: 'simple',
    name: 'John Smith',
  };

  // Create initial state
  const initialState = coreReducer(
    undefined,
    init(initialData, schema, uischema)
  );

  // Switch type to 'detailed' which should hide name but preserve its value
  const updatedState = coreReducer(
    initialState,
    updateCore(
      {
        ...initialData,
        type: 'detailed',
      },
      initialState.schema,
      initialState.uischema
    )
  );

  // Verify name is preserved even when hidden
  t.is(
    updatedState.data.name,
    initialData.name,
    'name should be preserved when hidden by HIDE rule'
  );
});

test('HIDE rule without preserveValueOnHide should clear field values when hidden', (t) => {
  // Create a schema with minimal fields to test functionality
  const schema = {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['simple', 'detailed'] },
      name: { type: 'string' },
      address: { type: 'string' },
    },
  };

  // Create a UI schema with HIDE rules without preserveValueOnHide
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/type',
      },
      {
        type: 'Control',
        scope: '#/properties/name',
      },
      {
        type: 'Control',
        scope: '#/properties/address',
        rule: {
          effect: 'HIDE',
          condition: {
            scope: '#',
            schema: {
              type: 'object',
              properties: {
                type: {
                  const: 'simple',
                },
              },
              required: ['type'],
            },
          },
          // No preserveValueOnHide option - should clear when hidden
        },
      },
    ],
  };

  // Initial data with type 'detailed' and address filled out
  const initialData = {
    type: 'detailed',
    address: '123 Main St',
  };

  // Create initial state
  const initialState = coreReducer(
    undefined,
    init(initialData, schema, uischema)
  );

  // Switch type to 'simple' which should hide address and clear its value
  const updatedState = coreReducer(
    initialState,
    updateCore(
      {
        ...initialData,
        type: 'simple',
      },
      initialState.schema,
      initialState.uischema
    )
  );

  // Verify address was cleared when hidden
  t.is(
    updatedState.data.address,
    undefined,
    'address should be cleared when hidden by HIDE rule'
  );
});

test('Default values should be cleared when fields are hidden by HIDE rule with AJV useDefaults', (t) => {
  // Create a schema with fields that have default values
  const schema = {
    type: 'object',
    properties: {
      checkbox: { type: 'boolean', default: false },
      shortText: { type: 'string', default: 'wat' },
      checkbox2: { type: 'boolean', default: false },
    },
  };

  // Create a UI schema with HIDE rule for shortText when checkbox is true
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/checkbox',
        label: 'Checkbox',
      },
      {
        type: 'Control',
        scope: '#/properties/shortText',
        label: 'Short Text',
        rule: {
          effect: 'HIDE',
          condition: {
            scope: '#',
            schema: {
              allOf: [
                {
                  type: 'object',
                  required: ['checkbox'],
                  properties: {
                    checkbox: {
                      const: true,
                    },
                  },
                },
              ],
            },
            failWhenUndefined: true,
          },
        },
      },
      {
        type: 'Control',
        scope: '#/properties/checkbox2',
        label: 'Log Data',
      },
    ],
  };

  // Create AJV with useDefaults: true
  const ajv = createAjv({ useDefaults: true });

  // Initial data with checkbox true (which should hide shortText)
  const initialData = {
    checkbox: true,
    checkbox2: true,
  };

  // Create initial state with AJV that has useDefaults: true
  const initialState = coreReducer(
    undefined,
    init(initialData, schema, uischema, { ajv })
  );

  // Verify that the shortText field is cleared when hidden
  t.is(
    initialState.data.shortText,
    undefined,
    'shortText should be cleared when hidden by HIDE rule even with AJV useDefaults'
  );

  // Verify that shortText is not present in the data when it's hidden
  t.is(
    initialState.data.shortText,
    undefined,
    'shortText should not have default value when hidden by HIDE rule, even with AJV useDefaults'
  );

  // Verify other fields are present
  t.is(initialState.data.checkbox, true, 'checkbox should be present');
  t.is(initialState.data.checkbox2, true, 'checkbox2 should be present');
});

test('Default values should be preserved in schema when preserveValueOnHide is true', (t) => {
  // Create a schema with fields that have default values
  const schema = {
    type: 'object',
    properties: {
      checkbox: { type: 'boolean', default: false },
      shortText: { type: 'string', default: 'defaultValue' },
      checkbox2: { type: 'boolean', default: false },
    },
  };

  // Create a UI schema with HIDE rule for shortText when checkbox is true, with preserveValueOnHide
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/checkbox',
        label: 'Checkbox',
      },
      {
        type: 'Control',
        scope: '#/properties/shortText',
        label: 'Short Text',
        rule: {
          effect: 'HIDE',
          condition: {
            scope: '#',
            schema: {
              allOf: [
                {
                  type: 'object',
                  required: ['checkbox'],
                  properties: {
                    checkbox: {
                      const: true,
                    },
                  },
                },
              ],
            },
            failWhenUndefined: true,
          },
          options: {
            preserveValueOnHide: true,
          },
        },
      },
      {
        type: 'Control',
        scope: '#/properties/checkbox2',
        label: 'Log Data',
      },
    ],
  };

  // Initial data with checkbox true (which should hide shortText)
  const initialData = {
    checkbox: true,
    checkbox2: true,
  };

  // Create initial state
  const initialState = coreReducer(
    undefined,
    init(initialData, schema, uischema)
  );

  // Verify that the shortText field value is preserved when hidden (due to preserveValueOnHide)
  t.is(
    initialState.data.shortText,
    undefined, // This will be undefined because no value was set initially
    'shortText should be undefined when no initial value is set'
  );

  // Verify that the default value is preserved in the schema when preserveValueOnHide is true
  t.is(
    initialState.schema.properties?.shortText.default,
    'defaultValue',
    'shortText default should be preserved in schema when preserveValueOnHide is true'
  );
});

test('Default values should be cleared in schema when preserveValueOnHide is false', (t) => {
  // Create a schema with fields that have default values
  const schema = {
    type: 'object',
    properties: {
      checkbox: { type: 'boolean', default: false },
      shortText: { type: 'string', default: 'defaultValue' },
      checkbox2: { type: 'boolean', default: false },
    },
  };

  // Create a UI schema with HIDE rule for shortText when checkbox is true, without preserveValueOnHide
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/checkbox',
        label: 'Checkbox',
      },
      {
        type: 'Control',
        scope: '#/properties/shortText',
        label: 'Short Text',
        rule: {
          effect: 'HIDE',
          condition: {
            scope: '#',
            schema: {
              allOf: [
                {
                  type: 'object',
                  required: ['checkbox'],
                  properties: {
                    checkbox: {
                      const: true,
                    },
                  },
                },
              ],
            },
            failWhenUndefined: true,
          },
          // No preserveValueOnHide option - should clear defaults when hidden
        },
      },
      {
        type: 'Control',
        scope: '#/properties/checkbox2',
        label: 'Log Data',
      },
    ],
  };

  // Initial data with checkbox true (which should hide shortText)
  const initialData = {
    checkbox: true,
    checkbox2: true,
  };

  // Create initial state
  const initialState = coreReducer(
    undefined,
    init(initialData, schema, uischema)
  );

  // Verify that the shortText field value is cleared when hidden (no preserveValueOnHide)
  t.is(
    initialState.data.shortText,
    undefined,
    'shortText should be undefined when hidden without preserveValueOnHide'
  );

  // Verify that the default value is cleared from the schema when preserveValueOnHide is false
  t.is(
    initialState.schema.properties?.shortText.default,
    undefined,
    'shortText default should be cleared from schema when preserveValueOnHide is false'
  );
});

test('core reducer - POPULATE rule populates destination from scalar source when the source changes', (t) => {
  const schema = {
    type: 'object',
    properties: {
      source: { type: 'string' },
      dest: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/dest',
        rule: {
          effect: 'POPULATE',
          condition: {
            scope: '#',
            schema: {
              type: 'object',
              required: ['source'],
            },
          },
          options: {
            populate: {
              from: '#/properties/source',
              overwrite: true,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ source: 'a', dest: '' }, schema, uischema)
  );

  // change source -> should populate dest
  const updatedState = coreReducer(
    initialState,
    updateCore({ ...initialState.data, source: 'b' }, schema, uischema)
  );

  t.is(updatedState.data.dest, 'b');
});

test('core reducer - POPULATE rule no-ops when extracted value is missing', (t) => {
  const schema = {
    type: 'object',
    properties: {
      address: { type: 'object' },
      dest: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/dest' },
      {
        type: 'Control',
        scope: '#/properties/dest',
        rule: {
          effect: 'POPULATE',
          condition: {
            scope: '#',
            schema: {
              type: 'object',
              required: ['address'],
            },
          },
          options: {
            populate: {
              from: '#/properties/address',
              valuePath: 'state',
              overwrite: true,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ address: {}, dest: 'keep' }, schema, uischema)
  );

  // update address (still missing state) -> should keep dest unchanged
  const updatedState = coreReducer(
    initialState,
    updateCore(
      { ...initialState.data, address: { type: 'mailing' } },
      schema,
      uischema
    )
  );

  t.is(updatedState.data.dest, 'keep');
});

test('core reducer - POPULATE rule selects from array via schema and extracts valuePath', (t) => {
  const schema = {
    type: 'object',
    properties: {
      addresses: { type: 'array' },
      mailingState: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/addresses' },
      {
        type: 'Control',
        scope: '#/properties/mailingState',
        rule: {
          effect: 'POPULATE',
          condition: {
            scope: '#',
            schema: {
              type: 'object',
              required: ['addresses'],
            },
          },
          options: {
            populate: {
              from: '#/properties/addresses',
              select: {
                where: {
                  schema: {
                    type: 'object',
                    properties: {
                      type: { const: 'mailing' },
                    },
                    required: ['type'],
                  },
                },
              },
              valuePath: 'state',
              overwrite: true,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init(
      {
        addresses: [{ type: 'home', state: 'CA' }],
        mailingState: '',
      },
      schema,
      uischema
    )
  );

  const updatedState = coreReducer(
    initialState,
    updateCore(
      {
        ...initialState.data,
        addresses: [
          { type: 'home', state: 'CA' },
          { type: 'mailing', state: 'NY' },
        ],
      },
      schema,
      uischema
    )
  );

  t.is(updatedState.data.mailingState, 'NY');
});

test('core reducer - POPULATE rule selects from array via schema (supports pattern/regex)', (t) => {
  const schema = {
    type: 'object',
    properties: {
      addresses: { type: 'array' },
      selectedState: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/addresses' },
      {
        type: 'Control',
        scope: '#/properties/selectedState',
        rule: {
          effect: 'POPULATE',
          condition: {
            scope: '#',
            schema: { type: 'object', required: ['addresses'] },
          },
          options: {
            populate: {
              from: '#/properties/addresses',
              select: {
                where: {
                  schema: {
                    type: 'object',
                    properties: {
                      type: { const: 'mailing' },
                      state: { type: 'string', pattern: '^N(J|Y)$' },
                    },
                    required: ['type', 'state'],
                  },
                },
              },
              valuePath: 'state',
              overwrite: true,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init(
      {
        addresses: [
          { type: 'mailing', state: 'CA' },
          { type: 'home', state: 'NJ' },
        ],
        selectedState: '',
      },
      schema,
      uischema
    )
  );

  const updatedState = coreReducer(
    initialState,
    updateCore(
      {
        ...initialState.data,
        addresses: [
          { type: 'mailing', state: 'CA' },
          { type: 'mailing', state: 'NJ' },
          { type: 'mailing', state: 'NY' },
        ],
      },
      schema,
      uischema
    )
  );

  // first match should win => NJ (matches pattern), not NY
  t.is(updatedState.data.selectedState, 'NJ');
});

test('core reducer - POPULATE rule with overwrite=false does not override existing value', (t) => {
  const schema = {
    type: 'object',
    properties: {
      source: { type: 'string' },
      dest: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/dest',
        rule: {
          effect: 'POPULATE',
          condition: {
            type: 'LEAF',
            scope: '#/properties/source',
            expectedValue: 'b',
          },
          options: {
            populate: {
              from: '#/properties/source',
              overwrite: false,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ source: 'a', dest: 'user' }, schema, uischema)
  );

  const updatedState = coreReducer(
    initialState,
    updateCore({ ...initialState.data, source: 'b' }, schema, uischema)
  );

  t.is(updatedState.data.dest, 'user');
});

test('core reducer - POPULATE rule clears destination when source becomes empty (implied by overwrite=true)', (t) => {
  const schema = {
    type: 'object',
    properties: {
      source: { type: 'string' },
      dest: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/dest',
        rule: {
          effect: 'POPULATE',
          condition: {
            scope: '#',
            schema: { type: 'object' },
          },
          options: {
            populate: {
              from: '#/properties/source',
              overwrite: true,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ source: 'a', dest: 'a' }, schema, uischema)
  );

  const updatedState = coreReducer(
    initialState,
    updateCore({ ...initialState.data, source: '' }, schema, uischema)
  );

  t.is(updatedState.data.dest, undefined);
});

test('core reducer - POPULATE clears even when condition would not be fulfilled for empty source (implied by overwrite=true)', (t) => {
  const schema = {
    type: 'object',
    properties: {
      source: { type: 'string' },
      dest: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/dest',
        rule: {
          effect: 'POPULATE',
          condition: {
            scope: '#',
            schema: {
              type: 'object',
              required: ['source'],
            },
          },
          options: {
            populate: {
              from: '#/properties/source',
              overwrite: true,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ source: 'a', dest: 'a' }, schema, uischema)
  );

  // When source becomes empty, the condition (required: ['source']) would fail.
  // Even though the condition would fail, we still expect the destination to be cleared (overwrite implied).
  const updatedState = coreReducer(
    initialState,
    updateCore({ ...initialState.data, source: '' }, schema, uischema)
  );

  t.is(updatedState.data.dest, undefined);
});

test('core reducer - POPULATE rule clears destination when condition becomes false and overwrite is true', (t) => {
  const schema = {
    type: 'object',
    properties: {
      active: { type: 'boolean' },
      source: { type: 'string' },
      dest: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/active' },
      { type: 'Control', scope: '#/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/dest',
        rule: {
          effect: 'POPULATE',
          condition: {
            type: 'LEAF',
            scope: '#/properties/active',
            expectedValue: true,
          },
          options: {
            populate: {
              from: '#/properties/source',
              overwrite: true,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ active: true, source: 'x', dest: 'x' }, schema, uischema)
  );

  const updatedState = coreReducer(
    initialState,
    updateCore({ ...initialState.data, active: false }, schema, uischema)
  );

  t.is(updatedState.data.dest, undefined);
});

test('core reducer - POPULATE rule does not clear destination when condition becomes false and overwrite is false', (t) => {
  const schema = {
    type: 'object',
    properties: {
      active: { type: 'boolean' },
      source: { type: 'string' },
      dest: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/active' },
      { type: 'Control', scope: '#/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/dest',
        rule: {
          effect: 'POPULATE',
          condition: {
            type: 'LEAF',
            scope: '#/properties/active',
            expectedValue: true,
          },
          options: {
            populate: {
              from: '#/properties/source',
              overwrite: false,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ active: true, source: 'x', dest: 'x' }, schema, uischema)
  );

  const updatedState = coreReducer(
    initialState,
    updateCore({ ...initialState.data, active: false }, schema, uischema)
  );

  t.is(updatedState.data.dest, 'x');
});

test('core reducer - POPULATE with overwrite=false does not clear destination when source becomes empty', (t) => {
  const schema = {
    type: 'object',
    properties: {
      source: { type: 'string' },
      dest: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/dest',
        rule: {
          effect: 'POPULATE',
          condition: {
            scope: '#',
            schema: { type: 'object' },
          },
          options: {
            populate: {
              from: '#/properties/source',
              overwrite: false,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ source: 'a', dest: 'keep' }, schema, uischema)
  );

  const updatedState = coreReducer(
    initialState,
    updateCore({ ...initialState.data, source: '' }, schema, uischema)
  );

  t.is(updatedState.data.dest, 'keep');
});

test('core reducer - POPULATE supports nested destination scope (foo.bar)', (t) => {
  const schema = {
    type: 'object',
    properties: {
      source: { type: 'string' },
      foo: {
        type: 'object',
        properties: {
          bar: { type: 'string' },
        },
      },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/foo/properties/bar',
        rule: {
          effect: 'POPULATE',
          condition: {
            scope: '#',
            schema: { type: 'object' },
          },
          options: {
            populate: {
              from: '#/properties/source',
              overwrite: true,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ source: 'a', foo: { bar: '' } }, schema, uischema)
  );

  const updatedState = coreReducer(
    initialState,
    updateCore({ ...initialState.data, source: 'b' }, schema, uischema)
  );
  t.is(updatedState.data.foo.bar, 'b');

  const clearedState = coreReducer(
    updatedState,
    updateCore({ ...updatedState.data, source: '' }, schema, uischema)
  );
  t.is(clearedState.data.foo.bar, undefined);
});

test('core reducer - POPULATE schema selector supports anyOf', (t) => {
  const schema = {
    type: 'object',
    properties: {
      addresses: { type: 'array' },
      selectedState: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/addresses' },
      {
        type: 'Control',
        scope: '#/properties/selectedState',
        rule: {
          effect: 'POPULATE',
          condition: {
            scope: '#',
            schema: { type: 'object', required: ['addresses'] },
          },
          options: {
            populate: {
              from: '#/properties/addresses',
              select: {
                where: {
                  schema: {
                    anyOf: [
                      {
                        type: 'object',
                        properties: {
                          type: { const: 'mailing' },
                          state: { const: 'NJ' },
                        },
                        required: ['type', 'state'],
                      },
                      {
                        type: 'object',
                        properties: {
                          type: { const: 'home' },
                          state: { const: 'CA' },
                        },
                        required: ['type', 'state'],
                      },
                    ],
                  },
                },
              },
              valuePath: 'state',
              overwrite: true,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init(
      {
        addresses: [
          { type: 'mailing', state: 'CA' },
          { type: 'home', state: 'CA' },
        ],
        selectedState: '',
      },
      schema,
      uischema
    )
  );

  // Should select the first element matching anyOf: home+CA, thus state "CA"
  const updatedState = coreReducer(
    initialState,
    updateCore(
      {
        ...initialState.data,
        addresses: [
          { type: 'home', state: 'CA' },
          { type: 'mailing', state: 'NJ' },
        ],
      },
      schema,
      uischema
    )
  );

  t.is(updatedState.data.selectedState, 'CA');
});

test('core reducer - POPULATE no-ops when selector schema is invalid', (t) => {
  const schema = {
    type: 'object',
    properties: {
      addresses: { type: 'array' },
      selectedState: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/addresses' },
      {
        type: 'Control',
        scope: '#/properties/selectedState',
        rule: {
          effect: 'POPULATE',
          condition: {
            scope: '#',
            schema: { type: 'object', required: ['addresses'] },
          },
          options: {
            populate: {
              from: '#/properties/addresses',
              select: {
                where: {
                  // invalid regex pattern -> AJV throws during validate/compile
                  schema: {
                    type: 'object',
                    properties: {
                      state: { type: 'string', pattern: '[' },
                    },
                    required: ['state'],
                  },
                },
              },
              valuePath: 'state',
              overwrite: true,
            },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init(
      {
        addresses: [{ type: 'mailing', state: 'NJ' }],
        selectedState: 'keep',
      },
      schema,
      uischema
    )
  );

  const updatedState = coreReducer(
    initialState,
    updateCore(
      {
        ...initialState.data,
        addresses: [{ type: 'mailing', state: 'NY' }],
      },
      schema,
      uischema
    )
  );

  // Invalid selector schema => no match => no update
  t.is(updatedState.data.selectedState, 'keep');
});

test('core reducer - POPULATE applies to multiple destinations from the same source', (t) => {
  const schema = {
    type: 'object',
    properties: {
      source: { type: 'string' },
      dest1: { type: 'string' },
      dest2: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/dest1',
        rule: {
          effect: 'POPULATE',
          condition: { scope: '#', schema: { type: 'object' } },
          options: {
            populate: { from: '#/properties/source', overwrite: true },
          },
        },
      },
      {
        type: 'Control',
        scope: '#/properties/dest2',
        rule: {
          effect: 'POPULATE',
          condition: { scope: '#', schema: { type: 'object' } },
          options: {
            populate: { from: '#/properties/source', overwrite: true },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ source: 'a', dest1: '', dest2: '' }, schema, uischema)
  );

  const updatedState = coreReducer(
    initialState,
    updateCore({ ...initialState.data, source: 'b' }, schema, uischema)
  );

  t.is(updatedState.data.dest1, 'b');
  t.is(updatedState.data.dest2, 'b');
});

test('core reducer - POPULATE chained destinations work on updateCore (ordering within one pass)', (t) => {
  const schema = {
    type: 'object',
    properties: {
      source: { type: 'string' },
      dest1: { type: 'string' },
      dest2: { type: 'string' },
    },
  };

  // dest1 populated from source; dest2 populated from dest1
  // This works with updateCore because applyPopulateRules is invoked with changedPath '' (treat as full update),
  // allowing all populate rules to be considered within the same pass.
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/dest1',
        rule: {
          effect: 'POPULATE',
          condition: { scope: '#', schema: { type: 'object' } },
          options: {
            populate: { from: '#/properties/source', overwrite: true },
          },
        },
      },
      {
        type: 'Control',
        scope: '#/properties/dest2',
        rule: {
          effect: 'POPULATE',
          condition: { scope: '#', schema: { type: 'object' } },
          options: {
            populate: { from: '#/properties/dest1', overwrite: true },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ source: 'a', dest1: '', dest2: '' }, schema, uischema)
  );

  const updatedState = coreReducer(
    initialState,
    updateCore({ ...initialState.data, source: 'b' }, schema, uischema)
  );

  t.is(updatedState.data.dest1, 'b');
  t.is(updatedState.data.dest2, 'b');
});

test('core reducer - POPULATE chained destinations do not update on update path', (t) => {
  const schema = {
    type: 'object',
    properties: {
      source: { type: 'string' },
      dest1: { type: 'string' },
      dest2: { type: 'string' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/dest1',
        rule: {
          effect: 'POPULATE',
          condition: { scope: '#', schema: { type: 'object' } },
          options: {
            populate: { from: '#/properties/source', overwrite: true },
          },
        },
      },
      {
        type: 'Control',
        scope: '#/properties/dest2',
        rule: {
          effect: 'POPULATE',
          condition: { scope: '#', schema: { type: 'object' } },
          options: {
            populate: { from: '#/properties/dest1', overwrite: true },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ source: '', dest1: '', dest2: '' }, schema, uischema)
  );

  const updatedState = coreReducer(
    initialState,
    update('source', () => 'b')
  );

  t.is(updatedState.data.dest1, 'b');
  t.is(updatedState.data.dest2, '');
});

test('core reducer - POPULATE applies when condition toggles true (update path)', (t) => {
  const schema = {
    type: 'object',
    properties: {
      source: { type: 'string' },
      dest: { type: 'string' },
      flag: { type: 'boolean' },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/source' },
      { type: 'Control', scope: '#/properties/flag' },
      {
        type: 'Control',
        scope: '#/properties/dest',
        rule: {
          effect: 'POPULATE',
          condition: {
            type: 'LEAF',
            scope: '#/properties/flag',
            expectedValue: true,
          },
          options: {
            populate: { from: '#/properties/source', overwrite: true },
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init({ source: 'a', dest: '', flag: false }, schema, uischema)
  );

  const updatedState = coreReducer(
    initialState,
    update('flag', () => true)
  );

  t.is(updatedState.data.dest, 'a');
});

test('core reducer - POPULATE condition scopes resolve relative to control path', (t) => {
  const schema = {
    type: 'object',
    properties: {
      address: {
        type: 'object',
        properties: {
          country: { type: 'string' },
          source: { type: 'string' },
          state: { type: 'string' },
        },
      },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/address/properties/country' },
      { type: 'Control', scope: '#/properties/address/properties/source' },
      {
        type: 'Control',
        scope: '#/properties/address/properties/state',
        rule: {
          effect: 'POPULATE',
          condition: {
            type: 'LEAF',
            scope: '#/properties/country',
            expectedValue: 'US',
          },
          options: {
            populate: {
              from: '#/properties/address/properties/source',
              overwrite: true,
            },
          },
        },
      },
    ],
  };

  const state = coreReducer(
    undefined,
    init(
      { address: { country: 'US', source: 'NY', state: '' } },
      schema,
      uischema
    )
  );

  t.is(state.data.address.state, 'NY');
});

test('core reducer - POPULATE traverses options.detail for array elements', (t) => {
  const schema = {
    type: 'object',
    properties: {
      addresses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            source: { type: 'string' },
            dest: { type: 'string' },
            flag: { type: 'boolean' },
          },
        },
      },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/addresses',
        options: {
          detail: {
            type: 'VerticalLayout',
            elements: [
              { type: 'Control', scope: '#/properties/source' },
              { type: 'Control', scope: '#/properties/flag' },
              {
                type: 'Control',
                scope: '#/properties/dest',
                rule: {
                  effect: 'POPULATE',
                  condition: {
                    type: 'LEAF',
                    scope: '#/properties/flag',
                    expectedValue: true,
                  },
                  options: {
                    populate: {
                      from: '#/properties/source',
                      overwrite: true,
                    },
                  },
                },
              },
            ],
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init(
      {
        addresses: [{ source: 'a', dest: '', flag: false }],
      },
      schema,
      uischema
    )
  );

  const updatedState = coreReducer(
    initialState,
    update('addresses.0.flag', () => true)
  );

  t.is(updatedState.data.addresses[0].dest, 'a');
});

test('core reducer - POPULATE updates row on source change with dot index path', (t) => {
  const schema = {
    type: 'object',
    properties: {
      addresses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            source: { type: 'string' },
            dest: { type: 'string' },
            flag: { type: 'boolean' },
          },
        },
      },
    },
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/addresses',
        options: {
          detail: {
            type: 'VerticalLayout',
            elements: [
              { type: 'Control', scope: '#/properties/source' },
              { type: 'Control', scope: '#/properties/flag' },
              {
                type: 'Control',
                scope: '#/properties/dest',
                rule: {
                  effect: 'POPULATE',
                  condition: {
                    type: 'LEAF',
                    scope: '#/properties/flag',
                    expectedValue: true,
                  },
                  options: {
                    populate: {
                      from: '#/properties/source',
                      overwrite: true,
                    },
                  },
                },
              },
            ],
          },
        },
      },
    ],
  };

  const initialState = coreReducer(
    undefined,
    init(
      {
        addresses: [{ source: '', dest: '', flag: true }],
      },
      schema,
      uischema
    )
  );

  const updatedState = coreReducer(
    initialState,
    update('addresses.0.source', () => 'test')
  );

  t.is(updatedState.data.addresses[0].dest, 'test');
});
