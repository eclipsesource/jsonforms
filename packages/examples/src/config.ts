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
          scope: '#/properties/postalCode',
          label: '%postalcode'
        }
      ]
    }
  ]
};

export const data = {
  postalCode: '12345'
};

const translations = {
  'en-US': {
    postalcode: 'Postal Code'
  },
  'de-DE': {
    postalcode: 'Postleitzahl'
  }
};

const config = {
  restrict: true,
  trim: true
};

registerExamples([
  {
    name: 'configDefault',
    label: 'Configuration (Default)',
    data,
    schema,
    uiSchema: uischema,
    translations
  },
  {
    name: 'configCustom',
    label: 'Configuration (Custom)',
    data,
    schema,
    uiSchema: uischema,
    translations,
    config
  }
]);
