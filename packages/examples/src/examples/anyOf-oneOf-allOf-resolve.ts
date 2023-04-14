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
  $defs: {
    Base: {
      type: 'object',
      properties: {
        width: {
          type: 'integer',
        },
      },
    },
    Child: {
      type: 'object',
      allOf: [
        { $ref: '#/$defs/Base' },
        {
          properties: {
            geometry: {
              type: 'string',
            },
          },
        },
      ],
    },
  },
  type: 'object',
  properties: {
    element: {
      $ref: '#/$defs/Child',
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Label',
      text: 'AllOfRenderer',
    },
    {
      type: 'Control',
      scope: '#/properties/element',
    },
    {
      type: 'Label',
      text: 'Manual controls',
    },
    {
      type: 'Control',
      scope: '#/properties/element/properties/width',
    },
    {
      type: 'Control',
      scope: '#/properties/element/properties/geometry',
    },
  ],
};

const data = {};

registerExamples([
  {
    name: 'anyOf-oneOf-allOf-resolve',
    label: 'AnyOf OneOf AllOf Resolve',
    data,
    schema,
    uischema,
  },
]);
