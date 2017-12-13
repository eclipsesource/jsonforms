import { registerExamples } from './register';

export const schema = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string',
      'minLength': 3,
      'description': 'Please enter your full name.'
    },
    'personalData': {
      'type': 'object',
      'properties': {
        'age': {
          'type': 'integer',
          'description': 'Please enter your age.'
        },
        'height': {
          'type': 'number'
        },
        'drivingSkill': {
          'type': 'number',
          'maximum': 10,
          'minimum': 1
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
    'postalCode': {
      'type': 'string',
      'maxLength': 5
    }
  },
  'required': ['occupation', 'nationality']
};

export const uischema = {
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
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/personalData/properties/drivingSkill'
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
            '$ref': '#/properties/postalCode'
          },
          'options': {
            'trim': true,
            'restrict': true
          }
        }
      ]
    }
  ]
};
export const data = {
  name: 'John Doe',
  vegetarian: false,
  birthDate: '1985-06-02',
  personalData: {},
  postalCode: '12345'
};
registerExamples([
  {
    name: 'person',
    label: 'Person',
    data,
    schema,
    uiSchema: uischema
  }
]);
