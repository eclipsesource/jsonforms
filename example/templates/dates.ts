import { registerExamples } from '../example';
const schema = {
  'type': 'object',
  'properties': {
    'date-time': {
      'type': 'string',
      'format': 'date-time'
    },
  }
};
const uischema = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/date-time'
      }
    },
  ]
};
const data = {
  'date-time':  '2017-11-26T23:11:18.353Z',
};
registerExamples([
  {name: 'dates', label: 'Dates', data: data, schema: schema, uiSchema: uischema}
]);
