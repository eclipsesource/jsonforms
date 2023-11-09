/*
  The MIT License
  
  Copyright (c) 2023 STMicroelectronics
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the 'Software'), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { convertDateToString } from '@jsonforms/core';
import { registerExamples } from '../register';

export const schema = {
  definitions: {
    itemsType: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          default: 'foo1',
        },
        name_noDefault: {
          type: 'string',
        },
        description: {
          type: 'string',
          default: 'bar',
        },
        done: {
          type: 'boolean',
          default: false,
        },
        rating: {
          type: 'integer',
          default: 5,
        },
        cost: {
          type: 'number',
          default: 5.5,
        },
        date: {
          type: 'string',
          format: 'date',
          default: convertDateToString(new Date(), 'date'),
        },
      },
    },
    stringDef: { type: 'string', default: 'excellent' },
    numberDef: { type: 'number', default: 10 },
    intDef: { type: 'integer', default: 11 },
    boolDef: { type: 'boolean', default: true },
    arrayDef: { type: 'array', default: ['a', 'b', 'c'] },
  },
  type: 'object',
  properties: {
    objectArray: {
      type: 'array',
      items: {
        $ref: '#/definitions/itemsType',
      },
    },
    stringArray: {
      type: 'array',
      items: {
        type: 'string',
        default: '123',
      },
    },
    objectArrayWithPropertyRefs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          string1: { $ref: '#/definitions/stringDef' },
          string2: { type: 'string' },
          number: { $ref: '#/definitions/numberDef' },
          int: { $ref: '#/definitions/intDef' },
          bool: { $ref: '#/definitions/boolDef' },
          array: { $ref: '#/definitions/arrayDef' },
        },
      },
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/objectArray',
    },
    {
      type: 'Control',
      scope: '#/properties/stringArray',
    },
    {
      type: 'Control',
      scope: '#/properties/objectArrayWithPropertyRefs',
    },
  ],
};

export const data = {};

registerExamples([
  {
    name: 'array-with-defaults',
    label: 'Array with defaults',
    data,
    schema,
    uischema,
  },
]);
