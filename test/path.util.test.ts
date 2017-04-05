import test from 'ava';

import {resolveSchema, toDataPath, getValuePropertyPair } from '../src/path.util';
import {JsonSchema } from '../src/models/jsonSchema';

test('resolve ', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    t.deepEqual(resolveSchema(schema, '#/properties/foo'), {
        type: 'integer'
    } as JsonSchema);
});
test('toDataPath ', t => {
    t.is(toDataPath('#/properties/foo/properties/bar'), 'foo/bar');
});
test.failing('toDataPath use of keywords', t => {
    t.is(toDataPath('#/properties/properties'), 'properties');
});
test('toDataPath use of encoded paths', t => {
    const fooBar = encodeURIComponent('foo/bar');
    t.is(toDataPath(`#/properties/${fooBar}`), `${fooBar}`);
});
test('resolve instance', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    const instance = {foo: 123};
    const result = getValuePropertyPair(instance, '#/properties/foo');
    t.is(result.instance, instance);
    t.is(result.property, 'foo');
});
test.failing('resolve instance with keywords', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'properties': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    const instance = {properties: 123};
    const result = getValuePropertyPair(instance, '#/properties/properties');
    t.is(result.instance, instance);
    t.is(result.property, 'properties');
    t.is(result.instance[result.property], 123);
});
test('resolve instance with encoded', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo/bar': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    const instance = {'foo/bar': 123};
    const fooBar = encodeURIComponent('foo/bar')
    const result = getValuePropertyPair(instance, `#/properties/${fooBar}`);
    t.is(result.instance, instance);
    t.is(result.property, 'foo/bar');
    t.is(result.instance[result.property], 123);
});
test('resolve nested instance', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'object',
                'properties': {
                    'bar': {
                        'type': 'integer'
                    }
                }
            }
        }
    } as JsonSchema;
    const instance = {foo: {bar: 123}};
    const result = getValuePropertyPair(instance, '#/properties/foo/properties/bar');
    t.is(result.instance, instance.foo);
    t.is(result.property, 'bar');
});
test('resolve uninitiated instance', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'object',
                'properties': {
                    'bar': {
                        'type': 'integer'
                    }
                }
            }
        }
    } as JsonSchema;
    const instance = {};
    const result = getValuePropertyPair(instance, '#/properties/foo/properties/bar');
    t.deepEqual(result.instance, {});
    t.is(result.property, 'bar');
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
    } as JsonSchema;
    const result = resolveSchema(schema, '#/properties/foos/items');
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
    } as JsonSchema;
    const result = resolveSchema(schema, '#/properties/foos/items');
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
    t.not((<JsonSchema>schema.definitions.foo.properties.bar.items).$ref, '#');
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
    } as JsonSchema;
    const result = resolveSchema(schema, '#/properties/foos/items');
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
