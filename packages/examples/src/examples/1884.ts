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

export const schema = {
  type: 'object',
  required: ['age'],
  properties: {
    firstName: {
      type: 'string',
      minLength: 2,
      maxLength: 20,
    },
    lastName: {
      type: 'string',
      minLength: 5,
      maxLength: 15,
    },
    age: {
      type: 'integer',
      minimum: 18,
      maximum: 100,
    },
    gender: {
      type: 'string',
      enum: ['Male', 'Female', 'Undisclosed'],
    },
    height: {
      type: 'number',
    },
    dateOfBirth: {
      type: 'string',
      format: 'date',
    },
    rating: {
      type: 'integer',
    },
    committer: {
      type: 'boolean',
    },
    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
        },
        streetnumber: {
          type: 'string',
        },
        postalCode: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
      },
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Label',
      text: 'Toggle the committer boolean to enable/disable the address block.',
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/firstName',
        },
        {
          type: 'Control',
          scope: '#/properties/lastName',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/age',
        },
        {
          type: 'Control',
          scope: '#/properties/dateOfBirth',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/height',
        },
        {
          type: 'Control',
          scope: '#/properties/gender',
        },
        {
          type: 'Control',
          scope: '#/properties/committer',
        },
      ],
    },
    {
      type: 'Group',
      label: 'Address for Shipping T-Shirt',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/address/properties/street',
            },
            {
              type: 'Control',
              scope: '#/properties/address/properties/streetnumber',
            },
          ],
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/address/properties/postalCode',
            },
            {
              type: 'Control',
              scope: '#/properties/address/properties/city',
            },
          ],
        },
      ],
      rule: {
        effect: 'ENABLE',
        condition: {
          scope: '#/properties/committer',
          schema: {
            const: true,
          },
        },
      },
    },
  ],
};

export const data = {
  firstName: 'Max',
  lastName: 'Power',
  committer: false,
};

registerExamples([
  {
    name: '1884',
    label: 'Issue 1884 - Nested enable/disable',
    data,
    schema,
    uischema,
  },
]);
