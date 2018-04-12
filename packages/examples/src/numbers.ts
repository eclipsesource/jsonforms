import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    price: {
      type: 'number',
      maximum: 100,
      minimum: 1,
      default: 50
    },
    age: {
      type: 'integer'
    },
    height: {
      type: 'number'
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
        {
          type: 'Control',
          scope: '#/properties/age'
        },
        {
          type: 'Control',
          scope: '#/properties/height'
        }
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
