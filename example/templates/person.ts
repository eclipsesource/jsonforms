import { registerExamples } from '../example';
const schema = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string',
      'minLength': 3
    },
    'personalData': {
      'type': 'object',
      'properties': {
          'age': {
              'type': 'integer'
          },
          'height': {
              'type': 'number'
          }
      },
      'required': ['age', 'height']
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
        'Hessen', 'Niedersachsen', 'Mecklenburg-Vorpommern', 'Nordrhein-Westfalen',
        'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein',
        'Thüringen']
    },
    'postalCode': {
      'type': 'string',
      'maxLength': 5
    },
  },
  'required': ['occupation', 'nationality']
};
const uischema = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'HorizontalLayout',
      'elements': [
        {
          'type': 'Control',
          'label': {
            'text': 'Name',
            'show': true
          },
          'scope': {
            '$ref': '#/properties/name'
          }
        },
        {
          'type': 'Control',
          'label': {
            'text': 'Age'
          },
          'scope': {
            '$ref': '#/properties/personalData/properties/age'
          }
        },
        {
          'type': 'Control',
          'label': 'Height',
          'scope': {
            '$ref': '#/properties/personalData/properties/height'
          }
        },
        {
          'type': 'Control',
          'label': {
            'text': 'Age'
          },
          'scope': {
            '$ref': '#/properties/personalData/properties/age'
          }
        },
      ]
    },
    {
      'type': 'HorizontalLayout',
      'elements': [
        {
          'type': 'Control',
          'label': 'Nationality',
          'scope': {
            '$ref': '#/properties/nationality'
          }
        },
        {
          'type': 'Control',
          'label': 'Height',
          'scope': {
            '$ref': '#/properties/personalData/properties/height'
          }
        },
        {
          'type': 'Control',
          'label': 'Occupation',
          'scope': {
            '$ref': '#/properties/occupation'
          },
          'suggestion': ['Accountant', 'Engineer', 'Freelancer',
            'Journalism', 'Physician', 'Student', 'Teacher', 'Other']
        },
        {
          'type': 'Control',
          'label': 'Birthday',
          'scope': {
            '$ref': '#/properties/birthDate'
          }
        }
      ]
    },
    {
      'type': 'HorizontalLayout',
      'elements': [
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
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/postalCode'
          },
          'options': {
            'trim': true,
            'restrict': true
          }
        }
      ]
    },
  ]
};
const data = {
  name: 'John Doe',
  vegetarian: false,
  birthDate: '1985-06-02',
  postalCode: '12345'
};
registerExamples([
  {name: 'person', label: 'Person', data: data, schema: schema, uiSchema: uischema}
]);
