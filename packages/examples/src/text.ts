import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    zipCode: {
      type: 'string',
      maxLength: 5
    },
    zipCodeWithoutTrim: {
      type: 'string',
      maxLength: 5
    },
    zipCodeWithoutRestrict: {
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
          scope: '#/properties/zipCode',
          label: 'ZIP Code (with trim and restrict options)',
          options: {
            trim: true,
            restrict: true
          }
        },
        {
          type: 'Control',
          scope: '#/properties/zipCodeWithoutTrim',
          label: 'ZIP Code (without trimming)',
          options: {
            trim: false,
            restrict: true
          }
        },
        {
          type: 'Control',
          scope: '#/properties/zipCodeWithoutRestrict',
          label: 'ZIP Code (without restricting)',
          options: {
            trim: true,
            restrict: false
          }
        }
      ]
    },
  ]
};

export const data = {
  zipCode: '12345',
  zipCodeWithoutTrim: '12345678',
  zipCodeWithoutRestrict: '12345678'
};

registerExamples([
  {
    name: 'text',
    label: 'Text',
    data,
    schema,
    uischema,
  }
]);
