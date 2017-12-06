/* tslint:disable:max-file-line-count */
import { test } from 'ava';
import {
  isContainmentProperty,
  isReferenceProperty,
  SchemaService
} from '../src/core/schema.service';
import { SchemaServiceImpl } from '../src/core/schema.service.impl';
import { JsonSchema } from '../src/models/jsonSchema';
import { JsonForms } from '../src/core';

test.beforeEach(t => {
  t.context.fooBarArraySchema = {
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
test.failing('array with array ', t => {
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
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 1);
  t.is(properties[0].label, 'foo');
  t.deepEqual(properties[0].schema, schema.properties.foo.items as JsonSchema);
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
  t.deepEqual(properties[0].schema, schema.properties.foo.properties as JsonSchema);
});
test('support multiple same $ref', t => {
  const schema: JsonSchema = {
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
  };
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 2);
  t.is(properties[0].label, 'person');
  t.is(properties[1].label, 'person');
  const personCopy = JSON.parse(JSON.stringify(schema.definitions.person));
  personCopy.id = '#' + (schema.properties.friends.items as JsonSchema).$ref;
  t.deepEqual(properties[0].schema, personCopy);
  t.deepEqual(properties[1].schema, personCopy);
});
test('support multiple different $ref', t => {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 2);
  const personCopy = JSON.parse(JSON.stringify(schema.definitions.person));
  personCopy.id = '#' + (schema.properties.persons.items as JsonSchema).$ref;
  const robotCopy = JSON.parse(JSON.stringify(schema.definitions.robot));
  robotCopy.id = '#' + (schema.properties.robots.items as JsonSchema).$ref;
  t.is(properties[0].label, 'person');
  t.is(properties[1].label, 'robot');
  t.deepEqual(properties[0].schema, personCopy);
  t.deepEqual(properties[1].schema, robotCopy);
});
test.failing('support root anyOf', t => {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 2);
  t.is(properties[0].label, 'a');
  t.is(properties[1].label, 'b');
  t.deepEqual(properties[0].schema, schema.definitions.a as JsonSchema);
  t.deepEqual(properties[1].schema, schema.definitions.b as JsonSchema);
});
test('support array with anyOf', t => {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 2);
  t.is(properties[0].label, 'a');
  t.is(properties[1].label, 'b');
  const aCopy = JSON.parse(JSON.stringify(schema.definitions.a));
  aCopy.id = '#' + (schema.items as JsonSchema).anyOf[0].$ref;
  const bCopy = JSON.parse(JSON.stringify(schema.definitions.b));
  bCopy.id = '#' + (schema.items as JsonSchema).anyOf[1].$ref;
  t.deepEqual(properties[0].schema, aCopy);
  t.deepEqual(properties[1].schema, bCopy);
});
test('support object with array with anyOf', t => {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 2);
  t.is(properties[0].label, 'a');
  t.is(properties[1].label, 'b');
  const aCopy = JSON.parse(JSON.stringify(schema.definitions.a));
  aCopy.id = '#' + (schema.properties.elements.items as JsonSchema).anyOf[0].$ref;
  const bCopy = JSON.parse(JSON.stringify(schema.definitions.b));
  bCopy.id = '#' + (schema.properties.elements.items as JsonSchema).anyOf[1].$ref;
  t.deepEqual(properties[0].schema, aCopy);
  t.deepEqual(properties[1].schema, bCopy);
});
test('support for array references', t => {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties =
    service.getReferenceProperties(
      schema.definitions.class.properties.associations.items as JsonSchema);
  t.is(properties.length, 1);
  t.is(properties[0].label, 'id');
  const selfContainedClassSchema = JSON.parse(
    JSON.stringify(schema.definitions.class as JsonSchema)
  );
  selfContainedClassSchema.id = '#' + (schema.properties.classes.items as JsonSchema).$ref;
  t.deepEqual(properties[0].targetSchema, selfContainedClassSchema);
});

test('support for object references', t => {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties =
    service.getReferenceProperties(schema.definitions.class.properties.association);
  t.is(properties.length, 1);
  t.is(properties[0].label, 'id');

  const selfContainedClassSchema = JSON.parse(JSON.stringify(schema.definitions.class));
  selfContainedClassSchema.id = '#' + (schema.properties.classes.items as JsonSchema).$ref;
  t.deepEqual(properties[0].targetSchema, selfContainedClassSchema);
});
test('support object with array $ref', t => {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 1);
  t.is(properties[0].label, 'root');
  t.deepEqual(properties[0].schema, schema.definitions.root.items as JsonSchema);
});

