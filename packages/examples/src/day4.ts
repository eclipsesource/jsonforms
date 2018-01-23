import { registerExamples } from './register';
import {
  data as day3Data,
  schema as day3Schema,
  uischema as day3UiSchema,
} from './day3';

export const schema = {
  type: 'object',
  properties: {
    ...day3Schema.properties,
    recurrence: {
        type: 'string',
        enum: ['Never', 'Daily', 'Weekly', 'Monthly']
    },
    recurrenceInterval: {
        type: 'integer'
    }
  },
  required: ['name']
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    ...day3UiSchema.elements,
    {
      type: 'Control',
      scope: '#/properties/recurrence'
    },
    {
      type: 'Control',
      scope: '#/properties/recurrenceInterval',
      rule: {
          effect: 'HIDE',
          condition: {
              scope: '#/properties/recurrence',
              expectedValue: 'Never'
          }
      }
    }
  ]
};

export const data = {
  ...day3Data,
  recurrence: 'Daily',
  recurrenceInterval: 5
};

registerExamples([
  {
    name: 'day4',
    label: 'Day 4',
    data,
    schema,
    uiSchema: uischema
  }
]);
