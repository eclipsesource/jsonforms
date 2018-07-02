/* ts-lint:disable:max-file-line-count */
import {
  findPropertyLabel,
  makeSchemaSelfContained,
  retrieveContainerProperties
} from '../../src/services/property.util';
import { JsonSchema } from '@jsonforms/core';
import * as _ from 'lodash';

let fooBarArraySchema;
beforeEach(() => {
  fooBarArraySchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            bar: {type: 'string'}
          }
        }
      }
    }
  };
});

describe('Container Properties Tests', () => {
  test('expect to retrieve property from a nested array object, non primitive items', () => {
    const schema: JsonSchema = {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            foo: {type: 'string'}
          }
        }
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(1);
    expect(properties[0].schema).toMatchObject((schema.items as JsonSchema).items);
  });

  test('expect to retrieve property from array object, non primitive items', () => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          foo: {type: 'string'}
        }
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(1);
  });

  test('expect to retrieve property from object with array object, non primitive items', () => {
    const schema = fooBarArraySchema;

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(1);
    expect(findPropertyLabel(properties[0])).toEqual('foo');
    expect(properties[0].schema).toMatchObject(schema.properties.foo.items);
  });

  test('expect to have 0 properties from array objects, primitive items', () => {
    const schema = {
      type: 'object',
      properties: {
        strings: {type: 'array', items: {type: 'string'}},
        numbers: {type: 'array', items: {type: 'number'}},
        integers: {type: 'array', items: {type: 'integer'}},
        booleans: {type: 'array', items: {type: 'boolean'}}
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(0);
  });

  test('expect to have 0 properties from object with tuple array', () => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'array',
          items: [
            {
              type: 'object',
              properties: {
                bar: {type: 'string'}
              }
            },
            {
              type: 'object',
              properties: {
                baz: {type: 'string'}
              }
            }
          ]
        }
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(0);
  });

  test('expect to have 0 properties from object with primitives types', () => {
    const schema = {
      type: 'object',
      properties: {
        string: {type: 'string'},
        number: {type: 'number'},
        integer: {type: 'integer'},
        boolean: {type: 'boolean'}
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(0);
  });

  test('expect to have 0 properties from object without array object', () => {
    const schema = {
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

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(0);
  });

  test('expect to have properties from objects with same $ref', () => {
    const schema: JsonSchema = {
      definitions: {
        person: {
          $id: '#id',
          type: 'object',
          properties: {
            name: {type: 'string'}
          }
        }
      },
      type: 'object',
      properties: {
        friends: {type: 'array', items: {$ref: '#/definitions/person'}},
        enemies: {type: 'array', items: {$ref: '#/definitions/person'}}
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(2);
    expect(findPropertyLabel(properties[0])).toEqual('person');
    expect(findPropertyLabel(properties[1])).toEqual('person');
    const personCopy = JSON.parse(JSON.stringify(schema.definitions.person));
    expect(properties[0].schema).toMatchObject(personCopy);
    expect(properties[1].schema).toMatchObject(personCopy);
  });

  test('expect to have properties from objects with different $ref', () => {
    const schema: JsonSchema = {
      definitions: {
        person: {
          type: 'object',
          properties: {
            name: {type: 'string'}
          }
        },
        robot: {
          type: 'object',
          properties: {
            $id: {type: 'string'}
          }
        }
      },
      type: 'object',
      properties: {
        persons: {type: 'array', items: {$ref: '#/definitions/person'}},
        robots: {type: 'array', items: {$ref: '#/definitions/robot'}}
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(2);
    const personCopy = JSON.parse(JSON.stringify(schema.definitions.person));
    personCopy.$id = '#' + (schema.properties.persons.items as JsonSchema).$ref;
    const robotCopy = JSON.parse(JSON.stringify(schema.definitions.robot));
    robotCopy.$id = '#' + (schema.properties.robots.items as JsonSchema).$ref;
    expect(findPropertyLabel(properties[0])).toEqual('person');
    expect(findPropertyLabel(properties[1])).toEqual('robot');
    expect(properties[0].schema).toMatchObject(personCopy);
    expect(properties[1].schema).toMatchObject(robotCopy);
  });

  test('expect to have 0 properties object with no array object', () => {
    const schema: JsonSchema = {
      definitions: {
        a: {type: 'object'},
        b: {type: 'object'}
      },
      anyOf: [
        {$ref: '#/definitions/a'},
        {$ref: '#/definitions/b'}
      ]
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(0);
  });

  test('expect to have properties from array object by using keyword anyOf', () => {
    const schema: JsonSchema = {
      definitions: {
        a: {type: 'object', properties: {foo: {type: 'string'}}},
        b: {type: 'object', properties: {foo: {type: 'string'}}}
      },
      type: 'array',
      items: {
        anyOf: [
          {$ref: '#/definitions/a'},
          {$ref: '#/definitions/b'}
        ]
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(2);
    expect(findPropertyLabel(properties[0])).toEqual('a');
    expect(findPropertyLabel(properties[1])).toEqual('b');
    const aCopy = JSON.parse(JSON.stringify(schema.definitions.a));
    aCopy.$id = '#' + (schema.items as JsonSchema).anyOf[0].$ref;
    const bCopy = JSON.parse(JSON.stringify(schema.definitions.b));
    bCopy.$id = '#' + (schema.items as JsonSchema).anyOf[1].$ref;
    expect(properties[0].schema).toMatchObject(aCopy);
    expect(properties[1].schema).toMatchObject(bCopy);
  });

  test('expect to retrieve properties from object with array object by using keyword anyOf', () => {
    const schema: JsonSchema = {
      definitions: {
        a: {type: 'object', properties: {foo: {type: 'string'}}},
        b: {type: 'object', properties: {foo: {type: 'string'}}}
      },
      type: 'object',
      properties: {
        elements: {
          type: 'array',
          items: {
            anyOf: [
              {$ref: '#/definitions/a'},
              {$ref: '#/definitions/b'}
            ]
          }
        }
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(2);
    expect(findPropertyLabel(properties[0])).toEqual('a');
    expect(findPropertyLabel(properties[1])).toEqual('b');
    const aCopy = JSON.parse(JSON.stringify(schema.definitions.a));
    aCopy.$id = '#' + (schema.properties.elements.items as JsonSchema).anyOf[0].$ref;
    const bCopy = JSON.parse(JSON.stringify(schema.definitions.b));
    bCopy.$id = '#' + (schema.properties.elements.items as JsonSchema).anyOf[1].$ref;
    expect(properties[0].schema).toMatchObject(aCopy);
    expect(properties[1].schema).toMatchObject(bCopy);
  });

  test('expect to retrieve properties from object that references to an array object', () => {
    const schema: JsonSchema = {
      definitions: {
        root: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }
        }
      },
      type: 'object',
      properties: {
        roots: {
          $ref: '#/definitions/root'
        }
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(1);
    expect(findPropertyLabel(properties[0])).toEqual('root');
    expect(properties[0].schema).toMatchObject(schema.definitions.root.items as JsonSchema);
  });

  test('expect to create self contained child schemata: cross recursion', () => {
    const schema: JsonSchema = {
      definitions: {
        person: {
          type: 'object',
          properties: {
            robots: {
              type: 'array',
              items: {$ref: '#/definitions/robot'}
            }
          }
        },
        robot: {
          type: 'object',
          properties: {
            humans: {
              type: 'array',
              items: {$ref: '#/definitions/person'}
            }
          }
        }
      },
      type: 'object',
      properties: {
        persons: {type: 'array', items: {$ref: '#/definitions/person'}}
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(1);
    expect(findPropertyLabel(properties[0])).toEqual('person');
    const personCopy = JSON.parse(JSON.stringify(schema.definitions.person));
    personCopy.$id = '#' + (schema.properties.persons.items as JsonSchema).$ref;
    personCopy.definitions = JSON.parse(JSON.stringify(schema.definitions));
    expect(properties[0].schema).toMatchObject(personCopy);
  });
// real world examples
  test('support easy uml schema with array objects', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        classes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                'type': 'string'
              },
              attributes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string'
                    },
                    type: {
                      type: 'string',
                      enum: ['string', 'integer']
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const properties = retrieveContainerProperties(schema, schema);
    expect(properties.length).toEqual(1);
    expect(findPropertyLabel(properties[0])).toEqual('classes');
    expect(properties[0].schema)
      .toMatchObject(schema.properties.classes.items as JsonSchema);
    const propertiesClasses =
      retrieveContainerProperties(schema.properties.classes.items as JsonSchema,
                                  schema);
    expect(propertiesClasses.length).toEqual(1);
    expect(findPropertyLabel(propertiesClasses[0])).toEqual('attributes');
    expect(propertiesClasses[0].schema)
      .toMatchObject((schema.properties.classes.items as JsonSchema).properties.attributes.items);
  });

  test('calculating schema with references', () => {
    const parentSchema: JsonSchema = {
      'type': 'object',
      '$id': '#root',
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
          '$id': '#elements',
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
          '$id': '#control',
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
          '$id': '#horizontallayout',
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
          '$id': '#verticallayout',
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
          '$id': '#rule',
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
          '$id': '#scope',
          'pattern': '^#\\/properties\\/{1}'
        },
        'options': {
          'type': 'object',
          '$id': '#options'
        }
      }
    };
    const schema = {
      'type': 'object',
      '$id': '#control',
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
    const calculatedSchemaReferences = makeSchemaSelfContained(parentSchema, schema);
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
    const calculatedSchemaReferences = makeSchemaSelfContained(parentSchema, schema);
    expect(calculatedSchemaReferences).toMatchObject(schema);
  });

  test('calculating schema with missing reference definition', () => {
    const parentSchema: JsonSchema = {
      'type': 'object',
      '$id': '#root',
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
      '$id': '#control',
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
    const calculatedSchemaReferences = makeSchemaSelfContained(parentSchema, schema);
    expect(calculatedSchemaReferences).toMatchObject(schema);
  });

  test('calculating schema with references by using another keyword for definitions block', () => {
    const parentSchema = {
      'type': 'object',
      '$id': '#root',
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
          '$id': '#elements',
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
          '$id': '#control',
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
          '$id': '#horizontallayout',
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
          '$id': '#scope',
          'pattern': '^#\\/properties\\/{1}'
        }
      }
    };
    const schema = {
      'type': 'object',
      '$id': '#control',
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
    const calculatedSchemaReferences = makeSchemaSelfContained(parentSchema, schema);
    const expectedSchema = { ...schema, ...{
      defs: _.pick(parentSchema.defs, ['scope'])
    }};
    expect(calculatedSchemaReferences).toMatchObject(expectedSchema);
  });
});
