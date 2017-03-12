import {registerExamples} from '../example';
const schema = {
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
const uischema = {
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
const data = {
    'name': 'Send email to Adriana',
    'description': 'Confirm if you have passed the subject\nHerby ...',
    'done': true
};
registerExamples([
  {name: 'day2', label: 'Day 2', data: data, schema: schema, uiSchema: uischema}
]);
