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
import { JsonSchema } from '../../src';
import { Resolve, toDataPath } from '../../src/util';

test('resolve ', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'integer'
      }
    }
  };
  t.deepEqual(Resolve.schema(schema, '#/properties/foo', schema), {
    type: 'integer'
  });
});

test('toDataPath ', t => {
  t.is(toDataPath('#/properties/foo/properties/bar'), 'foo.bar');
});
test('toDataPath replace anyOf', t => {
  t.is(toDataPath('/anyOf/1/properties/foo/anyOf/1/properties/bar'), 'foo.bar');
});
test('toDataPath replace anyOf in combination with conditional schema compositions', t => {
  t.is(toDataPath('/anyOf/1/then/properties/foo'), 'foo');
});
test('toDataPath replace multiple directly nested anyOf in combination with conditional schema compositions', t => {
  t.is(toDataPath('/anyOf/1/then/anyOf/0/then/properties/foo'), 'foo');
});
test('toDataPath replace multiple nested properties with anyOf in combination with conditional schema compositions', t => {
  t.is(toDataPath('/anyOf/1/properties/foo/anyOf/0/then/properties/bar'), 'foo.bar');
});
test('toDataPath replace allOf', t => {
  t.is(toDataPath('/allOf/1/properties/foo/allOf/1/properties/bar'), 'foo.bar');
});
test('toDataPath replace allOf in combination with conditional schema compositions', t => {
  t.is(toDataPath('/allOf/1/then/properties/foo'), 'foo');
});
test('toDataPath replace multiple directly nested allOf in combination with conditional schema compositions', t => {
  t.is(toDataPath('/allOf/1/then/allOf/0/then/properties/foo'), 'foo');
});
test('toDataPath replace multiple nested properties with allOf in combination with conditional schema compositions', t => {
  t.is(toDataPath('/allOf/1/properties/foo/allOf/0/then/properties/bar'), 'foo.bar');
});
test('toDataPath replace oneOf', t => {
  t.is(toDataPath('/oneOf/1/properties/foo/oneOf/1/properties/bar'), 'foo.bar');
});
test('toDataPath replace oneOf in combination with conditional schema compositions', t => {
  t.is(toDataPath('/oneOf/1/then/properties/foo'), 'foo');
});
test('toDataPath replace multiple directly nested oneOf in combination with conditional schema compositions', t => {
  t.is(toDataPath('/oneOf/1/then/oneOf/0/then/properties/foo'), 'foo');
});
test('toDataPath replace multiple nested properties with oneOf in combination with conditional schema compositions', t => {
  t.is(toDataPath('/oneOf/1/properties/foo/oneOf/0/then/properties/bar'), 'foo.bar');
});
test('toDataPath replace all combinators', t => {
  t.is(
    toDataPath(
      '/oneOf/1/properties/foo/anyOf/1/properties/bar/allOf/1/properties/foobar'
    ),
    'foo.bar.foobar'
  );
});
test('toDataPath use of keywords', t => {
  t.is(toDataPath('#/properties/properties'), 'properties');
});
test('toDataPath use of encoded paths', t => {
  const fooBar = encodeURIComponent('foo.bar');
  t.is(toDataPath(`#/properties/${fooBar}`), `${fooBar}`);
});
test('toDataPath relative with /', t => {
  t.is(toDataPath('/properties/foo/properties/bar'), 'foo.bar');
});
test('toDataPath use of keywords relative with /', t => {
  t.is(toDataPath('/properties/properties'), 'properties');
});
test('toDataPath use of encoded paths relative with /', t => {
  const fooBar = encodeURIComponent('foo/bar');
  t.is(toDataPath(`/properties/${fooBar}`), `${fooBar}`);
});
test('toDataPath relative without /', t => {
  t.is(toDataPath('properties/foo/properties/bar'), 'foo.bar');
});
test('toDataPath use of keywords relative without /', t => {
  t.is(toDataPath('properties/properties'), 'properties');
});
test('toDataPath use of encoded paths relative without /', t => {
  const fooBar = encodeURIComponent('foo/bar');
  t.is(toDataPath(`properties/${fooBar}`), `${fooBar}`);
});
test('toDataPath use of encoded special character in pathname', t => {
  t.is(toDataPath('properties/foo~0bar~1baz'), 'foo~bar/baz');
});
test('resolve instance', t => {
  const instance = { foo: 123 };
  const result = Resolve.data(instance, toDataPath('#/properties/foo'));
  t.is(result, 123);
});
test('resolve instance with keywords', t => {
  const instance = { properties: 123 };
  const result = Resolve.data(instance, toDataPath('#/properties/properties'));
  t.is(result, 123);
});
test('resolve instance with encoded', t => {
  const instance = { 'foo/bar': 123 };
  const fooBar = encodeURIComponent('foo/bar');
  const result = Resolve.data(instance, toDataPath(`#/properties/${fooBar}`));
  t.is(result, 123);
});
test('resolve nested instance', t => {
  const instance = { foo: { bar: 123 } };
  const result = Resolve.data(
    instance,
    toDataPath('#/properties/foo/properties/bar')
  );
  t.is(result, 123);
});
test('resolve uninitiated instance', t => {
  const instance = {};
  const result = Resolve.data(
    instance,
    toDataPath('#/properties/foo/properties/bar')
  );
  t.is(result, undefined);
});
test('resolve $ref', t => {
  const schema: JsonSchema = {
    definitions: {
      foo: {
        type: 'string'
      }
    },
    type: 'object',
    properties: {
      foos: {
        type: 'array',
        items: {
          $ref: '#/definitions/foo'
        }
      }
    }
  };
  const result = Resolve.schema(schema, '#/properties/foos/items', schema);
  t.deepEqual(result, { type: 'string' });
});
test('resolve $ref simple', t => {
  const schema: JsonSchema = {
    definitions: {
      foo: {
        type: 'object',
        properties: {
          bar: {
            type: 'array',
            items: {
              $ref: '#/definitions/foo'
            }
          }
        }
      }
    },
    type: 'object',
    properties: {
      foos: {
        type: 'array',
        items: {
          $ref: '#/definitions/foo'
        }
      }
    }
  };
  const result = Resolve.schema(schema, '#/properties/foos/items', schema);
  t.deepEqual(result, {
    type: 'object',
    properties: {
      bar: {
        type: 'array',
        items: {
          $ref: '#/definitions/foo'
        }
      }
    }
  });
  t.not((schema.definitions.foo.properties.bar.items as JsonSchema).$ref, '#');
});
test('resolve $ref complicated', t => {
  const schema: JsonSchema = {
    definitions: {
      foo: {
        type: 'object',
        properties: {
          bar: {
            type: 'array',
            items: {
              $ref: '#/definitions/foo2'
            }
          }
        }
      },
      foo2: {
        type: 'object',
        properties: {
          bar: {
            type: 'array',
            items: {
              $ref: '#/definitions/foo'
            }
          }
        }
      }
    },
    type: 'object',
    properties: {
      foos: {
        type: 'array',
        items: {
          $ref: '#/definitions/foo'
        }
      }
    }
  };
  const result = Resolve.schema(schema, '#/properties/foos/items', schema);
  t.deepEqual(result, {
    type: 'object',
    properties: {
      bar: {
        type: 'array',
        items: {
          $ref: '#/definitions/foo2'
        }
      }
    }
  });
});
