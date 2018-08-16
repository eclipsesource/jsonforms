import { registerExamples } from './register';

export const orderSchema = {
  type: 'object',
  properties: {
    orderId: {
      type: 'string'
    },
    purchaseDate: {
      type: 'string',
      format: 'date'
    },
    price: {
      type: 'number'
    },
    shippingAddress: {
      '$ref': '#/definitions/shippingAddress'
    }
  },
  definitions: {
    shippingAddress: {
      type: 'object',
      properties: {
        aptNo: {
          type: 'integer'
        },
        streetNumber: {
          type: 'integer'
        }
      }
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
          scope: '#/properties/orderId'
        },
        {
          type: 'Control',
          scope: '#/properties/purchaseDate'
        },
        {
          type: 'Control',
          scope: '#/properties/price'
        },
      ]
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/shippingAddress/properties/aptNo'
        },
        {
          type: 'Control',
          scope: '#/properties/shippingAddress/properties/streetNumber'
        }
      ]
    }
  ]
};

export const data = {
  orderId: '123456',
  purchaseDate: '1985-06-02',
  price: 16,
  shippingAddress: {
    aptNo: 3,
    streetNumber: 12
  }
};

registerExamples([
  {
    name: 'scope',
    label: 'Scope',
    data,
    schema: orderSchema,
    uischema
  }
]);
