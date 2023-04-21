import { registerExamples } from '../register';

export const schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      plainEnum: {
        type: 'string',
        enum: ['foo', 'bar'],
      },
      oneOfEnum: {
        type: 'string',
        oneOf: [
          { const: 'foo', title: 'Foo' },
          { const: 'bar', title: 'Bar' },
          { const: 'foobar', title: 'FooBar' },
        ],
      },
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#',
    },
  ],
};

export const data: any[] = [];

registerExamples([
  {
    name: 'enumInArray',
    label: 'Array containing enums',
    data,
    schema,
    uischema,
  },
]);
