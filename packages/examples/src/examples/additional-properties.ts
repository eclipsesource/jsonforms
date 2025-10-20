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
    propertiesString: {
      type: 'string',
    },
  },
  propertyNames: {
    minLength: 2,
  },
  patternProperties: {
    '^string$': {
      type: 'string',
    },
    '^number$': {
      type: 'number',
    },
    '^integer$': {
      type: 'integer',
    },
    '^object$': {
      type: 'object',
      properties: {
        prop1: {
          type: 'string',
        },
      },
    },
    '^boolean$': {
      type: 'boolean',
    },
    '^stringArray$': {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    '^numberArray$': {
      type: 'array',
      items: {
        type: 'number',
      },
    },
    '^integerArray$': {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    '^objectArray$': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          prop1: {
            type: 'string',
          },
        },
      },
    },
    '^booleanArray$': {
      type: 'array',
      items: {
        type: 'boolean',
      },
    },
  },
  additionalProperties: {
    type: 'string',
    title: 'Additional Properties',
  },
  maxProperties: 15,
};

export const uischema = {
  type: 'Control',
  scope: '#/',
};

const data = {
  propertiesString: 'data',
  string: 'string value',
  number: 10.2,
  integer: 11,
  object: {
    prop1: 'prop 1 value',
  },
  boolean: true,
  stringArray: ['value1', 'value2'],
  numberArray: [12.2],
  integerArray: [33],
  objectArray: [{ prop1: 'prop1 val' }, {}],
  booleanArray: [false, true],
};

registerExamples([
  {
    name: 'additional-properties',
    label: 'Additional Properties',
    data,
    schema,
    uischema,
  },
]);
