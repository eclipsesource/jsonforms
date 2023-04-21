/*
  The MIT License
  
  Copyright (c) 2017-2021 EclipseSource Munich
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

export const data = {
  'an-array-of-strings': ['foo', 'bar', 'foobar'],
};
export const schema = {
  type: 'object',
  properties: {
    'an-array-of-strings': {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};
export const uischema = {
  type: 'ListWithDetail',
  scope: '#/properties/an-array-of-strings',
};

registerExamples([
  {
    name: 'list-with-detail-primitive-string',
    label: 'List With Detail primitive (string)',
    data,
    schema,
    uischema,
  },
]);

export const data_number = {
  'an-array-of-numbers': [1, 2, 3],
};
export const schema_number = {
  type: 'object',
  properties: {
    'an-array-of-numbers': {
      type: 'array',
      items: {
        type: 'number',
      },
    },
  },
};
export const uischema_number = {
  type: 'ListWithDetail',
  scope: '#/properties/an-array-of-numbers',
};

registerExamples([
  {
    name: 'list-with-detail-primitive-number',
    label: 'List With Detail primitive (number)',
    data: data_number,
    schema: schema_number,
    uischema: uischema_number,
  },
]);
