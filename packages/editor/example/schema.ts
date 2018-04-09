/* tslint:disable:max-file-line-count */
export const ecoreSchema = {
  'definitions': {
    'eLiterals': {
      'id': '#eliteral',
      'type': 'object',
      'properties': {
        'literal': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'value': {
          'type': 'integer',
          'default': 0
        }
      },
      'required': ['name']
    },
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
        'targetSchema': {
          '$ref': '#/definitions/eClassifier'
        }
      }],
      'additionalProperties': false
    },
    'annotation': {
      'id': '#annotation',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string',
          'default': 'http://www.eclipse.org/emf/2002/Ecore#//EAnnotation'
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
            '$ref': '#/definitions/eLiterals'
          }
        },
        'eAnnotations': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/annotation'
          }
        }
      },
      'required': ['name'],
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
      'required': ['name'],
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
        'secondName': {
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
        'eSuperTypes': {
          'type': 'array',
          'items': { 'type': 'string' }
        },
        'eStructuralFeatures': {
          'type': 'array',
          'items': {
            'anyOf': [
              {'$ref': '#/definitions/attribute'},
              {'$ref': '#/definitions/reference'}
            ]
          }
        },
        'eOperations': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/operation'
          }
        },
        'eAnnotations': {
          'type': 'array',
          'items': {
            '$ref': '#/definitions/annotation'
          }
        }
      },
      'required': ['name'],
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
          'type': 'string'
        }
      },
      'links': [{
        'rel': 'full',
        'href': '#/eClassifiers/{eType}',
        'targetSchema': {
          '$ref': '#/definitions/datatype'
        }
      }],
      'required': ['name', 'eType'],
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
          'type': 'string'
        }
      },
      'links': [{
        'rel': 'full',
        'href': '#/eClassifiers/{eType}',
        'targetSchema': {
          '$ref': '#/definitions/eclass'
        }
      }],
      'required': ['name', 'eType'],
      'additionalProperties': false
    },
    'operation': {
      'id': '#operation',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string',
          'default': 'http://www.eclipse.org/emf/2002/Ecore#//EOperation'
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
          'type': 'string'
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
                'type': 'string'
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
      'links': [{
        'rel': 'full',
        'href': '#/eClassifiers/{eType}',
        'targetSchema': {
          '$ref': '#/definitions/eclass'
        }
      }],
      'required': ['name'],
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
  'required': ['name', 'nsURI', 'nsPrefix'],
  'additionalProperties': false
};
