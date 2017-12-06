/* tslint:disable:max-file-line-count */
import { registerExamples } from './register';

export const schema = {
  'definitions': {
    'eClassifier': {
      'anyOf': [
        {'$ref': '#/definitions/enum'},
        {'$ref': '#/definitions/datatype'}
      ]
    },
    'type': {
      'type': 'object',
      'properties': {
        'id': {
          'type': 'integer',
          'minimum': 0
        }
      },
      'links': [{
        'rel': 'full',
        'href': '#/eClassifiers/{id}',
        'targetSchema': '#/definitions/eClassifier'
      }],
      'additionalProperties': false
    },
    'annotation': {
      'id': '#annotation',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string'
        },
        '_id': {
          'type': 'string'
        },
        'source': {
          'type': 'string'
        },
        'details': {
          'type': 'object'
        }
      },
      'additionalProperties': false
    },
    'enum': {
      'id': '#enum',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string',
          'default': 'http://www.eclipse.org/emf/2002/Ecore#//EEnum'
        },
        '_id': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'instanceClassName': {
          'type': 'string'
        },
        'instanceTypeName': {
          'type': 'string'
        },
        'serializable': {
          'type': 'boolean'
        },
        'eLiterals': {
          'type': 'array',
          'items': {
            'type': 'string'
          }
        },
        'eAnnotations': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/annotation'
          }
        }
      },
      'additionalProperties': false
    },
    'datatype': {
      'id': '#datatype',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string',
          'default': 'http://www.eclipse.org/emf/2002/Ecore#//EDataType'
        },
        '_id': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'instanceClassName': {
          'type': 'string'
        },
        'instanceTypeName': {
          'type': 'string'
        },
        'serializable': {
          'type': 'boolean'
        },
        'eAnnotations': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/annotation'
          }
        }
      },
      'additionalProperties': false
    },
    'eclass': {
      'type': 'object',
      'id': '#class',
      'properties': {
        'eClass': {
          'type': 'string',
          'default': 'http://www.eclipse.org/emf/2002/Ecore#//EClass'
        },
        '_id': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'secondname': {
          'type': 'string'
        },
        'instanceClassName': {
          'type': 'string'
        },
        'instanceTypeName': {
          'type': 'string'
        },
        'abstract': {
          'type': 'boolean'
        },
        'interface': {
          'type': 'boolean'
        },
        'references' : {
          'type': 'array',
          'items': {'$ref': '#/definitions/reference'}
        },
        'attributes' : {
          'type': 'array',
          'items': {'$ref': '#/definitions/attribute'}
        },
        'eOperations': {
          'type': 'array',
          'items': {
            'id': '#operation',
            'type': 'object',
            'properties': {
              'eClass': {
                'type': 'string'
              },
              '_id': {
                'type': 'string'
              },
              'name': {
                'type': 'string'
              },
              'ordered': {
                'type': 'boolean'
              },
              'unique': {
                'type': 'boolean'
              },
              'lowerBound': {
                'type': 'integer'
              },
              'upperBound': {
                'type': 'integer'
              },
              'many': {
                'type': 'boolean'
              },
              'required': {
                'type': 'boolean'
              },
              'eType': {
                '$ref': '#/definitions/type'
              },
              'eTypeParameters': {
                'type': 'array',
                'items': {
                  'id': '#typeparameter',
                  'type': 'object',
                  'properties': {
                    'eClass': {
                      'type': 'string'
                    },
                    '_id': {
                      'type': 'string'
                    },
                    'name': {
                      'type': 'string'
                    }
                  },
                  'additionalProperties': false
                }
              },
              'eParameters': {
                'type': 'array',
                'items': {
                  'id': '#parameter',
                  'type': 'object',
                  'properties': {
                    'eClass': {
                      'type': 'string'
                    },
                    '_id': {
                      'type': 'string'
                    },
                    'name': {
                      'type': 'string'
                    },
                    'ordered': {
                      'type': 'boolean'
                    },
                    'unique': {
                      'type': 'boolean'
                    },
                    'lowerBound': {
                      'type': 'integer'
                    },
                    'upperBound': {
                      'type': 'integer'
                    },
                    'many': {
                      'type': 'boolean'
                    },
                    'required': {
                      'type': 'boolean'
                    },
                    'eType': {
                      '$ref': '#/definitions/type'
                    },
                    'eGenericType': {
                      'type': 'object',
                      'properties': {
                        'eClass': {
                          'type': 'string'
                        },
                        '_id': {
                          'type': 'string'
                        },
                        'eClassifier': {
                          'type': 'object',
                          'properties': {
                            'eClass': {
                              'type': 'string'
                            },
                            '$ref': {
                              'type': 'string'
                            }
                          },
                          'additionalProperties': false
                        },
                        'eTypeArguments': {
                          'type': 'array',
                          'items': {
                            'type': 'object',
                            'properties': {
                              'eClass': {
                                'type': 'string'
                              },
                              '_id': {
                                'type': 'string'
                              }
                            },
                            'additionalProperties': false
                          }
                        }
                      },
                      'additionalProperties': false
                    }
                  },
                  'additionalProperties': false
                }
              }
            },
            'additionalProperties': false
          }
        },
        'eAnnotations': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/annotation'
          }
        }
      },
      'additionalProperties': false
    },
    'attribute': {
      'id': '#attribute',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string',
          'default': 'http://www.eclipse.org/emf/2002/Ecore#//EAttribute'
        },
        '_id': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'ordered': {
          'type': 'boolean'
        },
        'unique': {
          'type': 'boolean'
        },
        'lowerBound': {
          'type': 'integer'
        },
        'upperBound': {
          'type': 'integer'
        },
        'many': {
          'type': 'boolean'
        },
        'required': {
          'type': 'boolean'
        },
        'changeable': {
          'type': 'boolean'
        },
        'volatile': {
          'type': 'boolean'
        },
        'transient': {
          'type': 'boolean'
        },
        'defaultValueLiteral': {
          'type': 'string'
        },
        'unsettable': {
          'type': 'boolean'
        },
        'derived': {
          'type': 'boolean'
        },
        'containment': {
          'type': 'boolean'
        },
        'resolveProxies': {
          'type': 'boolean'
        },
        'eType': {
          'type': 'integer',
          'minimum': 0
        }
      },
      'links': [{
        'rel': 'full',
        'href': '#/eClassifiers/{eType}',
        'targetSchema': '#/definitions/eClassifier'
      }],
      'additionalProperties': false
    },
    'reference': {
      'id': '#reference',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string',
          'default': 'http://www.eclipse.org/emf/2002/Ecore#//EReference'
        },
        '_id': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'ordered': {
          'type': 'boolean'
        },
        'unique': {
          'type': 'boolean'
        },
        'lowerBound': {
          'type': 'integer'
        },
        'upperBound': {
          'type': 'integer'
        },
        'many': {
          'type': 'boolean'
        },
        'required': {
          'type': 'boolean'
        },
        'changeable': {
          'type': 'boolean'
        },
        'volatile': {
          'type': 'boolean'
        },
        'transient': {
          'type': 'boolean'
        },
        'defaultValueLiteral': {
          'type': 'string'
        },
        'unsettable': {
          'type': 'boolean'
        },
        'derived': {
          'type': 'boolean'
        },
        'containment': {
          'type': 'boolean'
        },
        'resolveProxies': {
          'type': 'boolean'
        },
        'eOpposite': {
          'type': 'object',
          'properties': {
            '$ref': {
              'type': 'string'
            }
          },
          'additionalProperties': false
        },
        'eType': {
          'type': 'integer',
          'minimum': 0
        }
      },
      'links': [{
        'rel': 'full',
        'href': '#/classes/{eType}',
        'targetSchema': '#/definitions/eclass'
      }],
      'additionalProperties': false
    }
  },
  'type': 'object',
  'id': '#package',
  'properties': {
    'eClass': {
      'type': 'string',
      'default': 'http://www.eclipse.org/emf/2002/Ecore#//EPackage'
    },
    '_id': {
      'type': 'string'
    },
    'name': {
      'type': 'string'
    },
    'nsURI': {
      'type': 'string'
    },
    'nsPrefix': {
      'type': 'string'
    },
    'classes': {
      'type': 'array',
      'items': {'$ref': '#/definitions/eclass'}
    },
    'eClassifiers': {
      'type': 'array',
      'items': {
        'anyOf': [
            {'$ref': '#/definitions/eclass'},
            {'$ref': '#/definitions/enum'},
            {'$ref': '#/definitions/datatype'}
        ]
      }
    }
  },
  'additionalProperties': false
};
export const data = {
  'classes': [
    {
      'name': 'Class1',
      'references': [
        {
          'eType': 1,
          'name': 'Ref1'
        }
      ]
    },
    {
      'name': 'Class2'
    },
    {
      'name': 'Class3',
      'references': [
        {
          'eType': 0,
          'name': 'Ref2'
        }
      ]
    }
  ],
  'name': 'MyPackage'
};
export const masterDetail = {
  'type': 'MasterDetailLayout',
  'scope': {
    '$ref': '#'
  },
  'options': {
    'labelProvider': {
      '#annotation': 'source',
      '#datatype': 'name',
      '#enum': 'name',
      '#enumliteral': 'name',
      '#package': 'name',
      '#parameter': 'name',
      '#reference': 'name',
      '#typeparameter': 'name',
      '#class': 'name',
      '#attribute': 'name',
      '#operation': 'name',
      '#task': 'name',
      '#user': 'name'
    },
    'imageProvider': {
      '#datatype': 'datatype',
      '#enum': 'enum',
      '#enumliteral': 'enumliteral',
      '#package': 'package',
      '#parameter': 'parameter',
      '#reference': 'reference',
      '#typeparameter': 'typeparameter',
      '#class': 'class',
      '#attribute': 'attribute',
      '#operation': 'operation',
      '#annotation': 'annotation'
    }
  }
};
registerExamples([
  {
    name: 'ecore',
    label: 'Ecore Example',
    data,
    schema,
    uiSchema: masterDetail
  }
]);
