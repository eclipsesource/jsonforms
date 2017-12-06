import { registerExamples } from './register';

export const schema = {
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
    }
  }
};

export const uischema = {
  'type': 'Categorization',
  'elements': [
    {
      'type': 'Categorization',
      'label': 'Sub',
      'elements': [
        {
          'type': 'Category',
          'label': 'SubPrivate',
          'elements': [
            {
              'type': 'Control',
              'scope': {
                '$ref': '#/properties/name'
              }
            }
          ]
        },
        {
          'type': 'Category',
          'label': 'Additional',
          'elements': [
            {
              'type': 'Control',
              'scope': {
                '$ref': '#/properties/nationality'
              }
            },
            {
              'type': 'Control',
              'scope': {
                '$ref': '#/properties/vegetarian'
              }
            }
          ]
        }
      ]
    },
    {
      'type': 'Category',
      'label': 'Private',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/name'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/birthDate'
          }
        }
      ]
    },
    {
      'type': 'Category',
      'label': 'Additional',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/birthDate'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/vegetarian'
          }
        }
      ]
    }
  ]
};
const data = {
  name: 'John Doe',
  vegetarian: false,
  birthDate: '1985-06-02',
  nationality: 'DE'
};
registerExamples([
  {
    name: 'categorization',
    label: 'Categorization',
    data,
    schema,
    uiSchema: uischema
  }
]);
