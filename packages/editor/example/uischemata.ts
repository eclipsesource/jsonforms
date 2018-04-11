export const attributeView = {
  'type': 'VerticalLayout',
  'elements': [
  {
    'type': 'Group',
    'label': 'Standard',
    'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/name'
    },
    {
      'type': 'Control',
      'label': 'E Type',
      'scope': '#/properties/eType',
       'options': {
         'id': 'eAttribute'
       }
    },
    {
      'type': 'HorizontalLayout',
      'elements': [
      {
        'type': 'Control',
        'label': 'Lower Bound',
        'scope': '#/properties/lowerBound'
      },
      {
        'type': 'Control',
        'label': 'Upper Bound',
        'scope': '#/properties/upperBound'
      }
      ]
    }
    ]
  },
  {
    'type': 'Group',
    'label': 'Advanced',
    'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/unsettable'
    },
    {
      'type': 'Control',
      'scope': '#/properties/ordered'
    },
    {
      'type': 'Control',
      'scope': '#/properties/unique'
    },
    {
      'type': 'Control',
      'scope': '#/properties/changeable'
    },
    {
      'type': 'Control',
      'scope': '#/properties/volatile'
    },
    {
      'type': 'Control',
      'scope': '#/properties/transient'
    },
    {
      'type': 'Control',
      'scope': '#/properties/defaultValueLiteral'
    },
    {
      'type': 'Control',
      'scope': '#/properties/derived'
    }
    ]
  }
  ]
};

export const datatypeView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/name'
    },
    {
      'type': 'Control',
      'scope': '#/properties/serializable'
    },
    {
      'type': 'Control',
      'scope': '#/properties/instanceClassName'
    }
  ]
};

export const enumView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/name'
    }
  ]
};

export const ePackageView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/name'
    },
    {
      'type': 'Control',
      'scope': '#/properties/nsURI'
    },
    {
      'type': 'Control',
      'scope': '#/properties/nsPrefix'
    }
  ]
};

export const eReferenceView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Group',
      'label': 'Standard',
      'elements': [
        {
          'type': 'Control',
          'scope': '#/properties/name'
        },
        {
          'type': 'Control',
          'scope': '#/properties/eType',
          'options': {
            'id': 'eReference'
          }
        },
        {
          'type': 'HorizontalLayout',
          'elements': [
            {
              'type': 'Control',
              'scope': '#/properties/lowerBound'
            },
            {
              'type': 'Control',
              'scope': '#/properties/upperBound'
            }
          ]
        },
        {
          'type': 'Control',
          'scope': '#/properties/containment'
        }
      ]
    },
    {
      'type': 'Group',
      'label': 'Advanced',
      'elements': [
        {
          'type': 'Control',
          'scope': '#/properties/changeable'
        },
        {
          'type': 'Control',
          'scope': '#/properties/unsettable'
        },
        {
          'type': 'Control',
          'scope': '#/properties/ordered'
        },
        {
          'type': 'Control',
          'scope': '#/properties/unique'
        },
        {
          'type': 'Control',
          'scope': '#/properties/eOpposite'
        },
        {
          'type': 'Control',
          'scope': '#/properties/container'
        },
        {
          'type': 'Control',
          'scope': '#/properties/defaultValueLiteral'
        },
        {
          'type': 'Control',
          'scope': '#/properties/derived'
        },
        {
          'type': 'Control',
          'scope': '#/properties/eKeys'
        },
        {
          'type': 'Control',
          'scope': '#/properties/resolveProxies'
        },
        {
          'type': 'Control',
          'scope': '#/properties/transient'
        },
        {
          'type': 'Control',
          'scope': '#/properties/volatile'
        }
      ]
    }
  ]
};

export const eClassView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Group',
      'label': 'Standard',
      'elements': [
        {
          'type': 'Control',
          'scope': '#/properties/name'
        },
        {
          'type': 'Control',
          'scope': '#/properties/secondName'
        },
        {
          'type': 'Control',
          'scope': '#/properties/abstract'
        },
        {
          'type': 'Control',
          'scope': '#/properties/interface'
        }
      ]
    },
    {
      'type': 'Group',
      'label': 'Advanced',
      'elements': [
        {
          'type': 'Control',
          'scope': '#/properties/instanceTypeName'
        },
        {
          'type': 'Control',
          'scope': '#/properties/eSuperTypes'
        }
      ]
    }
  ]
};

export const eOperationView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Group',
      'label': 'Standard',
      'elements': [
        {
          'type': 'Control',
          'scope': '#/properties/name'
        },
        {
          'type': 'Control',
          'scope': '#/properties/eType',
          'options': {
            'id': 'eReference'
          }
        },
        {
          'type': 'HorizontalLayout',
          'elements': [
            {
              'type': 'Control',
              'scope': '#/properties/lowerBound'
            },
            {
              'type': 'Control',
              'scope': '#/properties/upperBound'
            }
          ]
        }
      ]
    },
    {
      'type': 'Group',
      'label': 'Advanced',
      'elements': [
        {
          'type': 'Control',
          'scope': '#/properties/ordered'
        },
        {
          'type': 'Control',
          'scope': '#/properties/required'
        },
        {
          'type': 'Control',
          'scope': '#/properties/unique'
        },
        {
          'type': 'Control',
          'scope': '#/properties/many'
        }
      ]
    }
  ]
};

export const annotationView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/source'
    }
  ]
};

export const userView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/name'
    },
    {
      'type': 'Control',
      'scope': '#/properties/birthday'
    },
    {
      'type': 'Control',
      'scope': '#/properties/nationality'
    }
  ]
};

export const userGroupView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/label'
    }
  ]
};

export const taskView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': '#/properties/name'
    },
    {
      'type': 'HorizontalLayout',
      'elements': [
        {
          'type': 'Control',
          'scope': '#/properties/done'
        },
        {
          'type': 'Control',
          'scope': '#/properties/dueDate'
        }
      ]
    },
    {
      'type': 'Control',
      'scope': '#/properties/priority'
    }
  ]
};

export const rootView = {};
