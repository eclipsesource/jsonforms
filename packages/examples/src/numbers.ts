import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    price: {
      type: 'number',
      maximum: 300,
      minimum: 1,
      default: 50
    }
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/price',
          label: {
            text: 'Price'
          }
        },
      ]
    },
  ]
};

export const data = {};

registerExamples([
  {
    name: 'numbers',
    label: 'Numbers',
    data,
    schema,
    uiSchema: uischema,
  }
]);
