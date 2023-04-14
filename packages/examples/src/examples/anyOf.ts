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

  definitions: {
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
    users: {
      type: 'array',
      items: { $ref: '#/definitions/user' },
    },
    addresses: {
      type: 'array',
      items: { $ref: '#/definitions/address' },
    },
  },

  type: 'object',

  properties: {
    addressOrUser: {
      anyOf: [
        { $ref: '#/definitions/address' },
        { $ref: '#/definitions/user' },
      ],
    },
    addressesOrUsers: {
      anyOf: [
        { $ref: '#/definitions/addresses' },
        { $ref: '#/definitions/users' },
      ],
    },
    addressesOrUsersAnyOfItems: {
      type: 'array',
      items: {
        anyOf: [
          { $ref: '#/definitions/addresses' },
          { $ref: '#/definitions/users' },
        ],
      },
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/addressOrUser',
    },
    {
      type: 'Control',
      scope: '#/properties/addressesOrUsers',
      label: 'Addresses or Users (AnyOf Schema)',
    },
    {
      type: 'Control',
      scope: '#/properties/addressesOrUsersAnyOfItems',
      label: 'Addresses or Users (AnyOf Array Items)',
    },
  ],
};

const data = {
  addressOrUser: {
    street_address: '1600 Pennsylvania Avenue NW',
    city: 'Washington',
    state: 'DC',
  },
};

const schema_simple = {
  type: 'object',
  properties: {
    foo: {
      anyOf: [{ type: 'string' }, { enum: ['foo', 'bar'] }],
    },
  },
};

registerExamples([
  {
    name: 'anyOf',
    label: 'anyOf',
    data,
    schema,
    uischema,
  },
  {
    name: 'anyOf_simple',
    label: 'AnyOf Simple',
    data: { foo: 'foo' },
    schema: schema_simple,
    uischema: undefined,
  },
]);
