import { registerExamples } from './register';
const schema = {
  type: 'object',
  properties: {
    date: {
      type: 'string',
      format: 'date'
    },
    time: {
      type: 'string',
      format: 'time'
    }
  }
};
const uischema = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/date'
    },
    {
      type: 'Control',
      scope: '#/properties/time'
    }
  ]
};
const data = {
  date: new Date().toISOString().substr(0, 10),
  time: '13:37'
};
registerExamples([
  {
    name: 'dates',
    label: 'Dates',
    data,
    schema,
    uiSchema: uischema }
]);
