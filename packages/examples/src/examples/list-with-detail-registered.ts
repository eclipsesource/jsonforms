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

export const data = {
  warehouseitems: [
    {
      name: 'Fantasy Book',
      buyer: {
        email: 'buyerA@info.org',
        age: 18,
      },
      status: 'warehouse',
    },
    {
      name: 'Boardgame',
      buyer: {
        email: 'buyerB@info.org',
        age: 45,
      },
      status: 'shipping',
    },
    {
      name: 'Energy Drink',
      buyer: {
        email: 'buyerC@info.org',
        age: 90,
      },
      status: 'delivered',
    },
  ],
};

export const schema = {
  definitions: {
    warehouseitem: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        buyer: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            age: { type: 'number' },
          },
        },
        status: {
          type: 'string',
          enum: ['warehouse', 'shipping', 'delivered'],
        },
      },
      required: ['name'],
    },
  },
  type: 'object',
  properties: {
    warehouseitems: {
      type: 'array',
      items: {
        $ref: '#/definitions/warehouseitem',
      },
    },
  },
};

export const uischema = {
  type: 'ListWithDetail',
  scope: '#/properties/warehouseitems',
  options: {
    labelRef: '#/items/properties/name',
    // detail uischema is registered in example itself
  },
};

registerExamples([
  {
    name: 'list-with-detail-registered',
    label: 'List With Detail (Registered Detail UISchema)',
    data,
    schema,
    uischema,
  },
]);
