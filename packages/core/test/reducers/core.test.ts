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
import { errorAt, JsonFormsCore, subErrorsAt } from '../../src/reducers/core';
import cloneDeep = require('lodash/cloneDeep');

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

test('errorAt filters by path', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar'
      }
    }
  };
  const state: JsonFormsCore = {
    data: undefined,
    schema: undefined,
    uischema: undefined,
    errors: [
      {
        keyword: '',
        dataPath: 'bar',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: cloneDeep(schema.properties.foo)
      },
      {
        keyword: '',
        dataPath: 'foo',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: cloneDeep(schema.properties.foo)
      },
      {
        keyword: '',
        dataPath: 'foo.bar',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: cloneDeep(schema.properties.foo)
      },
    ]
  };
  const filtered = errorAt('foo', schema.properties.foo)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('errorAt filters by schema', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar'
      }
    }
  };
  const state: JsonFormsCore = {
    data: undefined,
    schema: undefined,
    uischema: undefined,
    errors: [
      {
        keyword: '',
        dataPath: 'bar',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: cloneDeep(schema.properties.foo)
      },
      {
        keyword: '',
        dataPath: 'foo',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: cloneDeep(schema.properties.foo)
      },
      {
        keyword: '',
        dataPath: 'foo',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: {type: 'string', enum: ['bar']}
      },
    ]
  };
  const filtered = errorAt('foo', schema.properties.foo)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[1]);
});

test('subErrorsAt filters by path', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar'
      }
    }
  };
  const state: JsonFormsCore = {
    data: undefined,
    schema: undefined,
    uischema: undefined,
    errors: [
      {
        keyword: '',
        dataPath: 'bar',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: cloneDeep(schema.properties.foo)
      },
      {
        keyword: '',
        dataPath: 'foo',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: cloneDeep(schema.properties.foo)
      },
      {
        keyword: '',
        dataPath: 'foo.bar',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: cloneDeep(schema.properties.foo)
      },
    ]
  };
  const filtered = subErrorsAt('foo', schema.properties.foo)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[2]);
});

test('subErrorsAt filters by schema', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        const: 'bar'
      }
    }
  };
  const state: JsonFormsCore = {
    data: undefined,
    schema: undefined,
    uischema: undefined,
    errors: [
      {
        keyword: '',
        dataPath: 'foo',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: cloneDeep(schema.properties.foo)
      },
      {
        keyword: '',
        dataPath: 'foo.bar',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: {type: 'string', enum: ['bar']}
      },
      {
        keyword: '',
        dataPath: 'foo.bar',
        schemaPath: '',
        message: '',
        params: {},
        schema: undefined,
        parentSchema: cloneDeep(schema.properties.foo)
      },
    ]
  };
  const filtered = subErrorsAt('foo', schema.properties.foo)(state);
  t.is(filtered.length, 1);
  t.deepEqual(filtered[0], state.errors[2]);
});
