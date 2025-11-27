/*
  The MIT License
  
  Copyright (c) 2017-2025 EclipseSource Munich
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

/**
 * Prepend and Append Slots
 *
 * Prepend Only:
 * - Display Name: Static decorative icon
 * - Password: Dynamic strength meter
 *
 * Append Only:
 * - Username: Async availability checker
 * - Email: Copy to clipboard button
 *
 * Both:
 * - Temperature: Dynamic icon + unit indicator
 */

export const schema = {
  type: 'object',
  properties: {
    // Prepend slot only
    displayName: {
      type: 'string',
      description: 'Decorative icon',
    },
    password: {
      type: 'string',
      description: 'Dynamic strength meter',
    },

    // Append slot only
    username: {
      type: 'string',
      maxLength: 20,
      description: 'Availability checker (try "admin" or "user")',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Copy to clipboard',
    },

    // Both prepend AND append slots
    temperature: {
      type: 'integer',
      minimum: -50,
      maximum: 50,
      description: 'Temperature with dynamic icon and unit (°C)',
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Label',
      text: 'Prepend Slot Only',
    },
    {
      type: 'Control',
      scope: '#/properties/displayName',
      options: {
        clearable: false,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/password',
      options: {
        clearable: false,
      },
    },

    {
      type: 'Label',
      text: 'Append Slot Only',
    },
    {
      type: 'Control',
      scope: '#/properties/username',
      options: {
        clearable: false,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/email',
      options: {
        clearable: false,
      },
    },

    {
      type: 'Label',
      text: 'Both Prepend and Append',
    },
    {
      type: 'Control',
      scope: '#/properties/temperature',
      options: {
        clearable: false,
      },
    },
  ],
};

export const data = {
  displayName: 'John Doe',
  password: '',
  username: '', // Start empty so checker can be tested
  email: 'user@example.com',
  temperature: 22,
};

registerExamples([
  {
    name: 'prepend-append-slots',
    label: 'Prepend/Append Slots (Basic)',
    data,
    schema,
    uischema,
  },
]);
