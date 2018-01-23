import { registerExamples } from './register';
import { data as day2Data, schema as day2Schema, uischema as day2UiSchema } from './day2';

export const schema = {
  type: 'object',
  properties: {
    ...day2Schema.properties,
    dueDate: {
      type: 'string',
      format: 'date'
    },
    rating: {
      type: 'integer',
      maximum: 5
    }
  },
  required: ['name']
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    ...day2UiSchema.elements,
    {
      type: 'Control',
      scope: '#/properties/dueDate'
    },
    {
      type: 'Control',
      scope: '#/properties/rating'
    }
  ]
};

export const data = {
  ...day2Data,
  rating: 3,
};

registerExamples(
  [
    {
      name: 'day3',
      label: 'Day 3',
      data,
      schema,
      uiSchema: uischema
    }
  ]
);
