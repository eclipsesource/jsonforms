import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    postalCode: {
      type: 'string',
      maxLength: 5
    }
  }
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: {
            $ref: '#/properties/postalCode'
          }
        }
      ]
    }
  ]
};

export const data = {
  postalCode: '12345'
};

registerExamples([
  {
    name: 'configDefault',
    label: 'Configuration (Default)',
    data,
    schema,
    uiSchema: uischema
  }
]);
