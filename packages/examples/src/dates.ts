import { registerExamples } from './register';
const schema = {
  'type': 'object',
  'properties': {
    'date': {
      'type': 'string',
      'format': 'date'
    },
    'time': {
      'type': 'string',
      'format': 'time'
    },
    'datetime': {
      'type': 'string',
      'format': 'date-time'
    }
  }
};
const uischema = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'HorizontalLayout',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/date'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/time'
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
            '$ref': '#/properties/datetime'
          }
        }
      ]
    }
  ]
};
const data = {
  'date': new Date().toISOString().substr(0, 10),
  'time': '13:37',
  'datetime': new Date().toISOString().substr(0, 11) + '13:37:00.000Z'
};
registerExamples([
  { name: 'dates', label: 'Dates', data: data, schema: schema, uiSchema: uischema }
]);
