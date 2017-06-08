import test from 'ava';

import { JsonSchema } from '../src/models/jsonSchema';
import { SchemaExtractor } from '../src/parser/schema_extractor';
import { ItemModel, isItemModel, isMultipleItemModel, MULTIPLICITY_TYPES, ITEM_MODEL_TYPES } from
  '../src/parser/item_model';

test('support root array with object', t => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {type: 'string'}
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {
          label: 'array',
          schema:
          {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          },
          dropPoints: {},
          attributes: {
            name: {
              label: 'name',
              schema: {type: 'string'},
              dropPoints: {},
              attributes: {},
              type: 1
            }
          },
          type: 1
        });
    });
});
test('support root array with array', t => {
    const schema = {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'object'
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      const itemModel = <ItemModel>result;
      t.deepEqual(itemModel, {
          label: 'array',
          schema: {
            type: 'array',
            items: {
              type: 'object'
            }
          },
          dropPoints: {
            'array': {
              label: 'array',
              schema: {type: 'object'},
              dropPoints: {},
              attributes: {},
              type: ITEM_MODEL_TYPES.ARRAY
            }
          },
          attributes: {},
          type: ITEM_MODEL_TYPES.ARRAY
        });
    });
});
test('no support for tuple array ', t => {
    const schema_stringarray = {
      type: 'array',
      items: [
        {type: 'string'}, {type: 'boolean'}
      ]
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'array',
            items: [
              {type: 'string'}, {type: 'boolean'}
            ]
          },
          dropPoints: {},
          attributes: {},
          type: 0
        });
    });
});
test('no support for simple string array ', t => {
    const schema_stringarray = {
      type: 'array',
      items: {
        type: 'string'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          dropPoints: {},
          attributes: {},
          type: 0
        });
    });
});
test('no support for simple number array ', t => {
    const schema_numberarray = {
      type: 'array',
      items: {
        type: 'number'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_numberarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'array',
            items: {
              type: 'number'
            }
          },
          dropPoints: {},
          attributes: {},
          type: 0
        });
    });
});
test('no support for simple integer array ', t => {
    const schema_integerarray = {
      type: 'array',
      items: {
        type: 'integer'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_integerarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'array',
            items: {
              type: 'integer'
            }
          },
          dropPoints: {},
          attributes: {},
          type: 0
        });
    });
});
test('no support for simple boolean array ', t => {
    const schema_booleanarray = {
      type: 'array',
      items: {
        type: 'boolean'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_booleanarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'array',
            items: {
              type: 'boolean'
            }
          },
          dropPoints: {},
          attributes: {},
          type: 0
        });
    });
});
test('root object simple properties are ignored', t => {
    const schema = {
      type: 'object',
      properties: {
        string: {type: 'string'},
        number: {type: 'number'},
        integer: {type: 'integer'},
        boolean: {type: 'boolean'}
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
            type: 'object',
            properties: {
              string: {type: 'string'},
              number: {type: 'number'},
              integer: {type: 'integer'},
              boolean: {type: 'boolean'}
            }
          },
          dropPoints: {},
          attributes: {
            string: {label: 'string', schema: {type: 'string'}, dropPoints: {},
              attributes: {}, type: 0},
            number: {label: 'number', schema: {type: 'number'}, dropPoints: {},
              attributes: {}, type: 0},
            integer: {label: 'integer', schema: {type: 'integer'}, dropPoints: {},
              attributes: {}, type: 0},
            boolean: {label: 'boolean', schema: {type: 'boolean'}, dropPoints: {},
              attributes: {}, type: 0}
          },
          type: 0
        });
    });
});
test('root object object properties is dropPoint', t => {
    const schema = {
      type: 'object',
      properties: {
        object: {type: 'object'}
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
            type: 'object',
            properties: {
              object: {type: 'object'}
            }
          },
          dropPoints: {
            object: {
              label: 'object',
              schema: {type: 'object'},
              dropPoints: {},
              attributes: {},
              type: 2
            }
          },
          attributes: {},
          type: 0
        });
    });
});
test('support root object with array of object', t => {
    const schema = {
      type: 'object',
      properties: {
        myarray: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            properties: {
              myarray: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {type: 'string'}
                  }
                }
              }
            }
          },
          dropPoints: {
            'myarray':
              {
                label: 'myarray',
                schema:
                {
                  type: 'object',
                  properties: {
                    name: {type: 'string'}
                  }
                },
                dropPoints: {},
                attributes: {
                  name: {
                    label: 'name',
                    schema: {type: 'string'},
                    dropPoints: {},
                    attributes: {},
                    type: 1
                  }
                },
                type: 1
              }
            },
            attributes: {},
            type: 0
        });
    });
});
test('support root object with object of objects', t => {
    const schema = {
      type: 'object',
      properties: {
        myObject: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            properties: {
              myObject: {
                type: 'object',
                additionalProperties: {
                  type: 'object',
                  properties: {
                    name: {type: 'string'}
                  }
                }
              }
            }
          },
          dropPoints: {
            'myObject':
              {
                label: 'myObject',
                schema:
                {
                  type: 'object',
                  properties: {
                    name: {type: 'string'}
                  }
                },
                dropPoints: {},
                attributes: {
                  name: {
                    label: 'name',
                    schema: {type: 'string'},
                    dropPoints: {},
                    attributes: {},
                    type: 2
                  }
                },
                type: 2
              }
            },
            attributes: {},
            type: 0
        });
    });
});
test('support object with additionalProperties', t => {
    const schema = {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          name: {type: 'string'}
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {
        label: 'root',
        schema: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }
        },
        dropPoints: {
          'object': {
            label: 'object',
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            },
            dropPoints: {},
            attributes: {
              name: {
                label: 'name',
                schema: {type: 'string'},
                dropPoints: {},
                attributes: {},
                type: 2
              }
            },
            type: 2
          }
        },
        attributes: {},
        type: 0
      });
    });
});
test('no support for simple string additionalProperties ', t => {
    const schema_stringarray = {
      type: 'object',
      additionalProperties: {
        type: 'string'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            additionalProperties: {
              type: 'string'
            }
          },
          dropPoints: {},
          attributes: {},
          type: 0
        });
    });
});
test('no support for simple number additionalProperties ', t => {
    const schema_stringarray = {
      type: 'object',
      additionalProperties: {
        type: 'number'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            additionalProperties: {
              type: 'number'
            }
          },
          dropPoints: {},
          attributes: {},
          type: 0
        });
    });
});
test('no support for simple integer additionalProperties ', t => {
    const schema_stringarray = {
      type: 'object',
      additionalProperties: {
        type: 'integer'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            additionalProperties: {
              type: 'integer'
            }
          },
          dropPoints: {},
          attributes: {},
          type: 0
        });
    });
});
test('no support for simple boolean additionalProperties ', t => {
    const schema_stringarray = {
      type: 'object',
      additionalProperties: {
        type: 'boolean'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            additionalProperties: {
              type: 'boolean'
            }
          },
          dropPoints: {},
          attributes: {},
          type: 0
        });
    });
});
test('support root $ref, this is actually invalid', t => {
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
      $ref: '#/definitions/root'
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {
        label: 'array',
        schema: {
          type: 'object',
          properties: {
            name: {type: 'string'}
          }
        },
        dropPoints: {},
        attributes: {
          name: {
            label: 'name',
            schema: {type: 'string'},
            dropPoints: {},
            attributes: {},
            type: 1
          }
        },
        type: 1
      });
    });
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
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {label: 'root', schema: {
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
      },
        dropPoints: {
          'friends': {
            label: 'person',
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            },
            dropPoints: {},
            attributes: {
              name: {
                label: 'name',
                schema: {type: 'string'},
                dropPoints: {},
                attributes: {},
                type: 1
              }
            },
            type: 1
          },
          'enemies': {
            label: 'person',
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            },
            dropPoints: {},
            attributes: {
              name: {
                label: 'name',
                schema: {type: 'string'},
                dropPoints: {},
                attributes: {},
                type: 1
              }
            },
            type: 1
        }
      },
      attributes: {},
      type: 0
      });
    });
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
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {label: 'root', schema: {
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
      },
      dropPoints: {
        'persons': {
          label: 'person', schema: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }, dropPoints: {}, attributes: {
            name: {
              label: 'name',
              schema: {type: 'string'},
              dropPoints: {},
              attributes: {},
              type: 1
            }
          },
          type: 1
        },
        'robots': {label: 'robot', schema: {
          type: 'object',
          properties: {
            id: {type: 'string'}
          }
        }, dropPoints: {}, attributes: {
          id: {
            label: 'id',
            schema: {type: 'string'},
            dropPoints: {},
            attributes: {},
            type: 1
          }
        },
        type: 1}
      },
      attributes: {},
      type: 0
    });
    });
});
test('support object with additionalProperties and $ref', t => {
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
      additionalProperties: {
        $ref: '#/definitions/person'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {
        label: 'root',
        schema: {
          definitions: {
            person: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            }
          },
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/person'
          }
        },
        dropPoints: {
          'object': {
            label: 'person',
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            },
            dropPoints: {},
            attributes: {
              name: {
                label: 'name',
                schema: {type: 'string'},
                dropPoints: {},
                attributes: {},
                type: 2
              }
            },
            type: 2
          }
        },
        attributes: {},
        type: 0
      });
    });
});
test('support root anyOf', t => {
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
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isMultipleItemModel(result));
      t.deepEqual(result, {type: MULTIPLICITY_TYPES.ANY_OF, models: [
        {label: 'a', schema: {type: 'object'}, dropPoints: {}, attributes: {}, type: 0},
        {label: 'b', schema: {type: 'object'}, dropPoints: {}, attributes: {}, type: 0}
      ]});
    });
});
test('support array with anyOf', t => {
    const schema = {
      definitions: {
        a: {type: 'object'},
        b: {type: 'object'}
      },
      type: 'array',
      items: {
        anyOf: [
          {$ref: '#/definitions/a'},
          {$ref: '#/definitions/b'}
        ]
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isMultipleItemModel(result));
      t.deepEqual(result, {
        type: MULTIPLICITY_TYPES.ANY_OF,
        models: [
          {label: 'a', schema: {type: 'object'}, dropPoints: {}, attributes: {}, type: 1},
          {label: 'b', schema: {type: 'object'}, dropPoints: {}, attributes: {}, type: 1}
        ]
      });
    });
});
test('support object with array with anyOf', t => {
    const schema = {
      definitions: {
        a: {type: 'object'},
        b: {type: 'object'}
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
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {label: 'root', schema: {
        definitions: {
          a: {type: 'object'},
          b: {type: 'object'}
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
      },
      dropPoints: {
        elements: {
          type: MULTIPLICITY_TYPES.ANY_OF, models: [
            {label: 'a', schema: {type: 'object'}, dropPoints: {}, attributes: {}, type: 1},
            {label: 'b', schema: {type: 'object'}, dropPoints: {}, attributes: {}, type: 1}
          ]
        }
      }, attributes: {}, type: 0
    });
  });
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
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
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
          },
          dropPoints: {
            'classes':
              {
                label: 'classes',
                schema: {
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
                },
                dropPoints: {
                  attributes: {
                    label: 'attributes',
                    schema: {
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
                    },
                    dropPoints: {},
                    attributes: {
                      name: {
                        label: 'name',
                        schema: {type: 'string'},
                        dropPoints: {},
                        attributes: {},
                        type: 1
                      },
                      type: {
                        label: 'type',
                        schema: {type: 'string', enum: ['string', 'integer']},
                        dropPoints: {},
                        attributes: {},
                        type: 1
                      }
                    },
                    type: 1
                  }
                },
                attributes: {
                  name: {
                    label: 'name',
                    schema: {type: 'string'},
                    dropPoints: {},
                    attributes: {},
                    type: 1
                  }
                },
                type: 1
              }
          },
          attributes: {
            name: {
              label: 'name',
              schema: {type: 'string'},
              dropPoints: {},
              attributes: {},
              type: 0
            }
          },
          type: 0
        });
    });
});
test('support easy uml schema with object', t => {
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
                'type': 'object',
                'additionalProperties': {
                  'type': 'object',
                  'properties': {
                    'visibility': {
                      'type': 'string',
                      'enum': ['Public', 'Private', 'Protected']
                    },
                    'type': {
                      'type': 'string',
                      'enum': ['Boolean', 'Integer', 'Real', 'String']
                    }
                  },
                  'additionalProperties': false
                }
              }
            }
          }
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
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
                      'type': 'object',
                      'additionalProperties': {
                        'type': 'object',
                        'properties': {
                          'visibility': {
                            'type': 'string',
                            'enum': ['Public', 'Private', 'Protected']
                          },
                          'type': {
                            'type': 'string',
                            'enum': ['Boolean', 'Integer', 'Real', 'String']
                          }
                        },
                        'additionalProperties': false
                      }
                    }
                  }
                }
              }
            }
          },
          dropPoints: {
            'classes':
              {
                label: 'classes',
                schema: {
                  'type': 'object',
                  'properties': {
                    'name': {
                      'type': 'string'
                    },
                    'attributes': {
                      'type': 'object',
                      'additionalProperties': {
                        'type': 'object',
                        'properties': {
                          'visibility': {
                            'type': 'string',
                            'enum': ['Public', 'Private', 'Protected']
                          },
                          'type': {
                            'type': 'string',
                            'enum': ['Boolean', 'Integer', 'Real', 'String']
                          }
                        },
                        'additionalProperties': false
                      }
                    }
                  }
                },
                dropPoints: {
                  attributes: {
                    label: 'attributes',
                    schema: {
                      'type': 'object',
                      'properties': {
                        'visibility': {
                          'type': 'string',
                          'enum': ['Public', 'Private', 'Protected']
                        },
                        'type': {
                          'type': 'string',
                          'enum': ['Boolean', 'Integer', 'Real', 'String']
                        }
                      },
                      'additionalProperties': false
                    },
                    dropPoints: {},
                    attributes: {
                      visibility: {
                        label: 'visibility',
                        schema: {type: 'string', enum: ['Public', 'Private', 'Protected']},
                        dropPoints: {},
                        attributes: {},
                        type: 2
                      },
                      type: {
                        label: 'type',
                        schema: {type: 'string', enum: ['Boolean', 'Integer', 'Real', 'String']},
                        dropPoints: {},
                        attributes: {},
                        type: 2
                      }
                    },
                    type: ITEM_MODEL_TYPES.OBJECT
                  }
                },
                attributes: {
                  name: {
                    label: 'name',
                    schema: {type: 'string'},
                    dropPoints: {},
                    attributes: {},
                    type: 1
                  }
                },
                type: ITEM_MODEL_TYPES.ARRAY
              }
          },
          attributes: {
            name: {
              label: 'name',
              schema: {type: 'string'},
              dropPoints: {},
              attributes: {},
              type: 0
            }
          },
          type: ITEM_MODEL_TYPES.ROOT
        } as ItemModel);
    });
});
test('support easy uischema control', t => {
  const schema = {
    'definitions': {
      'control': {
        'type': 'object',
        'properties': {
          'type': {
            'type': 'string',
            'enum': ['Control']
          },
          'label': { 'type': 'string' },
          'scope': {
            'type': 'object',
            'properties': {
              '$ref': { 'type': 'string' }
            }
          },
          'readOnly': { 'type': 'boolean' }
        },
        'required': ['type', 'scope'],
        'additionalProperties': false
      }
    },
    '$ref': '#/definitions/control'
  } as JsonSchema;
  const extractor = new SchemaExtractor(schema);
  return extractor.extract().then(result => {
    t.true(isItemModel(result));
    t.deepEqual(result, {
      label: 'control',
      schema: {
        'type': 'object',
        'properties': {
          'type': {
            'type': 'string',
            'enum': ['Control']
          },
          'label': { 'type': 'string' },
          'scope': {
            'type': 'object',
            'properties': {
              '$ref': { 'type': 'string' }
            }
          },
          'readOnly': { 'type': 'boolean' }
        },
        'required': ['type', 'scope'],
        'additionalProperties': false
      },
      dropPoints: {
        scope: {
          label: 'scope',
          schema: {
            'type': 'object',
            'properties': {
              '$ref': { 'type': 'string' }
            }
          },
          dropPoints: {},
          attributes: {
            '$ref': {
              label: '$ref',
              schema: {type: 'string'},
              dropPoints: {},
              attributes: {},
              type: 2
            }
          },
          type: 2
        }
      },
      attributes: {
        label: {
          label: 'label',
          schema: {type: 'string'},
          dropPoints: {},
          attributes: {},
          type: 0
        },
        readOnly: {
          label: 'readOnly',
          schema: {type: 'boolean'},
          dropPoints: {},
          attributes: {},
          type: 0
        },
        type: {
          label: 'type',
          schema: {'type': 'string', 'enum': ['Control']},
          dropPoints: {},
          attributes: {},
          type: 0
        }
      },
      type: 0
    });
  });
});
test('support easy uischema layout, actually invalid', t => {
  const schema = {
    'definitions': {
      'layout': {
        'type': 'object',
        'properties': {
          'type': {
            'type': 'string',
            'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
          },
          'label': { 'type': 'string' },
          'elements': {
            'type': 'array',
            'items': {
              'anyOf': [
                {'$ref': '#/definitions/layout'}
              ]
            }
          }
        },
        'required': ['type', 'elements'],
        'additionalProperties': false
      }
    },
    '$ref': '#/definitions/layout'
  } as JsonSchema;
  const extractor = new SchemaExtractor(schema);
  return extractor.extract().then(result => {
    t.true(isItemModel(result));
    const layout = {
      label: 'layout',
      schema: {
        'type': 'object',
        'properties': {
          'type': {
            'type': 'string',
            'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
          },
          'label': { 'type': 'string' },
          'elements': {
            'type': 'array',
            'items': {
              'anyOf': [
                {'$ref': '#'} // after clean up {'$ref': '#/definitions/layout'}
              ]
            }
          }
        },
        'required': ['type', 'elements'],
        'additionalProperties': false
      },
      dropPoints: {
        elements: {
          models: [],
          type: MULTIPLICITY_TYPES.ANY_OF
        }
      },
      attributes: {
        label: {
          label: 'label',
          schema: {type: 'string'},
          dropPoints: {},
          attributes: {},
          type: 0
        },
        type: {
          label: 'type',
          schema: {'type': 'string', 'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']},
          dropPoints: {},
          attributes: {},
          type: 0
        }
      },
      type: ITEM_MODEL_TYPES.ROOT
    } as ItemModel;
    layout.dropPoints.elements['models'].push(layout);
    t.deepEqual(result, layout);
  });
});
test.failing('support easy uischema, actually invalid', t => {
    const schema = {
      'definitions': {
        'control': {
          'type': 'object',
          'properties': {
            'type': {
              'type': 'string',
              'enum': ['Control']
            },
            'label': { 'type': 'string' },
            'scope': {
              'type': 'object',
              'properties': {
                '$ref': { 'type': 'string' }
              }
            },
            'readOnly': { 'type': 'boolean' }
          },
          'required': ['type', 'scope'],
          'additionalProperties': false
        },
        'layout': {
          'type': 'object',
          'properties': {
            'type': {
              'type': 'string',
              'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
            },
            'label': { 'type': 'string' },
            'elements': {
              'type': 'array',
              'items': {
                'anyOf': [
                  {'$ref': '#/definitions/control'},
                  {'$ref': '#/definitions/layout'}
                ]
              }
            }
          },
          'required': ['type', 'elements'],
          'additionalProperties': false
        }
      },
      '$ref': '#/definitions/layout'
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      const layout = {
        label: 'layout',
        schema: {
          'type': 'object',
          'properties': {
            'type': {
              'type': 'string',
              'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
            },
            'label': { 'type': 'string' },
            'elements': {
              'type': 'array',
              'items': {
                'anyOf': [
                  {'$ref': '#/definitions/control'},
                  {'$ref': '#/definitions/layout'}
                ]
              }
            }
          },
          'required': ['type', 'elements'],
          'additionalProperties': false
        },
        dropPoints: {
          elements: {
            models: [
              {
                label: 'control',
                schema: {
                  'type': 'object',
                  'properties': {
                    'type': {
                      'type': 'string',
                      'enum': ['Control']
                    },
                    'label': { 'type': 'string' },
                    'scope': {
                      'type': 'object',
                      'properties': {
                        '$ref': { 'type': 'string' }
                      }
                    },
                    'readOnly': { 'type': 'boolean' }
                  },
                  'required': ['type', 'scope'],
                  'additionalProperties': false
                },
                dropPoints: {
                  scope: {
                    label: 'scope',
                    schema: {
                      'type': 'object',
                      'properties': {
                        '$ref': { 'type': 'string' }
                      }
                    },
                    dropPoints: {},
                    attributes: {
                      '$ref': {
                        label: '$ref',
                        schema: {type: 'string'},
                        dropPoints: {},
                        attributes: {},
                        type: 2
                      }
                    },
                    type: ITEM_MODEL_TYPES.OBJECT
                  }
                },
                attributes: {
                  label: {
                    label: 'label',
                    schema: {type: 'string'},
                    dropPoints: {},
                    attributes: {},
                    type: 1
                  },
                  type: {
                    label: 'type',
                    schema:
                      {'type': 'string', 'enum': ['Control']},
                    dropPoints: {},
                    attributes: {},
                    type: 1
                  },
                  readOnly: {
                    label: 'readOnly',
                    schema: {type: 'boolean'},
                    dropPoints: {},
                    attributes: {},
                    type: 1
                  }
                },
                type: ITEM_MODEL_TYPES.ARRAY
              }
            ],
            type: MULTIPLICITY_TYPES.ANY_OF}
        },
        attributes: {
          label: {
            label: 'label',
            schema: {type: 'string'},
            dropPoints: {},
            attributes: {},
            type: 0
          },
          type: {
            label: 'type',
            schema: {'type': 'string', 'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']},
            dropPoints: {},
            attributes: {},
            type: 0
          }
        },
        type: ITEM_MODEL_TYPES.ROOT
      } as ItemModel;
      layout.dropPoints.elements['models'].push(layout);
      t.deepEqual(result, layout);
    });
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
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      const classSchema = {
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
      };
      const classModel = {
        label: 'class',
        schema: classSchema,
        dropPoints: {
          associations: {
            label: 'associations',
            href: '#/classes/{id}',
            schema: {
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
        },
        attributes: {
          name: {
            label: 'name',
            type: 1,
            dropPoints: {},
            attributes: {},
            schema: {
              type: 'string'
            }
          },
          id: {
            label: 'id',
            type: 1,
            dropPoints: {},
            attributes: {},
            schema: {
              type: 'string'
            }
          }
        },
        type: 1
      };
      classModel.dropPoints.associations['targetModel'] = classModel;
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
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
          },
          dropPoints: {
            classes: classModel
          },
          attributes: {
            name: {
              label: 'name',
              type: 0,
              dropPoints: {},
              attributes: {},
              schema: {
                type: 'string'
              }
            }
          },
          type: 0
        });
    });
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
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      const classSchema = {
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
      };
      const classModel = {
        label: 'class',
        schema: classSchema,
        dropPoints: {
          association: {
            label: 'association',
            href: '#/classes/{id}',
            schema: {
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
        },
        attributes: {
          id: {
            label: 'id',
            schema: {type: 'string'},
            dropPoints: {},
            attributes: {},
            type: 1
          }
        },
        type: 1
      };
      classModel.dropPoints.association['targetModel'] = classModel;
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
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
          },
          dropPoints: {
            classes: classModel
          },
          attributes: {
            name: {
              label: 'name',
              schema: {type: 'string'},
              dropPoints: {},
              attributes: {},
              type: 0
            }
          },
          type: 0
        });
    });
});
test.failing('support for inline references', t => {
    const schema = {
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
            },
            composition: {
              type: 'integer',
              minimum: 0
            }
          },
          links: [{
            rel: 'full',
            href: '#/classes/{association}',
            targetSchema: '#/definitions/class'
          },
          {
            rel: 'full',
            href: '#/classes/{composition}',
            targetSchema: '#/definitions/class'
          }]
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
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      const classSchema = {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          association: {
            type: 'integer',
            minimum: 0
          },
          composition: {
            type: 'integer',
            minimum: 0
          }
        },
        links: [{
          rel: 'full',
          href: '#/classes/{association}',
          targetSchema: '#/definitions/class'
        },
        {
          rel: 'full',
          href: '#/classes/{composition}',
          targetSchema: '#/definitions/class'
        }]
      };
      const classModel = {
        label: 'class',
        schema: classSchema,
        dropPoints: {
          association: {
            label: 'association',
            href: '#/classes/{association}',
            schema: {
              type: 'integer',
              minimum: 0
            }
          },
          composition: {
            label: 'composition',
            href: '#/classes/{composition}',
            schema: {
              type: 'integer',
              minimum: 0
            }
          }
        },
        attributes: {
          id: {
            label: 'id',
            schema: {type: 'string'},
            dropPoints: {},
            attributes: {},
            type: 1
          }
        },
        type: 1
      };
      classModel.dropPoints.association['targetModel'] = classModel;
      classModel.dropPoints.composition['targetModel'] = classModel;
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
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
                  },
                  composition: {
                    type: 'integer',
                    minimum: 0
                  }
                },
                links: [{
                  rel: 'full',
                  href: '#/classes/{association}',
                  targetSchema: '#/definitions/class'
                },
                {
                  rel: 'full',
                  href: '#/classes/{composition}',
                  targetSchema: '#/definitions/class'
                }]
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
          },
          dropPoints: {
            classes: classModel
          },
          attributes: {
            name: {
              label: 'name',
              schema: {type: 'string'},
              dropPoints: {},
              attributes: {},
              type: 0
            }
          },
          type: 0
        });
    });
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
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {
        label: 'root',
        schema: {
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
        },
        dropPoints: {
          roots: {
            label: 'root',
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            },
            dropPoints: {},
            attributes: {
              name: {
                label: 'name',
                schema: {type: 'string'},
                dropPoints: {},
                attributes: {},
                type: 1
              }
            },
            type: 1
          }
        },
        attributes: {},
        type: 0
      });
    });
});
test('self-contained child schemata: no recursion, ref to other type', t => {
  const schema = {
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
          name: {type: 'string'}
        }
      }
    },
    type: 'object',
    properties: {
      persons: {type: 'array', items: {$ref: '#/definitions/person'}}
    }
  } as JsonSchema;
  const extractor = new SchemaExtractor(schema);
  return extractor.extract().then(result => {
    t.true(isItemModel(result));
    t.deepEqual(result, {label: 'root',
      schema: {
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
              name: {type: 'string'}
            }
          }
        },
        type: 'object',
        properties: {
          persons: {type: 'array', items: {$ref: '#/definitions/person'}}
        }
      },
      dropPoints: {
        persons: {
          label: 'person',
          schema: {
            definitions: {
              robot: {
                type: 'object',
                properties: {
                  name: {type: 'string'}
                }
              }
            },
            type: 'object',
            properties: {
              robots: {
                type: 'array',
                items: {$ref: '#/definitions/robot'}
              }
            }
          },
          dropPoints: {
            robots: {
              label: 'robot',
              schema: {
                type: 'object',
                properties: {
                  name: {type: 'string'}
                }
              },
              dropPoints: {},
              attributes: {
                name: {
                  label: 'name',
                  schema: {type: 'string'},
                  dropPoints: {},
                  attributes: {},
                  type: 1
                }
              },
              type: 1
            }
          },
          attributes: {},
          type: 1
        }
      },
      attributes: {},
      type: 0
    });
  });
});
test('self-contained child schemata: only self recursion', t => {
  const schema = {
    definitions: {
      person: {
        type: 'object',
        properties: {
          children: {
            type: 'array',
            items: {$ref: '#/definitions/person'}
          }
        }
      }
    },
    type: 'object',
    properties: {
      persons: {
        type: 'array',
        items: {$ref: '#/definitions/person'}
      }
    }
  } as JsonSchema;

  // define the recursive and self-contained person drop point
  const personModel = {
    label: 'person',
    schema: {
      type: 'object',
      properties: {
        children: {
          type: 'array',
          // reference to root because it's a self reference
          items: {$ref: '#'}
        }
      }
    },
    dropPoints: {},
    attributes: {},
    type: 1
  }

  personModel.dropPoints['children'] = personModel;

  // define the expected result using the recursive person drop point
  const expectedResult = {
    label: 'root',
    schema: {
      definitions: {
        person: {
          type: 'object',
          properties: {
            children: {
              type: 'array',
              items: {$ref: '#/definitions/person'}
            }
          }
        }
      },
      type: 'object',
      properties: {
        persons: {
          type: 'array',
          items: {$ref: '#/definitions/person'}
        }
      }
    },
    dropPoints: {
      persons: personModel
    },
    attributes: {},
    type: 0
  }

  const extractor = new SchemaExtractor(schema);
  return extractor.extract().then(result => {
    t.true(isItemModel(result));
    t.deepEqual(result, expectedResult);
  });
});
test('self contained child schemata: cross recursion', t => {
  const schema = {
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
  } as JsonSchema;

  // define person item model
  const personModel = {
    label: 'person',
    schema: {
      definitions: {
        robot: {
          type: 'object',
          properties: {
            humans: {
              type: 'array',
              items: {$ref: '#'}
            }
          }
        }
      },
      type: 'object',
      properties: {
        robots: {
          type: 'array',
          items: {$ref: '#/definitions/robot'}
        }
      }
    },
    dropPoints: {},
    attributes: {},
    type: 1
  }

  // define robot item model
  const robotModel = {
    label: 'robot',
    schema: {
      definitions: {
        person: {
          type: 'object',
          properties: {
            robots: {
              type: 'array',
              items: {$ref: '#'}
            }
          }
        }
      },
      type: 'object',
      properties: {
        humans: {
          type: 'array',
          items: {$ref: '#/definitions/person'}
        }
      }
    },
    dropPoints: {},
    attributes: {},
    type: 1
  }

  // add recursive models
  personModel.dropPoints['robots'] = robotModel;
  robotModel.dropPoints['humans'] = personModel;

  const expectedResult = {
    label: 'root',
    schema: {
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
    },
    dropPoints: {
      'persons': personModel
    },
    attributes: {},
    type: 0
  }

  const extractor = new SchemaExtractor(schema);
  return extractor.extract().then(result => {
    t.true(isItemModel(result));
    t.deepEqual(result, expectedResult);
  });
});
test.failing('resolve $ref simple, should be moved to schema resolution', t => {
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
    const extractor = new SchemaExtractor(schema);
    const expectedResult = {
      schema: schema,
      dropPoints: {
        foos: {
          schema: {
            type: 'object',
            properties: {
              bar: {
                type: 'array',
                items: {
                  $ref: '#/definitions/foo'
                }
              }
            }
          },
          dropPoints: {}
        }
      }
    };
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, expectedResult);
      t.deepEqual((<ItemModel>result).schema, {
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
});
test.failing('resolve $ref complicated, should be moved to schema resolution', t => {
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
    const expectedResult = {schema: schema, dropPoints: {}};
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, expectedResult);
      t.deepEqual((<ItemModel>result).schema, {
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
});
