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
    name: {
      type: 'string',
      minLength: 1,
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      format: 'password',
      minLength: 8,
    },
    age: {
      type: 'integer',
      minimum: 0,
    },
    rating: {
      type: 'number',
      minimum: 0,
      maximum: 5,
    },
    birthDate: {
      type: 'string',
      format: 'date',
    },
    role: {
      type: 'string',
      enum: ['admin', 'editor', 'viewer'],
    },
    notes: {
      type: 'string',
      maxLength: 500,
    },
  },
  required: [
    'name',
    'email',
    'password',
    'age',
    'rating',
    'birthDate',
    'role',
    'notes',
  ],
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/name' },
        { type: 'Control', scope: '#/properties/email' },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/password' },
        { type: 'Control', scope: '#/properties/birthDate' },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/age' },
        { type: 'Control', scope: '#/properties/rating' },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/role' },
        {
          type: 'Control',
          scope: '#/properties/notes',
          options: { multi: true },
        },
      ],
    },
  ],
};

export const data = {};

registerExamples([
  {
    name: 'show-errors-on-touch',
    label: 'Show Errors On Touch',
    data,
    schema,
    uischema,
  },
]);
