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
  properties: {
    numericKeys: {
      type: 'object',
      title: 'Object with purely numeric property names',
      properties: {
        '15': {
          type: 'string',
          title: 'Property "15"',
        },
        '42': {
          type: 'string',
          title: 'Property "42"',
        },
      },
    },
    'property[0]': {
      type: 'string',
      title: 'Top-level property containing brackets: "property[0]"',
    },
    'nested[0]': {
      type: 'object',
      title: 'Object property whose name contains brackets: "nested[0]"',
      properties: {
        value: {
          type: 'string',
          title: 'Inner value',
        },
      },
    },
    'dashed-key': {
      type: 'object',
      title: 'Mixed: dashed parent with numeric and dashed children',
      properties: {
        '15': {
          type: 'string',
          title: 'Numeric child "15"',
        },
        'non-numeric-key': {
          type: 'string',
          title: 'Dashed sibling',
        },
      },
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Numeric property names',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/numericKeys/properties/15',
        },
        {
          type: 'Control',
          scope: '#/properties/numericKeys/properties/42',
        },
      ],
    },
    {
      type: 'Group',
      label: 'Property names containing brackets',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/property[0]',
        },
        {
          type: 'Control',
          scope: '#/properties/nested[0]/properties/value',
        },
      ],
    },
    {
      type: 'Group',
      label: 'Mixed numeric and dashed property names',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/dashed-key/properties/15',
        },
        {
          type: 'Control',
          scope: '#/properties/dashed-key/properties/non-numeric-key',
        },
      ],
    },
  ],
};

export const data = {};

registerExamples([
  {
    name: 'special-property-names',
    label: 'Special property names (numeric and bracket characters)',
    data,
    schema,
    uischema,
  },
]);
