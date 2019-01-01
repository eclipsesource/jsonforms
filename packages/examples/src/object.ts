import { registerExamples } from './register';

export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',

  type: 'object',

  properties: {
    address: {
      type: 'object',
      properties: {
        street_address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' }
      },
      required: ['street_address', 'city', 'state']
    },
    user: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        mail: { type: 'string' }
      },
      required: ['name', 'mail']
    }
  }
};

export const uischemaRoot = {
  type: 'Control',
  scope: '#'
};

export const uischemaNonRoot = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/address'
    },
    {
      type: 'Control',
      scope: '#/properties/user',
      rule: {
        effect: 'SHOW',
        condition: {
          type: 'LEAF',
          scope: '#/properties/address/properties/state',
          expectedValue: 'DC'
        }
      }
    }
  ]
};

const data = {
  address: {
    street_address: '1600 Pennsylvania Avenue NW',
    city: 'Washington',
    state: 'DC'
  }
};

registerExamples([
  {
    name: 'rootObject',
    label: 'Root Object',
    data,
    schema,
    uischema: uischemaRoot
  },
  {
    name: 'object',
    label: 'Object',
    data,
    schema,
    uischema: uischemaNonRoot
  }
]);
