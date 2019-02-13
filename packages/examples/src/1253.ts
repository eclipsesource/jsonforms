import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    value: {
      oneOf: [
        {
          title: 'String',
          type: 'string'
        },
        {
          title: 'Number',
          type: 'number'
        }
      ]
    }
  }
};

export const uischema = {
  type: 'Control',
  label: 'Value',
  scope: '#/properties/value'
};

const data = {};

registerExamples([
  {
    name: 'issue-1253',
    label: 'issue 1253 (oneOf)',
    data,
    schema,
    uischema
  }
]);
