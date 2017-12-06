import { registerExamples } from './register';

export const schema = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'done': {
      'type': 'boolean'
    }
  },
  'required': ['name']
};

export const uischema = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/name'
      }
    },
    {
      'type': 'Control',
      'label': false,
      'scope': {
        '$ref': '#/properties/done'
      }
    },
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/description'
      },
      'options': {
          'multi': true
      }
    }
  ]
};
export const data = {
    'name': 'Send email to Adrian',
    'description': 'Confirm if you have passed the subject\nHereby ...',
    'done': true
};
registerExamples([
  {
    name: 'day2',
    label: 'Day 2',
    data,
    schema,
    uiSchema: uischema
  }
]);
