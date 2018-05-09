/* ts-lint:disable:max-file-line-count */
import {
  SchemaService
} from '../../src/services/schema.service';
import { SchemaServiceImpl } from '../../src/services/schema.service.impl';
import { JsonSchema } from '@jsonforms/core';
import { EditorContext } from '../../src/editor-context';

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

const editorContext: EditorContext = {
  dataSchema: {},
  modelMapping: {
    attribute: 'type',
    mapping: {
      'person': '#person'
    }
  },
  identifyingProperty: 'id'
};

describe('Schema Service Containment Property Tests', () => {
  test('array with array ', () => {
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
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(1);
    expect(properties[0].schema).toMatchObject((schema.items as JsonSchema).items);
  });

  test('array with objects ', () => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          foo: {type: 'string'}
        }
      }
    };
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(1);
  });

  test('object with object array ', () => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).toEqual('foo');
    expect(properties[0].schema).toMatchObject(schema.properties.foo.items);
  });

  test('object with simple array ', () => {
    const schema = {
      type: 'object',
      properties: {
        strings: {type: 'array', items: {type: 'string'}},
        numbers: {type: 'array', items: {type: 'number'}},
        integers: {type: 'array', items: {type: 'integer'}},
        booleans: {type: 'array', items: {type: 'boolean'}}
      }
    };
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(0);
  });

  test('object with tuple array ', () => {
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
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(0);
  });

  test('object with simple properties ', () => {
    const schema = {
      type: 'object',
      properties: {
        string: {type: 'string'},
        number: {type: 'number'},
        integer: {type: 'integer'},
        boolean: {type: 'boolean'}
      }
    };
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(0);
  });

  test('object with object property', () => {
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
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(0);
  });

  test('support multiple same $ref', () => {
    const schema: JsonSchema = {
      definitions: {
        person: {
          id: '#id',
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
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(2);
    expect(properties[0].label).toEqual('person');
    expect(properties[1].label).toEqual('person');
    const personCopy = JSON.parse(JSON.stringify(schema.definitions.person));
    expect(properties[0].schema).toMatchObject(personCopy);
    expect(properties[1].schema).toMatchObject(personCopy);
  });

  test('support multiple different $ref', () => {
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
            id: {type: 'string'}
          }
        }
      },
      type: 'object',
      properties: {
        persons: {type: 'array', items: {$ref: '#/definitions/person'}},
        robots: {type: 'array', items: {$ref: '#/definitions/robot'}}
      }
    };
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(2);
    const personCopy = JSON.parse(JSON.stringify(schema.definitions.person));
    personCopy.id = '#' + (schema.properties.persons.items as JsonSchema).$ref;
    const robotCopy = JSON.parse(JSON.stringify(schema.definitions.robot));
    robotCopy.id = '#' + (schema.properties.robots.items as JsonSchema).$ref;
    expect(properties[0].label).toEqual('person');
    expect(properties[1].label).toEqual('robot');
    expect(properties[0].schema).toMatchObject(personCopy);
    expect(properties[1].schema).toMatchObject(robotCopy);
  });

  test('support root anyOf', () => {
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
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(0);
  });

  test('support array with anyOf', () => {
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
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(2);
    expect(properties[0].label).toEqual('a');
    expect(properties[1].label).toEqual('b');
    const aCopy = JSON.parse(JSON.stringify(schema.definitions.a));
    aCopy.id = '#' + (schema.items as JsonSchema).anyOf[0].$ref;
    const bCopy = JSON.parse(JSON.stringify(schema.definitions.b));
    bCopy.id = '#' + (schema.items as JsonSchema).anyOf[1].$ref;
    expect(properties[0].schema).toMatchObject(aCopy);
    expect(properties[1].schema).toMatchObject(bCopy);
  });

  test('support object with array with anyOf', () => {
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
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(2);
    expect(properties[0].label).toEqual('a');
    expect(properties[1].label).toEqual('b');
    const aCopy = JSON.parse(JSON.stringify(schema.definitions.a));
    aCopy.id = '#' + (schema.properties.elements.items as JsonSchema).anyOf[0].$ref;
    const bCopy = JSON.parse(JSON.stringify(schema.definitions.b));
    bCopy.id = '#' + (schema.properties.elements.items as JsonSchema).anyOf[1].$ref;
    expect(properties[0].schema).toMatchObject(aCopy);
    expect(properties[1].schema).toMatchObject(bCopy);
  });

  test('support object with array $ref', () => {
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
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).toEqual('root');
    expect(properties[0].schema).toMatchObject(schema.definitions.root.items as JsonSchema);
  });

  test('self contained child schemata: cross recursion', () => {
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
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).toEqual('person');
    const personCopy = JSON.parse(JSON.stringify(schema.definitions.person));
    personCopy.id = '#' + (schema.properties.persons.items as JsonSchema).$ref;
    personCopy.definitions = JSON.parse(JSON.stringify(schema.definitions));
    expect(properties[0].schema).toMatchObject(personCopy);
  });
// real world examples
  test('support easy uml schema with arrays', () => {
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
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainerProperties(schema);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).toEqual('classes');
    expect(properties[0].schema)
      .toMatchObject(schema.properties.classes.items as JsonSchema);
    const propertiesClasses =
      service.getContainerProperties(schema.properties.classes.items as JsonSchema);
    expect(propertiesClasses.length).toEqual(1);
    expect(propertiesClasses[0].label).toEqual('attributes');
    expect(propertiesClasses[0].schema)
      .toMatchObject((schema.properties.classes.items as JsonSchema).properties.attributes.items);
  });
});
