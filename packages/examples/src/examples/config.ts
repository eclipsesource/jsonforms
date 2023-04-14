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
    postalCode: {
      type: 'string',
      description: 'A Postal Code',
      maxLength: 5,
    },
    recurrenceInterval: {
      type: 'integer',
      description: 'A recurrence interval',
    },
  },
  required: ['postalCode'],
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/postalCode',
          label: 'Postal Code',
        },
        {
          type: 'Control',
          scope: '#/properties/recurrenceInterval',
          label: 'Recurrence Interval',
        },
      ],
    },
  ],
};

export const data = {
  postalCode: '12345',
};

const config = {
  restrict: true,
  trim: true,
  showUnfocusedDescription: true,
  hideRequiredAsterisk: true,
};

registerExamples([
  {
    name: 'configDefault',
    label: 'Configuration (Default)',
    data,
    schema,
    uischema: uischema,
  },
  {
    name: 'configCustom',
    label: 'Configuration (Custom)',
    data,
    schema,
    uischema,
    config,
  },
]);
