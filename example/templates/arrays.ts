import { registerExamples } from '../example';
const schema = {
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
          'format': 'date'
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
                'format': 'date'
              },
              'message': {
                'type': 'string'
              }
            }
          }
        },
        'gender': {
            'type': 'string',
            'enum': ['male', 'female', 'other']
        },
        'yearsOfExperience': {
          'type': 'string',
          'enum': ['0', '1', '2', '3', '4', 'more']
        },
        'province': {
            'type': 'string',
            'enum': ['Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg',
                'Hessen', 'Niedersachsen', 'mecklenburg-Vorpommern', 'Nordrhein-Westfalen',
                'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein',
                'Thüringen']
        }
      },
      'required': ['occupation', 'nationality']
    };
const uischema = {
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
    },
      {
        'type': 'Control',
          'scope': {
          '$ref': '#/properties/gender'
          }
      },
      {
          'type': 'Control',
          'scope': {
              '$ref': '#/properties/yearsOfExperience'
          }
      },
      {
          'type': 'Control',
          'scope': {
              '$ref': '#/properties/province'
          }
      }
  ]
};
const uischemaSimple = {
  'type': 'Control',
  'scope': {
    '$ref': '#/properties/comments'
  },
  'label': 'Some more comments',
  'options': {
    'table': true
  }
};
const data = {
  'comments': [
    {
      'date': new Date(2001, 8, 11).toISOString().substr(0, 10),
      'message': 'This is an example message'
    },
    {
      'date': new Date().toISOString().substr(0, 10),
      'message': 'Get ready for booohay'
    }
  ]
};
registerExamples([
  {name: 'array', label: 'Array', data: data, schema: schema, uiSchema: uischema},
  {name: 'array-simple', label: 'Array Simple', data: data,
    schema: schema, uiSchema: uischemaSimple}
]);
