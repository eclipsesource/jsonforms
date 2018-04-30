import { calculateSchemaReferences } from '../../src/services/schema.service.impl';
import { JsonSchema } from '@jsonforms/core';
import * as _ from 'lodash';

describe('Schema Service Tests', () => {
  test('calculating schema with references', () => {
    const parentSchema: JsonSchema = {
      'type': 'object',
      'id': '#root',
      'properties': {
        'type': {
          'type': 'string',
          'enum': [
            'HorizontalLayout',
            'VerticalLayout',
            'Group',
            'Categorization'
          ]
        },
        'label': {
          'type': 'string'
        },
        'elements': {
          '$ref': '#/definitions/elements'
        },
        'rule': {
          '$ref': '#/definitions/rule'
        }
      },
      'definitions': {
        'elements': {
          'type': 'array',
          'id': '#elements',
          'items': {
            'anyOf': [
              {
                '$ref': '#/definitions/control'
              },
              {
                '$ref': '#/definitions/horizontallayout'
              },
              {
                '$ref': '#/definitions/verticallayout'
              }
            ]
          }
        },
        'control': {
          'type': 'object',
          'id': '#control',
          'properties': {
            'type': {
              'type': 'string',
              'default': 'Control'
            },
            'label': {
              'type': 'string'
            },
            'scope': {
              '$ref': '#/definitions/scope'
            },
            'options': {
              '$ref': '#/definitions/options'
            },
            'rule': {
              '$ref': '#/definitions/rule'
            }
          },
        },
        'horizontallayout': {
          'type': 'object',
          'id': '#horizontallayout',
          'properties': {
            'type': {
              'type': 'string',
              'default': 'HorizontalLayout'
            },
            'elements': {
              '$ref': '#/definitions/elements'
            },
            'rule': {
              '$ref': '#/definitions/rule'
            }
          },
        },
        'verticallayout': {
          'type': 'object',
          'id': '#verticallayout',
          'properties': {
            'type': {
              'type': 'string',
              'default': 'VerticalLayout'
            },
            'elements': {
              '$ref': '#/definitions/elements'
            },
            'rule': {
              '$ref': '#/definitions/rule'
            }
          },
        },
        'rule': {
          'type': 'object',
          'id': '#rule',
          'properties': {
            'effect': {
              'type': 'string',
              'enum': [
                'HIDE',
                'SHOW',
                'DISABLE',
                'ENABLE'
              ]
            },
            'condition': {
              'type': 'object',
              'properties': {
                'type': {
                  'type': 'string'
                },
                'scope': {
                  '$ref': '#/definitions/scope'
                },
                'expectedValue': {
                  'type': [
                    'string',
                    'integer',
                    'number',
                    'boolean'
                  ]
                }
              }
            }
          }
        },
        'scope': {
          'type': 'string',
          'id': '#scope',
          'pattern': '^#\\/properties\\/{1}'
        },
        'options': {
          'type': 'object',
          'id': '#options'
        }
      }
    };
    const schema = {
      'type': 'object',
      'id': '#control',
      'properties': {
        'type': {
          'type': 'string',
          'const': 'Control',
          'default': 'Control'
        },
        'label': {
          'type': 'string'
        },
        'scope': {
          '$ref': '#/definitions/scope'
        },
        'options': {
          '$ref': '#/definitions/options'
        },
        'rule': {
          '$ref': '#/definitions/rule'
        }
      }
    };
    const calculatedSchemaReferences = calculateSchemaReferences(parentSchema, schema);
    const expectedSchema = { ...schema, ...{
      definitions: _.pick(parentSchema.definitions, ['scope', 'options', 'rule'])
    }};
    expect(calculatedSchemaReferences).toMatchObject(expectedSchema);
  });

  test('calculating schema without references', () => {
    const parentSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'object',
          properties: {
            bar: {type: 'string'}
          }
        }
      }
    };
    const schema = {
      type: 'object',
      properties: {
        bar: {type: 'string'}
      }
    };
    const calculatedSchemaReferences = calculateSchemaReferences(parentSchema, schema);
    expect(calculatedSchemaReferences).toMatchObject(schema);
  });

  test('calculating schema with missing reference definition', () => {
    const parentSchema: JsonSchema = {
      'type': 'object',
      'id': '#root',
      'properties': {
        'type': {
          'type': 'string'
        },
        'label': {
          'type': 'string'
        },
        'elements': {
          '$ref': '#/definitions/elements'
        },
      }
    };
    const schema = {
      'type': 'object',
      'id': '#control',
      'properties': {
        'type': {
          'type': 'string',
          'const': 'Control',
          'default': 'Control'
        },
        'label': {
          'type': 'string'
        },
        'scope': {
          '$ref': '#/definitions/scope'
        }
      }
    };
    const calculatedSchemaReferences = calculateSchemaReferences(parentSchema, schema);
    expect(calculatedSchemaReferences).toMatchObject(schema);
  });

  test('calculating schema with references by using another keyword for definition', () => {
    const parentSchema = {
      'type': 'object',
      'id': '#root',
      'properties': {
        'type': {
          'type': 'string'
        },
        'label': {
          'type': 'string'
        },
        'elements': {
          '$ref': '#/defs/elements'
        },
      },
      'defs': {
        'elements': {
          'type': 'array',
          'id': '#elements',
          'items': {
            'anyOf': [
              {
                '$ref': '#/defs/control'
              },
              {
                '$ref': '#/defs/horizontallayout'
              }
            ]
          }
        },
        'control': {
          'type': 'object',
          'id': '#control',
          'properties': {
            'type': {
              'type': 'string',
              'const': 'Control',
              'default': 'Control'
            },
            'label': {
              'type': 'string'
            },
            'scope': {
              '$ref': '#/defs/scope'
            }
          },
        },
        'horizontallayout': {
          'type': 'object',
          'id': '#horizontallayout',
          'properties': {
            'type': {
              'type': 'string',
              'const': 'HorizontalLayout',
              'default': 'HorizontalLayout'
            },
            'elements': {
              '$ref': '#/defs/elements'
            }
          },
        },
        'scope': {
          'type': 'string',
          'id': '#scope',
          'pattern': '^#\\/properties\\/{1}'
        }
      }
    };
    const schema = {
      'type': 'object',
      'id': '#control',
      'properties': {
        'type': {
          'type': 'string',
          'const': 'Control',
          'default': 'Control'
        },
        'label': {
          'type': 'string'
        },
        'scope': {
          '$ref': '#/defs/scope'
        }
      }
    };
    const calculatedSchemaReferences = calculateSchemaReferences(parentSchema, schema);
    const expectedSchema = { ...schema, ...{
      defs: _.pick(parentSchema.defs, ['scope'])
    }};
    expect(calculatedSchemaReferences).toMatchObject(expectedSchema);
  });
});
