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
import {
  data as day2Data,
  schema as day2Schema,
  uischema as day2UiSchema
} from './day2';

export const schema = {
  type: 'object',
  properties: {
    ...day2Schema.properties,
    dueDate: {
      type: 'string',
      format: 'date'
    },
    rating: {
      type: 'integer',
      maximum: 5
    }
  },
  required: ['name']
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    ...day2UiSchema.elements,
    {
      type: 'Control',
      scope: '#/properties/dueDate'
    },
    {
      type: 'Control',
      scope: '#/properties/rating'
    }
  ]
};

export const data = {
  ...day2Data,
  rating: 3
};

registerExamples([
  {
    name: 'day3',
    label: 'Day 3',
    data,
    schema,
    uischema
  }
]);
