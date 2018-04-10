import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    postalCode: {
      type: 'string',
    },
    postalCodeWithoutTrim: {
      type: 'string',
      maxLength: 8
    },
    postalCodeWithoutRestrict: {
      type: 'string',
      maxLength: 8
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
          scope: '#/properties/postalCode',
          label: 'ZIP Code',
          options: {
            trim: true,
            restrict: true
          }
        },
        {
          type: 'Control',
          scope: '#/properties/postalCodeWithoutTrim',
          label: 'ZIP Code',
          options: {
            trim: false,
            restrict: true
          }
        },
        {
          type: 'Control',
          scope: '#/properties/postalCodeWithoutRestrict',
          label: 'ZIP Code',
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
  postalCode: '12345678',
  postalCodeWithoutTrim: '12345678',
  postalCodeWithoutRestrict: '123456789',
};

registerExamples([
  {
    name: 'text',
    label: 'Text',
    data,
    schema,
    uiSchema: uischema,
  }
]);
