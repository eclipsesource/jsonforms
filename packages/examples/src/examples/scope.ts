/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { registerExamples } from '../register';

export const orderSchema = {
  type: 'object',
  properties: {
    orderId: {
      type: 'string',
    },
    purchaseDate: {
      type: 'string',
      format: 'date',
    },
    price: {
      type: 'number',
    },
    shippingAddress: {
      $ref: '#/definitions/shippingAddress',
    },
  },
  definitions: {
    shippingAddress: {
      type: 'object',
      properties: {
        aptNo: {
          type: 'integer',
        },
        streetNumber: {
          type: 'integer',
        },
      },
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/orderId',
        },
        {
          type: 'Control',
          scope: '#/properties/purchaseDate',
        },
        {
          type: 'Control',
          scope: '#/properties/price',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/shippingAddress/properties/aptNo',
        },
        {
          type: 'Control',
          scope: '#/properties/shippingAddress/properties/streetNumber',
        },
      ],
    },
  ],
};

export const data = {
  orderId: '123456',
  purchaseDate: '1985-06-02',
  price: 16,
  shippingAddress: {
    aptNo: 3,
    streetNumber: 12,
  },
};

registerExamples([
  {
    name: 'scope',
    label: 'Scope',
    data,
    schema: orderSchema,
    uischema,
  },
]);
