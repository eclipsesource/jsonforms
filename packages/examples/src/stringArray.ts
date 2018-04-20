import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    comments:
      {
        type: 'array',
        items: {
          type: 'string',
          maxLength: 5
        }
      }
  }
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/comments'
    }
  ]
};

export const data = {
  comments: ['one string', 'two strings']
};

registerExamples([
  {
    name: 'stringArray',
    label: 'Array of Strings',
    data,
    schema,
    uiSchema: uischema
  },
]);