test('containment properties add when array not defined', t => {
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const data = {
    foo: undefined
  };
  const valueToAdd = {bar: 'undefined array'};
  property.addToData(data)(valueToAdd);
  t.true(data.foo !== undefined);
  t.is(data.foo.length, 1);
  t.is(data.foo[0], valueToAdd);
});

test('containment properties add when array not defined and generate ID', t => {
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            bar: { type: 'string' }
          }
        }
      }
    }
  };

  JsonForms.config.setIdentifyingProp('_id');
  const service: SchemaService = new SchemaServiceImpl(schema);

  const property = service.getContainmentProperties(schema)[0];
  const data = {
    foo: undefined
  };
  const valueToAdd = { bar: `Hey Mum, look, it's an idea` };
  property.addToData(data)(valueToAdd);

  t.true(data.foo !== undefined);
  t.is(data.foo.length, 1);
  t.true(data.foo[0]._id !== undefined);
});

test('containment properties add when array defined', t => {
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const data = {foo: [{bar: 'initial'}]};
  const valueToAdd = {bar: 'defined array'};
  property.addToData(data)(valueToAdd);
  t.true(data.foo !== undefined);
  t.is(data.foo.length, 2);
  t.is(data.foo[1], valueToAdd);
});

test('containment properties add default with existing neighbour', t => {
  // expectation default === add after neighbour
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const firstValue = {bar: 'first'};
  const lastValue = {bar: 'last'};
  const data = {foo: [firstValue, lastValue]};
  const valueToAdd = {bar: 'defined array'};
  property.addToData(data)(valueToAdd, firstValue);
  t.true(data.foo !== undefined);
  t.is(data.foo.length, 3);
  t.is(data.foo[0], firstValue);
  t.is(data.foo[1], valueToAdd);
  t.is(data.foo[2], lastValue);
});

