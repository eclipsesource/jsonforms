import {
  isContainmentProperty,
  isReferenceProperty,
  SchemaService
} from '../../src/services/schema.service';
import { SchemaServiceImpl } from '../../src/services/schema.service.impl';
import { JsonSchema } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { EditorContext } from '../../src/editor-context';

let referenceObjectSchema;
let referenceArraySchema;
let referenceFindSchema;
beforeEach(() => {
  referenceObjectSchema = {
    definitions: {
      class: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          association: {
            type: 'string'
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
  };
  referenceArraySchema = {
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
              type: 'string'
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
  };
  referenceFindSchema = {
    definitions: {
      class: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          association: {
            type: 'string'
          }
        },
        links: [{
          rel: 'full',
          href: '#/classes/{association}',
          targetSchema: {$ref: '#/definitions/class'}
        }]
      },
      element : {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          }
        }
      }
    },
    type: 'object',
    properties: {
      classes: {
        type: 'array',
        items: {
          $ref: '#/definitions/class'
        }
      },
      elements: {
        type: 'array',
        items: {
          $ref: '#/definitions/element'
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

describe('Schema Service Reference Tests', () => {

  test('reference object properties add', done => {
    const schema: JsonSchema = referenceObjectSchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property = service.getReferenceProperties(schema.definitions.class)[0];
    expect(property.isIdBased()).toBe(true);
    const data = {classes: [{id: 'c1'}, {id: 'c2'}]};
    JsonForms.rootData = data;
    property.addToData(data.classes[1], data.classes[0]);
    // tslint:disable:no-string-literal
    expect(data.classes[1]['association']).toEqual('c1');
    // tslint:enable:no-string-literal
    done();
  });
  test.skip('reference object properties get', done => {
    const schema: JsonSchema = referenceObjectSchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property =
      service.getReferenceProperties(schema.properties.classes.items as JsonSchema)[0];
    expect(property.isIdBased()).toBe(true);
    const data = {classes: [{id: 'c1'}, {id: 'c2', association: 'c1'}]};
    JsonForms.rootData = data;
    const getData = property.getData(data.classes[1]);
    const keys = Object.keys(getData);
    expect(keys.length).toEqual(1);
    expect(keys[0]).toEqual('c1');
    expect(getData[keys[0]]).toEqual(data.classes[0]);
    done();
  });

  test('reference array properties add to undefined', done => {
    const schema: JsonSchema = referenceArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property =
      service.getReferenceProperties(schema.definitions.class)[0];
    expect(property.isIdBased()).toBe(true);
    const data = {classes: [{id: 'c1'}, {id: 'c2'}]};
    JsonForms.rootData = data;
    property.addToData(data.classes[1], data.classes[0]);
    // tslint:disable:no-string-literal
    const associations = data.classes[1]['associations'];
    // tslint:enable:no-string-literal
    expect(associations.length).toEqual(1);
    expect(associations[0]).toEqual('c1');
    done();
  });
  test('reference array properties add to defined', done => {
    const schema: JsonSchema = referenceArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property =
      service.getReferenceProperties(schema.definitions.class)[0];
    expect(property.isIdBased()).toBe(true);
    const data = {classes: [{id: 'c1'}, {id: 'c2', associations: []}]};
    JsonForms.rootData = data;
    property.addToData(data.classes[1], data.classes[0]);
    // tslint:disable:no-string-literal
    const associations = data.classes[1]['associations'];
    // tslint:enable:no-string-literal
    expect(associations.length).toEqual(1);
    expect(associations[0]).toEqual('c1');
    done();
  });
  test.skip('reference array properties get', done => {
    const schema: JsonSchema = referenceArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property =
      service.getReferenceProperties(schema.definitions.class)[0];
    expect(property.isIdBased()).toBe(true);
    const data = {classes: [{id: 'c1'}, {id: 'c2', associations: ['c1']}]};
    JsonForms.rootData = data;
    const getData = property.getData(data.classes[1]);
    const keys = Object.keys(getData);
    expect(keys.length).toEqual(1);
    expect(keys[0]).toEqual('c1');
    expect(getData[keys[0]]).toMatchObject(data.classes[0]);
    done();
  });
  test.skip('reference array properties get multiple', done => {
    const schema: JsonSchema = referenceArraySchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property =
      service.getReferenceProperties(schema.definitions.class)[0];
    expect(property.isIdBased()).toBe(true);
    const data = {classes: [{id: 'c1'}, {id: 'c2', associations: ['c1', 'c3']}, {id: 'c3'},
      {id: 'c4'}]};
    JsonForms.rootData = data;
    const getData = property.getData(data.classes[1]);
    const keys = Object.keys(getData);
    expect(keys.length).toEqual(2);
    expect(keys[0]).toEqual('c1');
    expect(keys[1]).toEqual('c3');
    expect(getData[keys[0]]).toMatchObject(data.classes[0]);
    expect(getData[keys[1]]).toMatchObject(data.classes[2]);
    done();
  });
  test.skip(`reference properties get - linking property's schema without type`, done => {
    const schema = {
      definitions: {
        class: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            association: {
              type: ''
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
    };

    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property =
      service.getReferenceProperties(schema.properties.classes.items as JsonSchema)[0];
    expect(property.isIdBased()).toBe(true);
    const data = {classes: [{id: 'c1'}, {id: 'c2', association: 'c1'}]};
    JsonForms.rootData = data;
    expect(property.getData(data.classes[1]))
      .toThrowError(`The schema of the property 'association' does not specify a schema type.`);
    done();
  });

  test.skip('reference property find reference targets', done => {
    const schema = referenceFindSchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property =
      service.getReferenceProperties(schema.properties.classes.items as JsonSchema)[0];
    expect(property.isIdBased()).toBe(true);
    const data = {
      classes: [{id: 'c1'}, {id: 'c2', association: 'c1'}],
      elements: [{id: 'e1'}]
    };
    JsonForms.rootData = data;
    const targets = property.findReferenceTargets();
    const keys = Object.keys(targets);
    expect(keys.length).toEqual(2);
    expect(keys[0]).toEqual('c1');
    expect(keys[1]).toEqual('c2');
    expect(targets[keys[0]]).toMatchObject(data.classes[0]);
    expect(targets[keys[1]]).toMatchObject(data.classes[1]);
    done();
  });
  test('reference property find reference targets - target container undefined', done => {
    const schema = referenceFindSchema;
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const property =
      service.getReferenceProperties(schema.properties.classes.items as JsonSchema)[0];
    expect(property.isIdBased()).toBe(true);
    const data = {
      elements: [{id: 'e1'}]
    };
    JsonForms.rootData = data;
    const targets = property.findReferenceTargets();
    expect(targets).toMatchObject({});
    done();
  });
  test.skip('reference property find reference targets - targets are subset of available objects.',
            done => {
      const schema = {
        definitions: {
          class: {
            type: 'object',
            id: '#class',
            properties: {
              id: {
                type: 'string'
              },
              association: {
                type: 'string'
              },
              type: {
                type: 'string',
                default: 'class'
              }
            },
            links: [{
              rel: 'full',
              href: '#/objects/{association}',
              targetSchema: {$ref: '#/definitions/class'}
            }]
          },
          element : {
            type: 'object',
            id: '#element',
            properties: {
              id: {
                type: 'string'
              },
              type: {
                type: 'string',
                default: 'element'
              }
            }
          }
        },
        type: 'object',
        properties: {
          objects: {
            type: 'array',
            items: {
              anyOf: [
                { $ref: '#/definitions/class' },
                { $ref: '#/definitions/element' }
              ]
            }
          }
        }
      };

      const context: EditorContext = {
        dataSchema: schema,
        modelMapping: {
          attribute: 'type',
          mapping: {
            'class': '#class',
            'element': '#element'
          }
        },
        identifyingProperty: ''
      };

      const service: SchemaService = new SchemaServiceImpl(context);
      JsonForms.modelMapping = {
        attribute: 'type',
        mapping: {
          'class': '#class',
          'element': '#element'
        }
      };
      const property = service.getReferenceProperties(schema.definitions.class as JsonSchema)[0];
      expect(property.isIdBased()).toBe(true);
      const data = {
        objects: [
          {id: 'c1', type: 'class'},
          {id: 'e1', type: 'element'},
          {id: 'c2', type: 'class'},
          {id: 'e2', type: 'element'}
        ]
      };
      JsonForms.rootData = data;

      const targets = property.findReferenceTargets();
      const keys = Object.keys(targets);
      expect(keys.length).toEqual(2);
      expect(keys[0]).toEqual('c1');
      expect(keys[1]).toEqual('c2');
      expect(targets[keys[0]]).toMatchObject(data.objects[0]);
      expect(targets[keys[1]]).toMatchObject(data.objects[1]);
      done();
    });

  test('property type check', done => {
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
    editorContext.dataSchema = schema;
    const service: SchemaService = new SchemaServiceImpl(editorContext);
    const refProperty =
      service.getReferenceProperties(schema.properties.classes.items as JsonSchema)[0];
    expect(isReferenceProperty(refProperty)).toBe(true);
    expect(isContainmentProperty(refProperty)).toBe(false);
    const containmentProperty = service.getContainmentProperties(schema)[0];
    expect(isReferenceProperty(containmentProperty)).toBe(false);
    expect(isContainmentProperty(containmentProperty)).toBe(true);
    done();
  });

});