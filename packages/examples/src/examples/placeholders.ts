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
    name: {
      type: 'string',
      default: 'foo',
    },
    enumWithoutAutocomplete: {
      type: 'string',
      enum: ['foo', 'bar'],
    },
    enumWithAutocomplete: {
      type: 'string',
      enum: ['foo', 'bar'],
    },
    name_noDefault: {
      type: 'string',
    },
    description: {
      type: 'string',
      default: 'bar',
    },
    rating: {
      type: 'integer',
      default: 5,
    },
    cost: {
      type: 'number',
      default: 5.5,
    },
    dueDate: {
      type: 'string',
      format: 'date',
      default: '2019-04-01',
    },
    date: {
      type: 'string',
      format: 'date',
    },
    datetime: {
      type: 'string',
      format: 'date-time',
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        placeholder: 'Enter your name.',
      },
    },
    {
      type: 'Control',
      scope: '#/properties/enumWithoutAutocomplete',
      options: {
        placeholder: 'Chose from options - autocomplete.',
        autocomplete: false,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/enumWithAutocomplete',
      options: {
        placeholder: 'Chose from options.',
      },
    },
    {
      type: 'Control',
      scope: '#/properties/name_noDefault',
      options: {
        placeholder: 'Enter your name.',
      },
    },
    {
      type: 'Control',
      scope: '#/properties/description',
      options: {
        multi: true,
        placeholder: 'Enter your description.',
      },
    },
    {
      type: 'Control',
      scope: '#/properties/rating',
      options: {
        placeholder: 'Enter rating.',
      },
    },
    {
      type: 'Control',
      scope: '#/properties/cost',
      options: {
        placeholder: 'Enter cost.',
      },
    },
    {
      type: 'Control',
      scope: '#/properties/dueDate',
      options: {
        placeholder: 'Enter due date.',
      },
    },
    {
      type: 'Control',
      scope: '#/properties/date',
      options: {
        placeholder: 'Enter proper date.',
      },
    },
    {
      type: 'Control',
      scope: '#/properties/datetime',
      options: {
        placeholder: 'Enter proper datetime.',
      },
    },
  ],
};

export const data = {
  name: '',
  name_noDefault: '',
  description: '',
  rating: '',
  cost: '',
  dueDate: '',
};

registerExamples([
  {
    name: 'placeholders',
    label: 'Placeholders',
    data,
    schema,
    uischema,
  },
]);
