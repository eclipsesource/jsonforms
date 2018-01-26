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
          scope: '#/properties/postalCode'
        }
      ]
    }
  ]
};

export const data = {
  postalCode: '12345'
};

export const config = {
    restrict: false,
    trim: false
};

registerExamples([
  {
    name: 'configCustom',
    label: 'Configuration (Custom)',
    data,
    schema,
    uiSchema: uischema,
    config
  }
]);
