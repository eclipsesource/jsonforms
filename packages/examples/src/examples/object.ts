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
  $schema: 'http://json-schema.org/draft-07/schema#',

  type: 'object',

  properties: {
    address: {
      type: 'object',
      properties: {
        street_address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
      },
      required: ['street_address', 'city', 'state'],
    },
    user: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        mail: { type: 'string' },
      },
      required: ['name', 'mail'],
    },
  },
};

export const uischemaRoot = {
  type: 'Control',
  scope: '#',
};

export const uischemaNonRoot = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/address',
    },
    {
      type: 'Control',
      scope: '#/properties/user',
      rule: {
        effect: 'SHOW',
        condition: {
          type: 'LEAF',
          scope: '#/properties/address/properties/state',
          expectedValue: 'DC',
        },
      },
      options: {
        detail: {
          type: 'Group',
          label: 'User Data',
          elements: [
            { type: 'Control', scope: '#/properties/name' },
            {
              type: 'Control',
              scope: '#/properties/mail',
            },
          ],
        },
      },
    },
  ],
};

const data = {
  address: {
    street_address: '1600 Pennsylvania Avenue NW',
    city: 'Washington',
    state: 'DC',
  },
};

registerExamples([
  {
    name: 'rootObject',
    label: 'Object - Root Scope',
    data,
    schema,
    uischema: uischemaRoot,
  },
  {
    name: 'object',
    label: 'Object',
    data,
    schema,
    uischema: uischemaNonRoot,
  },
]);