test('containment properties add after existing neighbour(not last in array)', t => {
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const firstValue = {bar: 'first'};
  const lastValue = {bar: 'last'};
  const data = {foo: [firstValue, lastValue]};
  const valueToAdd = {bar: 'defined array'};
  property.addToData(data)(valueToAdd, firstValue, true);
  t.true(data.foo !== undefined);
  t.is(data.foo.length, 3);
  t.is(data.foo[0], firstValue);
  t.is(data.foo[1], valueToAdd);
  t.is(data.foo[2], lastValue);
});
test('containment properties add after existing neighbour(last in array)', t => {
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const firstValue = {bar: 'first'};
  const lastValue = {bar: 'last'};
  const data = {foo: [firstValue, lastValue]};
  const valueToAdd = {bar: 'defined array'};
  property.addToData(data)(valueToAdd, lastValue, true);
  t.true(data.foo !== undefined);
  t.is(data.foo.length, 3);
  t.is(data.foo[0], firstValue);
  t.is(data.foo[1], lastValue);
  t.is(data.foo[2], valueToAdd);
});
test('containment properties add after non-existant neighbour', t => {
  // expectation: value is added at the end
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const firstValue = {bar: 'first'};
  const lastValue = {bar: 'last'};
  const notInArray = {bar: 'not in array'};
  const data = {foo: [firstValue, lastValue]};
  const valueToAdd = {bar: 'defined array'};
  property.addToData(data)(valueToAdd, notInArray, true);
  t.true(data.foo !== undefined);
  t.is(data.foo.length, 3);
  t.is(data.foo[0], firstValue);
  t.is(data.foo[1], lastValue);
  t.is(data.foo[2], valueToAdd);
});
test('containment properties add before existing neighbour(not first in array)', t => {
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const firstValue = {bar: 'first'};
  const lastValue = {bar: 'last'};
  const data = {foo: [firstValue, lastValue]};
  const valueToAdd = {bar: 'defined array'};
  property.addToData(data)(valueToAdd, lastValue, false);
  t.true(data.foo !== undefined);
  t.is(data.foo.length, 3);
  t.is(data.foo[0], firstValue);
  t.is(data.foo[1], valueToAdd);
  t.is(data.foo[2], lastValue);
});
test('containment properties add before existing neighbour(first in array)', t => {
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const firstValue = {bar: 'first'};
  const lastValue = {bar: 'last'};
  const data = {foo: [firstValue, lastValue]};
  const valueToAdd = {bar: 'defined array'};
  property.addToData(data)(valueToAdd, firstValue, false);
  t.true(data.foo !== undefined);
  t.is(data.foo.length, 3);
  t.is(data.foo[0], valueToAdd);
  t.is(data.foo[1], firstValue);
  t.is(data.foo[2], lastValue);
});
test('containment properties add before non-existant neighbour', t => {
  // expectation: value is added at the end
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const firstValue = {bar: 'first'};
  const lastValue = {bar: 'last'};
  const notInArray = {bar: 'not in array'};
  const data = {foo: [firstValue, lastValue]};
  const valueToAdd = {bar: 'defined array'};
  property.addToData(data)(valueToAdd, notInArray, false);
  t.true(data.foo !== undefined);
  t.is(data.foo.length, 3);
  t.is(data.foo[0], firstValue);
  t.is(data.foo[1], lastValue);
  t.is(data.foo[2], valueToAdd);
});
test('containment properties get when array not defined', t => {
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const data = {};
  const getData = property.getData(data);
  t.true(getData === undefined);
});
test('containment properties get when array defined', t => {
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const data = {foo: [{bar: 'initial'}]};
  const getData = property.getData(data);
  t.is(getData, data.foo);
});
test('containment properties delete when array not defined', t => {
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const data = {};
  const valueToDelete = {bar: 'undefined array'};
  property.deleteFromData(data)(valueToDelete);
  t.true(data !== undefined);
});
test('containment properties delete when array defined', t => {
  const schema = t.context.fooBarArraySchema;
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getContainmentProperties(schema)[0];
  const initialData1 = {bar: 'delete'};
  const initialData2 = {bar: 'stay'};
  const data = {foo: [initialData1, initialData2]};
  property.deleteFromData(data)(initialData1);
  t.is(data.foo.length, 1);
  t.is(data.foo[0].bar, 'stay');
});
test('reference object properties add', t => {
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
            type: 'integer',
            minimum: 0
          }
        },
        links: [{
          rel: 'full',
          href: '#/classes/{association}',
          targetSchema: {$ref: '#/definitions/class'}
        }]
      }
    },
    type: 'object',
    properties: {
      classes: {
        type: 'array',
        items: {
          $ref: '#/definitions/class'
        }
      }
    }
  } as JsonSchema;
  // tslint:enable:no-object-literal-type-assertion
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getReferenceProperties(schema.definitions.class)[0];
  const data = {classes: [{id: 1}, {id: 2}]};
  property.addToData(data, data.classes[1], data.classes[0]);
  // tslint:disable:no-string-literal
  t.is(data.classes[1]['association'], 0);
  // tslint:enable:no-string-literal
});
test('reference object properties get', t => {
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
            type: 'integer',
            minimum: 0
          }
        },
        links: [{
          rel: 'full',
          href: '#/classes/{association}',
          targetSchema: {$ref: '#/definitions/class'}
        }]
      }
    },
    type: 'object',
    properties: {
      classes: {
        type: 'array',
        items: {
          $ref: '#/definitions/class'
        }
      }
    }
  } as JsonSchema;
  // tslint:enable:no-object-literal-type-assertion
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property = service.getReferenceProperties(schema.properties.classes.items as JsonSchema)[0];
  const data = {classes: [{id: 1}, {id: 2, association: 0}]};
  const getData = property.getData(data, data.classes[1]);
  t.is(getData, data.classes[0]);
});
test('reference array properties add to undefined', t => {
  // tslint:disable:no-object-literal-type-assertion
  const schema: JsonSchema = {
    definitions: {
      class: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          associations: {
            type: 'array',
            items: {
              type: 'integer',
              minimum: 0
            }
          }
        },
        links: [{
          rel: 'full',
          href: '#/classes/{associations}',
          targetSchema: {$ref: '#/definitions/class'}
        }]
      }
    },
    type: 'object',
    properties: {
      classes: {
        type: 'array',
        items: {
          $ref: '#/definitions/class'
        }
      }
    }
  } as JsonSchema;
  // tslint:enable:no-object-literal-type-assertion
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property =
    service.getReferenceProperties(schema.definitions.class)[0];
  const data = {classes: [{id: 1}, {id: 2}]};
  property.addToData(data, data.classes[1], data.classes[0]);
  // tslint:disable:no-string-literal
  const associations = data.classes[1]['associations'];
  // tslint:enable:no-string-literal
  t.is(associations.length, 1);
  t.is(associations[0], 0);
});
test('reference array properties add to defined', t => {
  // tslint:disable:no-object-literal-type-assertion
  const schema: JsonSchema = {
    definitions: {
      class: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          associations: {
            type: 'array',
            items: {
              type: 'integer',
              minimum: 0
            }
          }
        },
        links: [{
          rel: 'full',
          href: '#/classes/{associations}',
          targetSchema: {$ref: '#/definitions/class'}
        }]
      }
    },
    type: 'object',
    properties: {
      classes: {
        type: 'array',
        items: {
          $ref: '#/definitions/class'
        }
      }
    }
  } as JsonSchema;
  // tslint:enable:no-object-literal-type-assertion
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property =
    service.getReferenceProperties(schema.definitions.class)[0];
  const data = {classes: [{id: 1}, {id: 2, associations: []}]};
  property.addToData(data, data.classes[1], data.classes[0]);
  // tslint:disable:no-string-literal
  const associations = data.classes[1]['associations'];
  // tslint:enable:no-string-literal
  t.is(associations.length, 1);
  t.is(associations[0], 0);
});
test('reference array properties get', t => {
  // tslint:disable:no-object-literal-type-assertion
  const schema: JsonSchema = {
    definitions: {
      class: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          associations: {
            type: 'array',
            items: {
              type: 'integer',
              minimum: 0
            }
          }
        },
        links: [{
          rel: 'full',
          href: '#/classes/{associations}',
          targetSchema: {$ref: '#/definitions/class'}
        }]
      }
    },
    type: 'object',
    properties: {
      classes: {
        type: 'array',
        items: {
          $ref: '#/definitions/class'
        }
      }
    }
  } as JsonSchema;
  // tslint:enable:no-object-literal-type-assertion
  const service: SchemaService = new SchemaServiceImpl(schema);
  const property =
    service.getReferenceProperties(schema.definitions.class)[0];
  const data = {classes: [{id: 1}, {id: 2, associations: [0]}]};
  const getData = property.getData(data, data.classes[1]);
  t.is(getData, data.classes[0]);
});

