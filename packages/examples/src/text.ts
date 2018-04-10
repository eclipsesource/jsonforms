import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    address: {
      type: 'string',
      maxLength: 29
    },
    addressWithoutTrim: {
      type: 'string',
      maxLength: 29
    },
    addressWithoutRestrict: {
      type: 'string',
      maxLength: 29
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
          scope: '#/properties/address',
          label: 'Address',
          options: {
            trim: true,
            restrict: true
          }
        },
        {
          type: 'Control',
          scope: '#/properties/addressWithoutTrim',
          label: 'Address (without trimming)',
          options: {
            trim: false,
            restrict: true
          }
        },
        {
          type: 'Control',
          scope: '#/properties/addressWithoutRestrict',
          label: 'Address (without restricting)',
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
  address: 'Arcisstrasse 21, 80333 Munich',
  addressWithoutTrim: 'Arcisstrasse 21, 80333 Munich, Germany',
  addressWithoutRestrict: 'Arcisstrasse 21, 80333 Munich, Germany'
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
