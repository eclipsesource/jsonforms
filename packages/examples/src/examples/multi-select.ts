import { registerExamples } from '../register';

export const schema = {
  type: 'object',
  properties: {
    fruits: {
      type: 'array',
      title: 'Select Fruits (Dropdown)',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
      },
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/fruits',
      options: {
        format: 'multiselect',
      },
    },
  ],
};

export const data = {
  fruits: ['Banana', 'Cherry'],
};

registerExamples([
  {
    name: 'multi-select',
    label: 'multi-select',
    data,
    schema,
    uischema,
  },
]);
