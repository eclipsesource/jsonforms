const array_schema = {
      'type': 'object',
      'properties': {
        'name': {
          'type': 'string'
        },
        'vegetarian': {
          'type': 'boolean'
        },
        'birthDate': {
          'type': 'string',
          'format': 'date-time'
        },
        'nationality': {
          'type': 'string',
          'enum': ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
        },
        'occupation': {
          'type': 'string'
        },
        'comments': {
          'type': 'array',
          'items': {
            'type': 'object',
            'properties': {
              'date': {
                'type': 'string',
                'format': 'date-time'
              },
              'message': {
                'type': 'string'
              }
            }
          }
        }
      },
      'required': ['occupation', 'nationality']
    };
const array_uischema = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/comments'
      },
      'options': {
        'submit': true
      }
    }
  ]
};
const array_uischema_simple = {
  'type': 'Control',
  'scope': {
    '$ref': '#/properties/comments'
  },
  'label': 'Some more comments',
  'options': {
    'simple': true
  }
};
const array_data = {
  'comments': [
    {
      'date': new Date(),
      'message': 'This is an example message'
    },
    {
      'date': new Date(),
      'message': 'Get ready for booohay'
    }
  ]
};
export const datas = [
  {name: 'example-arrays', data: array_data, schema: array_schema, uischema: array_uischema},
  {name: 'example-arrays-simple', data: array_data,
    schema: array_schema, uischema: array_uischema_simple}
];
