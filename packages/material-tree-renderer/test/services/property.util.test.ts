/* ts-lint:disable:max-file-line-count */
import {
  findContainerProperties,
  makeSchemaSelfContained
} from '../../src/services/property.util';
import { JsonSchema7 } from '@jsonforms/core';
import * as _ from 'lodash';

describe('Property util', () => {
  test('should retrieve container property from a nested array (non primitive)', () => {
    const schema: JsonSchema7 = {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            foo: { type: 'string' }
          }
        }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties.length).toEqual(1);
    expect(properties).toMatchObject([
      {
        property: 'root',
        label: 'root',
        schema: { type: 'object', properties: { foo: { type: 'string' } } }
      }
    ]);
  });

  test('should retrieve container property from an array (non primitive)', () => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          foo: { type: 'string' }
        }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties).toMatchObject([
      {
        property: 'root',
        label: 'root',
        schema: {
          type: 'object',
          properties: {
            foo: { type: 'string' }
          }
        }
      }
    ]);
    expect(properties.length).toEqual(1);
  });

  test('should retrieve container property from object with array property (non primitive)', () => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              bar: { type: 'string' }
            }
          }
        }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties).toMatchObject([
      {
        property: 'foo',
        label: 'foo',
        schema: {
          type: 'object',
          properties: {
            bar: { type: 'string' }
          }
        }
      }
    ]);
  });

  test('should retrieve no container properties from object with arrays (all primitive)', () => {
    const schema = {
      type: 'object',
      properties: {
        strings: { type: 'array', items: { type: 'string' } },
        numbers: { type: 'array', items: { type: 'number' } },
        integers: { type: 'array', items: { type: 'integer' } },
        booleans: { type: 'array', items: { type: 'boolean' } }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties.length).toEqual(0);
  });

  test('should retrieve no container properties from object with tuple array', () => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'array',
          items: [
            {
              type: 'object',
              properties: {
                bar: { type: 'string' }
              }
            },
            {
              type: 'object',
              properties: {
                baz: { type: 'string' }
              }
            }
          ]
        }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties.length).toEqual(0);
  });

  test('should retrieve no container properties from object with primitive properties', () => {
    const schema = {
      type: 'object',
      properties: {
        string: { type: 'string' },
        number: { type: 'number' },
        integer: { type: 'integer' },
        boolean: { type: 'boolean' }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties.length).toEqual(0);
  });

  test('should retrieve no container properties from nested object with primitive properties', () => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'object',
          properties: {
            bar: { type: 'string' }
          }
        }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties.length).toEqual(0);
  });

  test('should retrieve container properties from objects with same $ref', () => {
    const schema: JsonSchema7 = {
      definitions: {
        person: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        }
      },
      type: 'object',
      properties: {
        friends: { type: 'array', items: { $ref: '#/definitions/person' } },
        enemies: { type: 'array', items: { $ref: '#/definitions/person' } }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties).toMatchObject([
      {
        property: 'friends',
        label: 'person',
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        }
      },
      {
        property: 'enemies',
        label: 'person',
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        }
      }
    ]);
  });

  test('should retrieve container properties from objects with different $ref', () => {
    const schema: JsonSchema7 = {
      definitions: {
        person: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        },
        robot: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        }
      },
      type: 'object',
      properties: {
        persons: { type: 'array', items: { $ref: '#/definitions/person' } },
        robots: { type: 'array', items: { $ref: '#/definitions/robot' } }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties).toMatchObject([
      {
        property: 'persons',
        label: 'person',
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        }
      },
      {
        property: 'robots',
        label: 'robot',
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        }
      }
    ]);
  });

  test('should retrieve no container properties object if no array object', () => {
    const schema: JsonSchema7 = {
      definitions: {
        a: { type: 'object' },
        b: { type: 'object' }
      },
      anyOf: [{ $ref: '#/definitions/a' }, { $ref: '#/definitions/b' }]
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties.length).toEqual(0);
  });

  test('should retrieve container properties from array of objects by using keyword anyOf', () => {
    const schema: JsonSchema7 = {
      definitions: {
        a: { type: 'object', properties: { foo: { type: 'string' } } },
        b: { type: 'object', properties: { foo: { type: 'string' } } }
      },
      type: 'array',
      items: {
        anyOf: [{ $ref: '#/definitions/a' }, { $ref: '#/definitions/b' }]
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties).toMatchObject([
      {
        property: 'root',
        label: 'a',
        schema: {
          type: 'object',
          properties: { foo: { type: 'string' } }
        }
      },
      {
        property: 'root',
        label: 'b',
        schema: {
          type: 'object',
          properties: { foo: { type: 'string' } }
        }
      }
    ]);
  });

  test('expect to retrieve properties from object with array object by using keyword anyOf', () => {
    const schema: JsonSchema7 = {
      definitions: {
        a: { type: 'object', properties: { foo: { type: 'string' } } },
        b: { type: 'object', properties: { foo: { type: 'string' } } }
      },
      type: 'object',
      properties: {
        elements: {
          type: 'array',
          items: {
            anyOf: [{ $ref: '#/definitions/a' }, { $ref: '#/definitions/b' }]
          }
        }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties).toMatchObject([
      {
        property: 'elements',
        label: 'a',
        schema: {
          type: 'object',
          properties: {
            foo: { type: 'string' }
          }
        }
      },
      {
        property: 'elements',
        label: 'b',
        schema: {
          properties: {
            foo: { type: 'string' }
          }
        }
      }
    ]);
  });

  test('expect to retrieve properties from object with array object by using keyword anyOf twice', () => {
    const schema: JsonSchema7 = {
      definitions: {
        a: { anyOf: [{ $ref: '#/definitions/b' }] },
        b: { type: 'object', properties: { foo: { type: 'string' } } }
      },
      type: 'object',
      properties: {
        elements: {
          type: 'array',
          items: {
            anyOf: [{ $ref: '#/definitions/a' }]
          }
        }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties).toMatchObject([
      {
        property: 'elements',
        label: 'b',
        schema: {
          properties: {
            foo: { type: 'string' }
          }
        }
      }
    ]);
  });

  test(
    'expect to retrieve properties from object with array object ' +
      'where anyOf contains reference and object',
    () => {
      const schema: JsonSchema7 = {
        definitions: {
          a: { type: 'object', properties: { foo: { type: 'string' } } }
        },
        type: 'object',
        properties: {
          elements: {
            type: 'array',
            items: {
              anyOf: [
                { $ref: '#/definitions/a' },
                { type: 'object', properties: { bar: { type: 'string' } } }
              ]
            }
          }
        }
      };

      const properties = findContainerProperties(schema, schema, false);
      expect(properties).toMatchObject([
        {
          property: 'elements',
          label: 'a',
          schema: {
            properties: {
              foo: { type: 'string' }
            }
          }
        },
        {
          property: 'elements',
          label: 'elements',
          schema: {
            properties: {
              bar: { type: 'string' }
            }
          }
        }
      ]);
    }
  );

  test('expect to retrieve properties from object with array object by using keyword anyOf recursive', () => {
    const schema: JsonSchema7 = {
      definitions: {
        a: {
          anyOf: [{ $ref: '#/definitions/b' }]
        },
        b: {
          anyOf: [{ $ref: '#/definitions/a' }, { $ref: '#/definitions/c' }],
          type: 'object',
          properties: { foo: { type: 'string' } }
        }
      },
      type: 'object',
      properties: {
        elements: {
          type: 'array',
          items: {
            anyOf: [{ $ref: '#/definitions/a' }]
          }
        }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties).toMatchObject([
      {
        property: 'elements',
        label: 'b',
        schema: {
          properties: {
            foo: { type: 'string' }
          }
        }
      }
    ]);
  });

  test('should retrieve container properties from object that references an array object', () => {
    const schema: JsonSchema7 = {
      definitions: {
        root: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' }
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

    const properties = findContainerProperties(schema, schema, false);
    expect(properties).toMatchObject([
      {
        property: 'roots',
        label: 'root',
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        }
      }
    ]);
  });

  test('should retrieve containers properties of objects with mutually recursive $refs', () => {
    const schema: JsonSchema7 = {
      definitions: {
        person: {
          type: 'object',
          properties: {
            robots: {
              type: 'array',
              items: { $ref: '#/definitions/robot' }
            }
          }
        },
        robot: {
          type: 'object',
          properties: {
            humans: {
              type: 'array',
              items: { $ref: '#/definitions/person' }
            }
          }
        }
      },
      type: 'object',
      properties: {
        persons: { type: 'array', items: { $ref: '#/definitions/person' } }
      }
    };

    const properties = findContainerProperties(schema, schema, false);
    expect(properties).toMatchObject([
      {
        property: 'persons',
        label: 'person',
        schema: {
          type: 'object',
          properties: {
            robots: {
              type: 'array',
              items: {
                $ref: '#/definitions/robot'
              }
            }
          },
          definitions: {
            robot: {
              type: 'object',
              properties: {
                humans: {
                  type: 'array',
                  items: {
                    $ref: '#/definitions/person'
                  }
                }
              }
            },
            person: {
              type: 'object',
              properties: {
                robots: {
                  type: 'array',
                  items: {
                    $ref: '#/definitions/robot'
                  }
                }
              }
            }
          }
        }
      }
    ]);
  });

  //
  // real world examples --
  //
  test('support simple UML-like schema with array objects', () => {
    const schema: JsonSchema7 = {
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
                type: 'string'
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

    const properties = findContainerProperties(schema, schema, false);
    expect(properties).toMatchObject([
      {
        property: 'classes',
        label: 'classes',
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            attributes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
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
    ]);
  });

  test('make UI sub schema self-contained', () => {
    const parentSchema: JsonSchema7 = {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [
            'HorizontalLayout',
            'VerticalLayout',
            'Group',
            'Categorization'
          ]
        },
        label: { type: 'string' },
        elements: { $ref: '#/definitions/elements' },
        rule: { $ref: '#/definitions/rule' }
      },
      definitions: {
        elements: {
          type: 'array',
          items: {
            anyOf: [
              { $ref: '#/definitions/control' },
              { $ref: '#/definitions/horizontallayout' },
              { $ref: '#/definitions/verticallayout' }
            ]
          }
        },
        control: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              default: 'Control'
            },
            label: { type: 'string' },
            scope: { $ref: '#/definitions/scope' },
            options: { $ref: '#/definitions/options' },
            rule: { $ref: '#/definitions/rule' }
          }
        },
        horizontallayout: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              default: 'HorizontalLayout'
            },
            elements: { $ref: '#/definitions/elements' },
            rule: { $ref: '#/definitions/rule' }
          }
        },
        verticallayout: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              default: 'VerticalLayout'
            },
            elements: { $ref: '#/definitions/elements' },
            rule: { $ref: '#/definitions/rule' }
          }
        },
        rule: {
          type: 'object',
          properties: {
            effect: {
              type: 'string',
              enum: ['HIDE', 'SHOW', 'DISABLE', 'ENABLE']
            },
            condition: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                scope: { $ref: '#/definitions/scope' },
                expectedValue: {
                  type: ['string', 'integer', 'number', 'boolean']
                }
              }
            }
          }
        },
        scope: {
          type: 'string',
          pattern: '^#\\/properties\\/{1}'
        },
        options: { type: 'object' }
      }
    };
    const schema = {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          const: 'Control',
          default: 'Control'
        },
        label: { type: 'string' },
        scope: { $ref: '#/definitions/scope' },
        options: { $ref: '#/definitions/options' },
        rule: { $ref: '#/definitions/rule' }
      }
    };
    const calculatedSchemaReferences = makeSchemaSelfContained(
      parentSchema,
      schema
    );
    const expectedSchema = {
      ...schema,
      ...{
        definitions: _.pick(parentSchema.definitions, [
          'scope',
          'options',
          'rule'
        ])
      }
    };
    expect(calculatedSchemaReferences).toMatchObject(expectedSchema);
  });

  test('make schema without references self-contained', () => {
    const parentSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'object',
          properties: {
            bar: { type: 'string' }
          }
        }
      }
    };
    const schema = {
      type: 'object',
      properties: {
        bar: { type: 'string' }
      }
    };
    const calculatedSchemaReferences = makeSchemaSelfContained(
      parentSchema,
      schema
    );
    expect(calculatedSchemaReferences).toMatchObject(schema);
  });

  test('make schema with missing reference definition self-contained', () => {
    const parentSchema: JsonSchema7 = {
      type: 'object',
      properties: {
        type: { type: 'string' },
        label: { type: 'string' },
        elements: { $ref: '#/definitions/elements' }
      }
    };
    const schema = {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          const: 'Control',
          default: 'Control'
        },
        label: { type: 'string' },
        scope: { $ref: '#/definitions/scope' }
      }
    };
    const calculatedSchemaReferences = makeSchemaSelfContained(
      parentSchema,
      schema
    );
    expect(calculatedSchemaReferences).toMatchObject(schema);
  });

  test('make schema with renamed definitions block self-contained', () => {
    const parentSchema = {
      type: 'object',
      properties: {
        type: { type: 'string' },
        label: { type: 'string' },
        elements: { $ref: '#/defs/elements' }
      },
      defs: {
        elements: {
          type: 'array',
          items: {
            anyOf: [
              { $ref: '#/defs/control' },
              { $ref: '#/defs/horizontallayout' }
            ]
          }
        },
        control: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              const: 'Control',
              default: 'Control'
            },
            label: { type: 'string' },
            scope: { $ref: '#/defs/scope' }
          }
        },
        horizontallayout: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              const: 'HorizontalLayout',
              default: 'HorizontalLayout'
            },
            elements: { $ref: '#/defs/elements' }
          }
        },
        scope: {
          type: 'string',
          pattern: '^#\\/properties\\/{1}'
        }
      }
    };
    const schema = {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          const: 'Control',
          default: 'Control'
        },
        label: { type: 'string' },
        scope: { $ref: '#/defs/scope' }
      }
    };
    const calculatedSchemaReferences = makeSchemaSelfContained(
      parentSchema,
      schema
    );
    const expectedSchema = {
      ...schema,
      ...{
        defs: _.pick(parentSchema.defs, ['scope'])
      }
    };
    expect(calculatedSchemaReferences).toMatchObject(expectedSchema);
  });

  test('Find properties by resolving circular references in a given schema ', () => {
    const schema: JsonSchema7 = {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['HorizontalLayout', 'VerticalLayout']
        },
        label: {
          type: 'string'
        },
        elements: {
          $ref: '#/definitions/elements'
        }
      },
      definitions: {
        elements: {
          type: 'array',
          items: {
            anyOf: [
              {
                $ref: '#/definitions/control'
              },
              {
                $ref: '#/definitions/horizontallayout'
              },
              {
                $ref: '#/definitions/verticallayout'
              }
            ]
          }
        },
        control: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              const: 'Control',
              default: 'Control'
            },
            label: {
              type: 'string'
            }
          }
        },
        horizontallayout: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              const: 'HorizontalLayout',
              default: 'HorizontalLayout'
            },
            elements: {
              $ref: '#/definitions/elements'
            }
          }
        },
        verticallayout: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              const: 'VerticalLayout',
              default: 'VerticalLayout'
            },
            elements: {
              $ref: '#/definitions/elements'
            }
          }
        }
      }
    };
    const properties = findContainerProperties(schema, schema, false);
    const expectedProperties = [
      {
        property: 'elements',
        label: 'control',
        schema: schema.definitions.control
      },
      {
        property: 'elements',
        label: 'horizontallayout',
        schema: {
          type: 'object',
          properties: schema.definitions.horizontallayout.properties,
          definitions: schema.definitions
        }
      },
      {
        property: 'elements',
        label: 'verticallayout',
        schema: {
          type: 'object',
          properties: schema.definitions.verticallayout.properties,
          definitions: schema.definitions
        }
      }
    ];
    expect(properties).toMatchObject(expectedProperties);
  });
});
