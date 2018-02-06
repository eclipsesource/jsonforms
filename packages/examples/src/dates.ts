import { registerExamples } from './register';
import * as moment from 'moment';

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
    },
    datetime: {
      type: 'string',
      format: 'date-time'
    }
  }
};
const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
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
    },
    {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/datetime'
    }
  ]
    }
  ]
};
const data = {
  date: new Date().toISOString().substr(0, 10),
  time: '13:37',
  datetime: moment().format()
};
registerExamples([
  {
    name: 'dates',
    label: 'Dates',
    data,
    schema,
    uiSchema: uischema }
]);
