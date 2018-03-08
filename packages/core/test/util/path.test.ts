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
import { JsonSchema } from '../../src';
import { Resolve, toDataPath } from '../../src/util';

test('resolve ', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    t.deepEqual(
        Resolve.schema(schema, '#/properties/foo'),
        {
            type: 'integer'
        }
    );
});

test('toDataPath ', t => {
    t.is(toDataPath('#/properties/foo/properties/bar'), 'foo.bar');
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
test('resolve instance', t => {
    const instance = {foo: 123};
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
    const result = Resolve.data(instance, toDataPath('#/properties/foo/properties/bar'));
    t.is(result, 123);
});
test('resolve uninitiated instance', t => {
    const instance = {};
    const result = Resolve.data(instance, toDataPath('#/properties/foo/properties/bar'));
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
    const result = Resolve.schema(schema, '#/properties/foos/items');
    t.deepEqual(result, {type: 'string'});
});
test.failing('resolve $ref simple', t => {
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
    const result = Resolve.schema(schema, '#/properties/foos/items');
    t.deepEqual(result, {
      type: 'object',
      properties: {
        bar: {
          type: 'array',
          items: {
            $ref: '#'
          }
        }
      }
    });
    t.not((schema.definitions.foo.properties.bar.items as JsonSchema).$ref, '#');
});
test.failing('resolve $ref complicated', t => {
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
    const result = Resolve.schema(schema, '#/properties/foos/items');
    t.deepEqual(result, {
      definitions: {
        foo2: {
          type: 'object',
          properties: {
            bar: {
              type: 'array',
              items: {
                $ref: '#'
              }
            }
          }
        }
      },
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
