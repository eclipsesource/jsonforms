import test from 'ava';

import { JsonSchema } from '../src/models/jsonSchema';
import { generateJsonSchema } from '../src/generators/schema-gen';

test('default schema generation basic types', t => {
  const instance = {boolean: false, number: 3.14, integer: 3, string: 'PI', null: null,
    undefined: undefined};
  const schema = generateJsonSchema(instance);
  // FIXME: Should a property be generated for properties with undefined?
  t.deepEqual(schema, {
    'type': 'object',
    'properties': {
      'boolean': {
        'type': 'boolean'
      },
      'number': {
        'type': 'number'
      },
      'integer': {
        'type': 'integer'
      },
      'string': {
        'type': 'string'
      },
      'null': {
        'type': 'null'
      },
      'undefined': {
      }
    },
    'additionalProperties': true,
    'required': [
        'boolean', 'number', 'integer', 'string', 'null', 'undefined'
    ]
  });
});
test('default schema generation array types', t => {
  const instance = {emptyArray: [], booleanArray: [false, false], numberArray: [3.14, 2.71],
    integerArray: [3, 2], stringArray: ['PI', 'e'], nullArray: [null, null]};
  const schema = generateJsonSchema(instance);
  t.deepEqual(schema, {
    'type': 'object',
    'properties': {
      'emptyArray': {
        'type': 'array',
        'items': {}
      },
      'booleanArray': {
        'type': 'array',
        'items': {'type': 'boolean'}
      },
      'numberArray': {
        'type': 'array',
        'items': {'type': 'number'}
      },
      'integerArray': {
        'type': 'array',
        'items': {'type': 'integer'}
      },
      'stringArray': {
        'type': 'array',
        'items': {'type': 'string'}
      },
      'nullArray': {
        'type': 'array',
        'items': {'type': 'null'}
      }
    },
    'additionalProperties': true,
    'required': [
      'emptyArray', 'booleanArray', 'numberArray', 'integerArray', 'stringArray', 'nullArray'
    ]
  });
});
test.failing('default schema generation tuple array types', t => {
  const instance = {tupleArray: [3.14, 'PI']};
  const schema = generateJsonSchema(instance);
  // FIXME: This assumption is the correct one, but we crteate a oneOf in this case
  t.deepEqual(schema, {
    'type': 'object',
    'properties': {
      'tupleArray': {
        'type': 'array',
        'items': [
          {'type': 'number'},
          {'type': 'string'}
        ]
      }
    },
    'additionalProperties': true,
    'required': [
      'tupleArray'
    ]
  });
});
test('default schema generation ', t => {
    const instance = {
        'address': {
            'streetAddress': '21 2nd Street',
            'city': 'New York'
        },
        'phoneNumber': [
            {
                'location': 'home',
                'code': 44,
                'private': true
            }
        ]
    };
    const schema = generateJsonSchema(instance);
    t.deepEqual(schema, {
        'type': 'object',
        'properties': {
            'address': {
                'type': 'object',
                'properties': {
                    'streetAddress': {
                        'type': 'string'
                    },
                    'city': {
                        'type': 'string'
                    }
                },
                'additionalProperties': true,
                'required': [
                    'streetAddress',
                    'city'
                ]
            },
            'phoneNumber': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'location': {
                            'type': 'string'
                        },
                        'code': {
                            'type': 'integer'
                        },
                        'private': {
                            'type': 'boolean'
                        }
                    },
                    'additionalProperties': true,
                    'required': [
                        'location',
                        'code',
                        'private'
                    ]
                }
            }
        },
        'additionalProperties': true,
        'required': [
            'address',
            'phoneNumber'
        ]
    } as JsonSchema);
});


test('schema generation with options ', t => {
    const instance = {
        'address': {
            'streetAddress': '21 2nd Street',
            'city': 'New York'
        }
    };
    const schema = generateJsonSchema(instance, {
        'additionalProperties': false,
        'required': (props: string[]) => {
            const keys = Object.keys(props);
            if (props !== undefined && keys.length) {
                return [keys[0]];
            } else {
                return [];
            }
        }
    });

    t.deepEqual(schema, {
        'type': 'object',
        'properties': {
            'address': {
                'type': 'object',
                'properties': {
                    'streetAddress': {
                        'type': 'string'
                    },
                    'city': {
                        'type': 'string'
                    }
                },
                'additionalProperties': false,
                'required': ['streetAddress']
            }
        },
        'additionalProperties': false,
        'required': ['address']
    } as JsonSchema);
});
