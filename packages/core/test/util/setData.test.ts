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
import type { JsonSchema } from '../../src';
import { setDataAt, unsetDataAt } from '../../src/util/setData';

test('setDataAt - empty path replaces the root', (t) => {
  t.deepEqual(setDataAt({ a: 1 }, '', { b: 2 }), { b: 2 });
});

test('unsetDataAt - empty path returns the data unchanged', (t) => {
  const data = { a: 1 };
  t.is(unsetDataAt(data, ''), data);
});

test('setDataAt - numeric key creates an object when the schema declares one', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      parent: {
        type: 'object',
        properties: {
          '15': { type: 'string' },
        },
      },
    },
  };
  t.deepEqual(setDataAt({}, 'parent.15', 'v', schema), {
    parent: { '15': 'v' },
  });
});

test('setDataAt - numeric follow-up segment creates an array when no schema information is available', (t) => {
  // mirrors the behavior of lodash's set for backward compatibility
  t.deepEqual(setDataAt({}, 'a.0.b', 'v'), { a: [{ b: 'v' }] });
  t.deepEqual(setDataAt({}, 'a.0.b', 'v', {}), { a: [{ b: 'v' }] });
});

test('setDataAt - non-canonical numeric segments do not create arrays', (t) => {
  t.deepEqual(setDataAt({}, 'a.05.b', 'v'), { a: { '05': { b: 'v' } } });
  t.deepEqual(setDataAt({}, 'a.1e3.b', 'v'), { a: { '1e3': { b: 'v' } } });
});

test('setDataAt - schema type information takes precedence over the numeric segment heuristic', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      parent: {
        type: 'object',
        properties: {
          '0': {
            type: 'object',
            properties: { b: { type: 'string' } },
          },
        },
      },
    },
  };
  t.deepEqual(setDataAt({}, 'parent.0.b', 'v', schema), {
    parent: { '0': { b: 'v' } },
  });
});

test('setDataAt - creates a schema-declared array behind a $ref', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      list: { $ref: '#/definitions/list' },
    },
    definitions: {
      list: {
        type: 'array',
        items: {
          type: 'object',
          properties: { name: { type: 'string' } },
        },
      },
    },
  };
  t.deepEqual(setDataAt({}, 'list.0.name', 'Alice', schema), {
    list: [{ name: 'Alice' }],
  });
});

test('setDataAt - "__proto__" is stored as an own property without touching the prototype', (t) => {
  const result = setDataAt({}, '__proto__', 'value');
  t.true(Object.prototype.hasOwnProperty.call(result, '__proto__'));
  t.is(result['__proto__'], 'value');
  t.is(Object.getPrototypeOf(result), Object.prototype);
});

test('setDataAt - nested "__proto__" path does not pollute Object.prototype', (t) => {
  const result = setDataAt({}, '__proto__.polluted', true);
  t.true(Object.prototype.hasOwnProperty.call(result, '__proto__'));
  t.deepEqual(result['__proto__'], { polluted: true });
  t.is(Object.getPrototypeOf(result), Object.prototype);
  t.is(({} as any).polluted, undefined);
  t.false('polluted' in {});
});

test('setDataAt - "constructor" and "prototype" are treated as plain property names', (t) => {
  const result = setDataAt({}, 'constructor.x', 1);
  t.deepEqual(result, { constructor: { x: 1 } });
  t.is(typeof ({} as any).constructor, 'function');
  const result2 = setDataAt({}, 'prototype.y', 2);
  t.deepEqual(result2, { prototype: { y: 2 } });
});

test('setDataAt - non-object root data is replaced by an object', (t) => {
  t.deepEqual(setDataAt(null, 'a', 1), { a: 1 });
  t.deepEqual(setDataAt('hello', 'a', 1), { a: 1 });
  t.deepEqual(setDataAt(42, 'a', 1), { a: 1 });
});

test('unsetDataAt - removing an array element leaves a hole and keeps the length', (t) => {
  const result = unsetDataAt({ a: [1, 2, 3] }, 'a.1');
  t.is(result.a.length, 3);
  t.false(Object.prototype.hasOwnProperty.call(result.a, '1'));
  t.is(result.a[0], 1);
  t.is(result.a[2], 3);
});

test('unsetDataAt - removes a property inside an array item and keeps the array intact', (t) => {
  const result = unsetDataAt(
    { items: [{ name: 'a' }, { name: 'b' }] },
    'items.1.name'
  );
  t.true(Array.isArray(result.items));
  t.deepEqual(result, { items: [{ name: 'a' }, {}] });
});

test('unsetDataAt - returns the same reference when there is nothing to unset', (t) => {
  const data = { a: { b: 1 }, list: [1, 2] };
  t.is(unsetDataAt(data, 'x.y'), data);
  t.is(unsetDataAt(data, 'a.c'), data);
  t.is(unsetDataAt(data, 'list.5'), data);
});

test('unsetDataAt - non-index segments on arrays are ignored', (t) => {
  const data = { list: [1, 2] };
  t.is(unsetDataAt(data, 'list.length'), data);
  t.is(unsetDataAt(data, 'list.foo'), data);
});

test('unsetDataAt - removes own "__proto__" properties without touching the prototype', (t) => {
  const data = JSON.parse('{"__proto__": {"x": 1}, "keep": true}');
  const result = unsetDataAt(data, '__proto__.x');
  t.deepEqual(result['__proto__'], {});
  t.true(result.keep);
  t.is(Object.getPrototypeOf(result), Object.prototype);
  // without an own "__proto__" property nothing is unset
  const plain = { keep: true };
  t.is(unsetDataAt(plain, '__proto__.x'), plain);
});
