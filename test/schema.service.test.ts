import {test} from 'ava';
import {SchemaService, SchemaServiceImpl} from '../src/core/schema.service';
import {JsonSchema} from '../src/models/jsonSchema';

test.failing('array with array ', t => {
  const schema = {
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
   } as JsonSchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 1);
  t.is(properties[0].schema, schema.items);
});
test('array with objects ', t => {
  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        foo: {type: 'string'}
      }
    }
  };
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 1);
});
test('object with object array ', t => {
  const schema = {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 1);
  t.is(properties[0].label, 'foo');
  t.deepEqual(properties[0].schema, <JsonSchema>schema.properties.foo.items);
});
test('object with simple array ', t => {
  const schema = {
    type: 'object',
    properties: {
      strings: {type: 'array', items: {type: 'string'}},
      numbers: {type: 'array', items: {type: 'number'}},
      integers: {type: 'array', items: {type: 'integer'}},
      booleans: {type: 'array', items: {type: 'boolean'}}
    }
  };
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 0);
});
test('object with tuple array ', t => {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 0);
});
test('object with simple properties ', t => {
  const schema = {
    type: 'object',
    properties: {
      string: {type: 'string'},
      number: {type: 'number'},
      integer: {type: 'integer'},
      boolean: {type: 'boolean'}
    }
  };
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 0);
});
test.failing('object with object property ', t => {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 1);
  t.is(properties[0].label, 'foo');
  t.deepEqual(properties[0].schema, <JsonSchema>schema.properties.foo.properties);
});
test('support multiple same $ref', t => {
  const schema = {
    definitions: {
      person: {
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
  } as JsonSchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 2);
  t.is(properties[0].label, 'person');
  t.is(properties[1].label, 'person');
  t.deepEqual(properties[0].schema, <JsonSchema>schema.definitions.person);
  t.deepEqual(properties[1].schema, <JsonSchema>schema.definitions.person);
});
test('support multiple different $ref', t => {
  const schema = {
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
  } as JsonSchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 2);
  t.is(properties[0].label, 'person');
  t.is(properties[1].label, 'robot');
  t.deepEqual(properties[0].schema, <JsonSchema>schema.definitions.person);
  t.deepEqual(properties[1].schema, <JsonSchema>schema.definitions.robot);
});
test.failing('support root anyOf', t => {
  const schema = {
    definitions: {
      a: {type: 'object'},
      b: {type: 'object'}
    },
    anyOf: [
      {$ref: '#/definitions/a'},
      {$ref: '#/definitions/b'}
    ]
  } as JsonSchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 2);
  t.is(properties[0].label, 'a');
  t.is(properties[1].label, 'b');
  t.deepEqual(properties[0].schema, <JsonSchema>schema.definitions.a);
  t.deepEqual(properties[1].schema, <JsonSchema>schema.definitions.b);
});
test('support array with anyOf', t => {
  const schema = {
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
  } as JsonSchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 2);
  t.is(properties[0].label, 'a');
  t.is(properties[1].label, 'b');
  t.deepEqual(properties[0].schema, <JsonSchema>schema.definitions.a);
  t.deepEqual(properties[1].schema, <JsonSchema>schema.definitions.b);
});
test('support object with array with anyOf', t => {
  const schema = {
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
    } as JsonSchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 2);
  t.is(properties[0].label, 'a');
  t.is(properties[1].label, 'b');
  t.deepEqual(properties[0].schema, <JsonSchema>schema.definitions.a);
  t.deepEqual(properties[1].schema, <JsonSchema>schema.definitions.b);
});
// real world examples
test('support easy uml schema with arrays', t => {
  const schema = {
      'type': 'object',
      'properties': {
        'name': {
          'type': 'string'
        },
        'classes': {
          'type': 'array',
          'items': {
            'type': 'object',
            'properties': {
              'name': {
                'type': 'string'
              },
              'attributes': {
                'type': 'array',
                'items': {
                  'type': 'object',
                  'properties': {
                    'name': {
                      'type': 'string'
                    },
                    'type': {
                      'type': 'string',
                      'enum': ['string', 'integer']
                    }
                  }
                }
              }
            }
          }
        }
      }
    } as JsonSchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 1);
  t.is(properties[0].label, 'classes');
  t.deepEqual(properties[0].schema, <JsonSchema>schema.properties.classes.items);

  const propertiesClasses = service.getContainmentProperties(schema.properties.classes.items);
  t.is(propertiesClasses.length, 1);
  t.is(propertiesClasses[0].label, 'attributes');
  t.deepEqual(propertiesClasses[0].schema,
    (<JsonSchema>schema.properties.classes.items).properties.attributes.items);
});
test('support for array references', t => {
  const schema = {
      definitions: {
        class: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            associations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    minimum: 0
                  }
                },
                links: [{
                  rel: 'full',
                  href: '#/classes/{id}',
                  targetSchema: '#/definitions/class'
                }]
              }
            }
          }
        }
      },
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        classes: {
          type: 'array',
          items: {
            $ref: '#/definitions/class'
          }
        }
      }
    } as JsonSchema;
    const service: SchemaService = new SchemaServiceImpl(schema);
    const properties =
      service.getReferenceProperties(schema.definitions.class.properties.associations.items);
    t.is(properties.length, 1);
    t.is(properties[0].label, 'id');
    const selfContainedClassSchema = <JsonSchema>schema.definitions.class;
    selfContainedClassSchema.properties.associations.items['links'][0].targetSchema = '#';
    t.deepEqual(properties[0].targetSchema, selfContainedClassSchema);
});
test('support for object references', t => {
  const schema = {
    definitions: {
      class: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          association: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                minimum: 0
              }
            },
            links: [{
              rel: 'full',
              href: '#/classes/{id}',
              targetSchema: '#/definitions/class'
            }]
          }
        }
      }
    },
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      classes: {
        type: 'array',
        items: {
          $ref: '#/definitions/class'
        }
      }
    }
  } as JsonSchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties =
    service.getReferenceProperties(schema.definitions.class.properties.association);
  t.is(properties.length, 1);
  t.is(properties[0].label, 'id');
  const selfContainedClassSchema = <JsonSchema>schema.definitions.class;
  selfContainedClassSchema.properties.association['links'][0].targetSchema = '#';
  t.deepEqual(properties[0].targetSchema, selfContainedClassSchema);
});
test('support object with array $ref', t => {
  const schema = {
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
    'type': 'object',
    'properties': {
      'roots': {
        '$ref': '#/definitions/root'
      }
    }
  } as JsonSchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 1);
  t.is(properties[0].label, 'root');
  t.deepEqual(properties[0].schema, <JsonSchema>schema.definitions.root.items);
});
