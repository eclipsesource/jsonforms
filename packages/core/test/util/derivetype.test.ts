/*
  The MIT License
  
  Copyright (c) 2019 EclipseSource Munich
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

import { JsonSchema } from '../../src/models/jsonSchema';
import { deriveTypes } from '../../src/util/index';

test('derive type with type', (t) => {
  const schema: JsonSchema = {
    type: 'string',
  };
  t.is(deriveTypes(schema).length, 1);
  t.is(deriveTypes(schema)[0], 'string');
});

test('derive type w/o type - properties object', (t) => {
  const schema: JsonSchema = {
    properties: {
      foo: { type: 'string' },
    },
  };
  t.is(deriveTypes(schema).length, 1);
  t.is(deriveTypes(schema)[0], 'object');
});

test('derive type w/o type - additionalProperties object', (t) => {
  const schema: JsonSchema = {
    additionalProperties: {
      type: 'string',
    },
  };
  t.is(deriveTypes(schema).length, 1);
  t.is(deriveTypes(schema)[0], 'object');
});

test('derive type w/o type - items array', (t) => {
  const schema: JsonSchema = {
    items: {
      type: 'string',
    },
  };
  t.is(deriveTypes(schema).length, 1);
  t.is(deriveTypes(schema)[0], 'array');
});

test('derive type w/o type - enum', (t) => {
  const schema: JsonSchema = {
    enum: ['foo', 'bar'],
  };
  t.is(deriveTypes(schema).length, 1);
  t.is(deriveTypes(schema)[0], 'string');
});

test('derive type w/o type - enum with two types', (t) => {
  const schema: JsonSchema = {
    enum: ['foo', 'bar', { properties: { foo: { type: 'string' } } }],
  };
  t.is(deriveTypes(schema).length, 2);
  t.is(deriveTypes(schema)[0], 'string');
  t.is(deriveTypes(schema)[1], 'object');
});

test('derive type with type - union', (t) => {
  const schema: JsonSchema = {
    type: ['string', 'number'],
  };
  t.is(deriveTypes(schema).length, 2);
  t.is(deriveTypes(schema), schema.type as string[]);
});

test('derive type with type - allOf first has type', (t) => {
  const schema: JsonSchema = {
    allOf: [{ type: 'string' }, { enum: ['foo', 'bar'] }],
  };
  t.is(deriveTypes(schema).length, 1);
  t.is(deriveTypes(schema)[0], 'string');
});

test('derive type with type - allOf other has type', (t) => {
  const schema: JsonSchema = {
    allOf: [{ enum: ['foo', 'bar'] }, { type: 'string' }],
  };
  t.is(deriveTypes(schema).length, 1);
  t.is(deriveTypes(schema)[0], 'string');
});

test('derive type w/o type - allOf other has type', (t) => {
  const schema: JsonSchema = {
    allOf: [
      { properties: { foo: { type: 'string' } } },
      { properties: { bar: { type: 'string' } } },
    ],
  };
  t.is(deriveTypes(schema).length, 1);
  t.is(deriveTypes(schema)[0], 'object');
});
