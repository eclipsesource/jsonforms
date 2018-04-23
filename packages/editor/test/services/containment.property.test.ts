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
  test('array with array ', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(1);
    expect(properties[0].schema).toMatchObject((schema.items as JsonSchema).items);
    done();
  });
  test('array with objects ', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(1);
    done();
  });
  test('object with object array ', done => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).toEqual('foo');
    expect(properties[0].schema).toMatchObject(schema.properties.foo.items);
    done();
  });
  test('object with simple array ', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(0);
    done();
  });
  test('object with tuple array ', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(0);
    done();
  });
  test('object with simple properties ', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(0);
    done();
  });
  test('object with object property', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(0);
    done();
  });
  test('support multiple same $ref', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(2);
    expect(properties[0].label).toEqual('person');
    expect(properties[1].label).toEqual('person');
    const personCopy = JSON.parse(JSON.stringify(schema.definitions.person));
    expect(properties[0].schema).toMatchObject(personCopy);
    expect(properties[1].schema).toMatchObject(personCopy);
    done();
  });

  test('support multiple different $ref', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(2);
    const personCopy = JSON.parse(JSON.stringify(schema.definitions.person));
    personCopy.id = '#' + (schema.properties.persons.items as JsonSchema).$ref;
    const robotCopy = JSON.parse(JSON.stringify(schema.definitions.robot));
    robotCopy.id = '#' + (schema.properties.robots.items as JsonSchema).$ref;
    expect(properties[0].label).toEqual('person');
    expect(properties[1].label).toEqual('robot');
    expect(properties[0].schema).toMatchObject(personCopy);
    expect(properties[1].schema).toMatchObject(robotCopy);
    done();
  });
  test('support root anyOf', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(0);
    done();
  });
  test('support array with anyOf', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(2);
    expect(properties[0].label).toEqual('a');
    expect(properties[1].label).toEqual('b');
    const aCopy = JSON.parse(JSON.stringify(schema.definitions.a));
    aCopy.id = '#' + (schema.items as JsonSchema).anyOf[0].$ref;
    const bCopy = JSON.parse(JSON.stringify(schema.definitions.b));
    bCopy.id = '#' + (schema.items as JsonSchema).anyOf[1].$ref;
    expect(properties[0].schema).toMatchObject(aCopy);
    expect(properties[1].schema).toMatchObject(bCopy);
    done();
  });
  test('support object with array with anyOf', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(2);
    expect(properties[0].label).toEqual('a');
    expect(properties[1].label).toEqual('b');
    const aCopy = JSON.parse(JSON.stringify(schema.definitions.a));
    aCopy.id = '#' + (schema.properties.elements.items as JsonSchema).anyOf[0].$ref;
    const bCopy = JSON.parse(JSON.stringify(schema.definitions.b));
    bCopy.id = '#' + (schema.properties.elements.items as JsonSchema).anyOf[1].$ref;
    expect(properties[0].schema).toMatchObject(aCopy);
    expect(properties[1].schema).toMatchObject(bCopy);
    done();
  });
  test('support for array references', done => {
    // TODO: links property is unknown
    // tslint:disable:no-object-literal-type-assertion
    const schema: JsonSchema = {
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
                  targetSchema: {$ref: '#/definitions/class'}
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
    // tslint:enable:no-object-literal-type-assertion
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties =
      service.getReferenceProperties(
        schema.definitions.class.properties.associations.items as JsonSchema);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).toEqual('id');
    const selfContainedClassSchema = JSON.parse(
      JSON.stringify(schema.definitions.class as JsonSchema)
    );
    selfContainedClassSchema.id = '#' + (schema.properties.classes.items as JsonSchema).$ref;
    expect(properties[0].targetSchema).toMatchObject(selfContainedClassSchema);
    done();
  });

  test('support for object references', done => {
    // tslint:disable:no-object-literal-type-assertion
    const schema: JsonSchema = {
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
                targetSchema: {$ref: '#/definitions/class'}
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
    // tslint:enable:no-object-literal-type-assertion
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const properties =
      service.getReferenceProperties(schema.definitions.class.properties.association);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).toEqual('id');

    const selfContainedClassSchema = JSON.parse(JSON.stringify(schema.definitions.class));
    selfContainedClassSchema.id = '#' + (schema.properties.classes.items as JsonSchema).$ref;
    expect(properties[0].targetSchema).toMatchObject(selfContainedClassSchema);
    done();
  });
  test('support object with array $ref', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).toEqual('root');
    expect(properties[0].schema).toMatchObject(schema.definitions.root.items as JsonSchema);
    done();
  });

  test('containment properties add when array not defined', done => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const data = {
      foo: undefined
    };
    const valueToAdd = {bar: 'undefined array'};
    property.addToData(data)(valueToAdd);
    expect(data.foo !== undefined).toBe(true);
    expect(data.foo.length).toEqual(1);
    expect(data.foo[0]).toEqual(valueToAdd);
    done();
  });

  test('containment properties add when array not defined and generate ID', done => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              bar: { type: 'string' }
            }
          }
        }
      }
    };

    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);

    const property = service.getContainmentProperties(schema)[0];
    const data = {
      foo: undefined
    };
    const valueToAdd = { bar: `Hey Mum, look, it's an idea` };
    property.addToData(data)(valueToAdd);
    expect(data.foo !== undefined).toBe(true);
    expect(data.foo.length).toEqual(1);
    expect(data.foo[0].id !== undefined).toBe(true);
    done();
  });

  test('containment properties add when array not defined and do not overwrite existing ID',
       done => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              bar: { type: 'string' }
            }
          }
        }
      }
    };

    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);

    const property = service.getContainmentProperties(schema)[0];
    const data = {
      foo: undefined
    };
    const valueToAdd = { bar: `Hey Mum, look, it's an idea`, _id: 'TEST-ID' };
    property.addToData(data)(valueToAdd);

    expect(data.foo !== undefined).toBe(true);
    expect(data.foo.length).toEqual(1);
    expect(data.foo[0].bar).toEqual(`Hey Mum, look, it's an idea`);
    expect(data.foo[0]._id).toEqual('TEST-ID');
    done();
  });

  test('containment properties add when array defined', done => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const data = {foo: [{bar: 'initial'}]};
    const valueToAdd = {bar: 'defined array'};
    property.addToData(data)(valueToAdd);
    expect(data.foo !== undefined).toBe(true);
    expect(data.foo.length).toEqual(2);
    expect(data.foo[1]).toEqual(valueToAdd);
    done();
  });

  test('containment properties add default with existing neighbour', done => {
    // expectation default === add after neighbour
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const firstValue = {bar: 'first'};
    const lastValue = {bar: 'last'};
    const data = {foo: [firstValue, lastValue]};
    const valueToAdd = {bar: 'defined array'};
    property.addToData(data)(valueToAdd, firstValue);
    expect(data.foo !== undefined).toBe(true);
    expect(data.foo.length).toEqual(3);
    expect(data.foo[0]).toEqual(firstValue);
    expect(data.foo[1]).toEqual(valueToAdd);
    expect(data.foo[2]).toEqual(lastValue);
    done();
  });

  test('containment properties add after existing neighbour(not last in array)', done => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const firstValue = {bar: 'first'};
    const lastValue = {bar: 'last'};
    const data = {foo: [firstValue, lastValue]};
    const valueToAdd = {bar: 'defined array'};
    property.addToData(data)(valueToAdd, firstValue, true);
    expect(data.foo !== undefined).toBe(true);
    expect(data.foo.length).toEqual(3);
    expect(data.foo[0]).toEqual(firstValue);
    expect(data.foo[1]).toEqual(valueToAdd);
    expect(data.foo[2]).toEqual(lastValue);
    done();
  });
  test('containment properties add after existing neighbour(last in array)', done => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const firstValue = {bar: 'first'};
    const lastValue = {bar: 'last'};
    const data = {foo: [firstValue, lastValue]};
    const valueToAdd = {bar: 'defined array'};
    property.addToData(data)(valueToAdd, lastValue, true);
    expect(data.foo !== undefined).toBe(true);
    expect(data.foo.length).toEqual(3);
    expect(data.foo[0]).toEqual(firstValue);
    expect(data.foo[1]).toEqual(lastValue);
    expect(data.foo[2]).toEqual(valueToAdd);
    done();
  });
  test('containment properties add after non-existant neighbour', done => {
    // expectation: value is added at the end
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const firstValue = {bar: 'first'};
    const lastValue = {bar: 'last'};
    const notInArray = {bar: 'not in array'};
    const data = {foo: [firstValue, lastValue]};
    const valueToAdd = {bar: 'defined array'};
    property.addToData(data)(valueToAdd, notInArray, true);
    expect(data.foo !== undefined).toBe(true);
    expect(data.foo.length).toEqual(3);
    expect(data.foo[0]).toEqual(firstValue);
    expect(data.foo[1]).toEqual(lastValue);
    expect(data.foo[2]).toEqual(valueToAdd);
    done();
  });
  test('containment properties add before existing neighbour(not first in array)', done => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const firstValue = {bar: 'first'};
    const lastValue = {bar: 'last'};
    const data = {foo: [firstValue, lastValue]};
    const valueToAdd = {bar: 'defined array'};
    property.addToData(data)(valueToAdd, lastValue, false);
    expect(data.foo !== undefined).toBe(true);
    expect(data.foo.length).toEqual(3);
    expect(data.foo[0]).toEqual(firstValue);
    expect(data.foo[1]).toEqual(valueToAdd);
    expect(data.foo[2]).toEqual(lastValue);
    done();
  });
  test('containment properties add before existing neighbour(first in array)', done => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const firstValue = {bar: 'first'};
    const lastValue = {bar: 'last'};
    const data = {foo: [firstValue, lastValue]};
    const valueToAdd = {bar: 'defined array'};
    property.addToData(data)(valueToAdd, firstValue, false);
    expect(data.foo !== undefined).toBe(true);
    expect(data.foo.length).toEqual(3);
    expect(data.foo[0]).toEqual(valueToAdd);
    expect(data.foo[1]).toEqual(firstValue);
    expect(data.foo[2]).toEqual(lastValue);
    done();
  });
  test('containment properties add before non-existant neighbour', done => {
    // expectation: value is added at the end
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const firstValue = {bar: 'first'};
    const lastValue = {bar: 'last'};
    const notInArray = {bar: 'not in array'};
    const data = {foo: [firstValue, lastValue]};
    const valueToAdd = {bar: 'defined array'};
    property.addToData(data)(valueToAdd, notInArray, false);
    expect(data.foo !== undefined).toBe(true);
    expect(data.foo.length).toEqual(3);
    expect(data.foo[0]).toEqual(firstValue);
    expect(data.foo[1]).toEqual(lastValue);
    expect(data.foo[2]).toEqual(valueToAdd);
    done();
  });
  test('containment properties get when array not defined', done => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const data = {};
    const getData = property.getData(data);
    expect(getData === undefined).toBe(true);
    done();
  });
  test('containment properties get when array defined', done => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const data = {foo: [{bar: 'initial'}]};
    const getData = property.getData(data);
    expect(getData).toEqual(data.foo);
    done();
  });
  test('containment properties delete when array not defined', done => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const data = {};
    const valueToDelete = {bar: 'undefined array'};
    property.deleteFromData(data)(valueToDelete);
    expect(data !== undefined).toBe(true);
    done();
  });
  test('containment properties delete when array defined', done => {
    const schema = fooBarArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getContainmentProperties(schema)[0];
    const initialData1 = {bar: 'delete'};
    const initialData2 = {bar: 'stay'};
    const data = {foo: [initialData1, initialData2]};
    property.deleteFromData(data)(initialData1);
    expect(data.foo.length).toEqual(1);
    expect(data.foo[0].bar).toEqual('stay');
    done();
  });

  test('self contained child schemata: cross recursion', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).toEqual('person');
    const personCopy = JSON.parse(JSON.stringify(schema.definitions.person));
    personCopy.id = '#' + (schema.properties.persons.items as JsonSchema).$ref;
    personCopy.definitions = JSON.parse(JSON.stringify(schema.definitions));
    expect(properties[0].schema).toMatchObject(personCopy);
    done();
  });
// real world examples
  test('support easy uml schema with arrays', done => {
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
    const properties = service.getContainmentProperties(schema);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).toEqual('classes');
    expect(properties[0].schema)
      .toMatchObject(schema.properties.classes.items as JsonSchema);
    const propertiesClasses =
      service.getContainmentProperties(schema.properties.classes.items as JsonSchema);
    expect(propertiesClasses.length).toEqual(1);
    expect(propertiesClasses[0].label).toEqual('attributes');
    expect(propertiesClasses[0].schema)
      .toMatchObject((schema.properties.classes.items as JsonSchema).properties.attributes.items);
    done();
  });
});
