/*
  The MIT License

  Copyright (c) 2017-2026 EclipseSource Munich
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
    price: {
      type: 'number',
    },
    weight: {
      type: 'number',
    },
    quantity: {
      type: 'integer',
    },
    website: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
    voltage: {
      type: 'string',
      enum: ['110', '230', '400'],
    },
    frequency: {
      type: 'string',
      oneOf: [
        { const: '50', title: '50' },
        { const: '60', title: '60' },
      ],
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
          scope: '#/properties/price',
          options: { startAdornment: '€' },
        },
        {
          type: 'Control',
          scope: '#/properties/weight',
          options: { endAdornment: 'kg' },
        },
        {
          type: 'Control',
          scope: '#/properties/quantity',
          options: { endAdornment: 'pcs' },
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/website',
          options: { startAdornment: 'https://' },
        },
        {
          type: 'Control',
          scope: '#/properties/username',
          options: { startAdornment: '@', endAdornment: '.example.com' },
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/voltage',
          label: 'Voltage (autocomplete)',
          options: { endAdornment: 'V' },
        },
        {
          type: 'Control',
          scope: '#/properties/voltage',
          label: 'Voltage (select)',
          options: { autocomplete: false, endAdornment: 'V' },
        },
        {
          type: 'Control',
          scope: '#/properties/frequency',
          options: { autocomplete: false, endAdornment: 'Hz' },
        },
      ],
    },
  ],
};

export const data = {
  weight: 12.5,
  username: 'jane',
  voltage: '230',
};

registerExamples([
  {
    name: 'adornments',
    label: 'Adornments',
    data,
    schema,
    uischema,
  },
]);