test('property type check', t => {
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
            type: 'integer',
            minimum: 0
          }
        },
        links: [{
          rel: 'full',
          href: '#/classes/{association}',
          targetSchema: {$ref: '#/definitions/class'}
        }]
      }
    },
    type: 'object',
    properties: {
      classes: {
        type: 'array',
        items: {
          $ref: '#/definitions/class'
        }
      }
    }
  } as JsonSchema;
  // tslint:enable:no-object-literal-type-assertion
  const service: SchemaService = new SchemaServiceImpl(schema);
  const refProperty =
    service.getReferenceProperties(schema.properties.classes.items as JsonSchema)[0];
  t.true(isReferenceProperty(refProperty));
  t.false(isContainmentProperty(refProperty));
  const containmentProperty = service.getContainmentProperties(schema)[0];
  t.false(isReferenceProperty(containmentProperty));
  t.true(isContainmentProperty(containmentProperty));
});
test('self contained child schemata: cross recursion', t => {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 1);
  t.is(properties[0].label, 'person');
  const selfContainedPerson = JSON.parse(JSON.stringify(schema.definitions.person));
  selfContainedPerson.definitions = {robot: schema.definitions.robot};
  selfContainedPerson.definitions.robot.properties.humans.items.$ref = '#';
  selfContainedPerson.id = '#' + (schema.properties.persons.items as JsonSchema).$ref;
  t.deepEqual(properties[0].schema, selfContainedPerson);
});
// real world examples
test('support easy uml schema with arrays', t => {
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
  const service: SchemaService = new SchemaServiceImpl(schema);
  const properties = service.getContainmentProperties(schema);
  t.is(properties.length, 1);
  t.is(properties[0].label, 'classes');
  t.deepEqual(properties[0].schema, schema.properties.classes.items as JsonSchema);

  const propertiesClasses =
    service.getContainmentProperties(schema.properties.classes.items as JsonSchema);
  t.is(propertiesClasses.length, 1);
  t.is(propertiesClasses[0].label, 'attributes');
  t.deepEqual(
    propertiesClasses[0].schema,
    (schema.properties.classes.items as JsonSchema).properties.attributes.items
  );
});
