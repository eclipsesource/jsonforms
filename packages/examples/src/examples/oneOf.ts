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
      additionalProperties: false,
    },
    user: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        mail: { type: 'string' },
      },
      required: ['name', 'mail'],
      additionalProperties: false,
    },
  },

  type: 'object',

  properties: {
    name: { type: 'string' },
    addressOrUser: {
      oneOf: [
        { $ref: '#/definitions/address' },
        { $ref: '#/definitions/user' },
      ],
    },
  },
  required: ['name'],
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name',
    },
    {
      type: 'Control',
      scope: '#/properties/addressOrUser',
    },
  ],
};

const data = {
  name: 'test',
  addressOrUser: {
    name: 'User',
    mail: 'mail@example.com',
  },
};

const schema_1265_array = {
  type: 'object',
  properties: {
    coloursOrNumbers: {
      oneOf: [
        {
          $ref: '#/definitions/colours',
        },
        {
          $ref: '#/definitions/numbers',
        },
        {
          $ref: '#/definitions/shapes',
        },
      ],
    },
  },
  definitions: {
    colours: {
      title: 'Colours',
      type: 'array',
      minItems: 1,
      items: {
        title: 'Type',
        type: 'string',
        enum: ['Red', 'Green', 'Blue'],
      },
    },
    numbers: {
      title: 'Numbers',
      type: 'array',
      minItems: 1,
      items: {
        title: 'Type',
        type: 'string',
        enum: ['One', 'Two', 'Three'],
      },
    },
    shapes: {
      title: 'Shapes',
      type: 'array',
      minItems: 1,
      items: {
        title: 'Type',
        type: 'string',
        enum: ['Circle', 'Triangle', 'Square'],
      },
    },
  },
};

const schema_1265_object = {
  type: 'object',
  properties: {
    coloursOrNumbers: {
      oneOf: [
        {
          $ref: '#/definitions/colours',
        },
        {
          $ref: '#/definitions/numbers',
        },
        {
          $ref: '#/definitions/shapes',
        },
      ],
    },
  },
  additionalProperties: false,
  definitions: {
    colours: {
      title: 'Colours',
      type: 'object',
      properties: {
        colour: {
          title: 'Type',
          type: 'string',
          enum: ['Red', 'Green', 'Blue'],
        },
      },
      additionalProperties: false,
    },
    numbers: {
      title: 'Numbers',
      type: 'object',
      properties: {
        number: {
          title: 'Type',
          type: 'string',
          enum: ['One', 'Two', 'Three'],
        },
      },
      additionalProperties: false,
    },
    shapes: {
      title: 'Shapes',
      type: 'object',
      properties: {
        shape: {
          title: 'Type',
          type: 'string',
          enum: ['Circle', 'Triangle', 'Square'],
        },
      },
      additionalProperties: false,
    },
  },
};

const schema_1265_simple = {
  type: 'object',
  properties: {
    coloursOrNumbers: {
      oneOf: [
        {
          $ref: '#/definitions/colours',
        },
        {
          $ref: '#/definitions/numbers',
        },
        {
          $ref: '#/definitions/shapes',
        },
      ],
    },
  },
  definitions: {
    colours: {
      title: 'Colours',
      type: 'string',
      enum: ['Red', 'Green', 'Blue'],
    },
    numbers: {
      title: 'Numbers',
      type: 'string',
      enum: ['One', 'Two', 'Three'],
    },
    shapes: {
      title: 'Shapes',
      type: 'string',
      enum: ['Circle', 'Triangle', 'Square'],
    },
  },
};

const schema_1273 = {
  type: 'object',
  properties: {
    quantity: {
      oneOf: [
        {
          $ref: '#/definitions/unrangedQuantity',
        },
        {
          $ref: '#/definitions/rangedQuantity',
        },
      ],
    },
  },
  definitions: {
    unrangedQuantity: {
      title: 'Value',
      type: 'object',
      properties: {
        value: {
          type: 'number',
        },
        unit: {
          type: 'string',
        },
      },
      required: ['value', 'unit'],
    },
    rangedQuantity: {
      title: 'Range',
      type: 'object',
      properties: {
        valueLow: {
          type: 'number',
        },
        valueHigh: {
          type: 'number',
          maximum: 10,
        },
        unit: {
          type: 'string',
        },
      },
      required: ['valueLow', 'valueHigh', 'unit'],
    },
  },
};

const schema_1273_simple = {
  type: 'object',
  properties: {
    quantity: {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'number',
        },
      ],
    },
  },
};

const data_1273 = {
  quantity: {
    valueLow: 1,
    valueHigh: 100,
    unit: 'kg',
  },
};

registerExamples([
  {
    name: 'oneOf',
    label: 'oneOf',
    data,
    schema,
    uischema,
  },
  {
    name: 'oneOf_1265_array',
    label: 'oneOf - Validation for Arrays (Issue 1265)',
    data: { coloursOrNumbers: ['Foo'] },
    schema: schema_1265_array,
    uischema: undefined,
  },
  {
    name: 'oneOf_1265_object',
    label: 'oneOf - Validation for Objects (Issue 1265)',
    data: { coloursOrNumbers: { colour: 'Foo' } },
    schema: schema_1265_object,
    uischema: undefined,
  },
  {
    name: 'oneOf_1265_simple',
    label: 'oneOf - Validation for Primitives (Issue 1265)',
    data: { coloursOrNumbers: 'Foo' },
    schema: schema_1265_simple,
    uischema: undefined,
  },
  {
    name: 'oneOf_1273',
    label: 'oneOf - Preselection for Objects (Issue 1273)',
    data: data_1273,
    schema: schema_1273,
    uischema: undefined,
  },
  {
    name: 'oneOf_1273_simple',
    label: 'oneOf - Preselection for Primitives (Issue 1273 )',
    data: { quantity: 5 },
    schema: schema_1273_simple,
    uischema: undefined,
  },
]);
