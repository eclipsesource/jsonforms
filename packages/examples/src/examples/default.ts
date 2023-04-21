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
    dueDate: {
      type: 'string',
      format: 'date',
      default: '2019-04-01',
    },
  },
  required: ['name', 'name_noDefault'],
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
      scope: '#/properties/name_noDefault',
    },
    {
      type: 'Control',
      label: false,
      scope: '#/properties/done',
    },
    {
      type: 'Control',
      scope: '#/properties/description',
      options: {
        multi: true,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/rating',
    },
    {
      type: 'Control',
      scope: '#/properties/cost',
    },
    {
      type: 'Control',
      scope: '#/properties/dueDate',
    },
  ],
};

export const data = {
  name: 'Send email to Adrian',
  name_noDefault: 'Send email to Adrian',
  description: 'Confirm if you have passed the subject\nHereby ...',
  done: true,
  rating: 1,
  cost: 3.14,
  dueDate: '2019-05-01',
};

registerExamples([
  {
    name: 'default',
    label: 'Default',
    data,
    schema,
    uischema,
  },
]);
