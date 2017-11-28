import { registerExamples } from '../example';
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
    }
  }
};
const uischema = {
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
};
const data = {
  'date': new Date().toISOString().substr(0, 10),
  'time': '13:37'
};
registerExamples([
  {name: 'dates', label: 'Dates', data: data, schema: schema, uiSchema: uischema}
]);
