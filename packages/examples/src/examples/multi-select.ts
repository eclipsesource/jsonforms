import { registerExamples } from '../register';

const schema = {
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

const uischema = {
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

const data = {
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

