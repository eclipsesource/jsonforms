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

export const schema = {
  type: 'object',
  properties: {
    string: {
      type: 'string',
    },
    boolean: {
      type: 'boolean',
      description: 'Boolean description as a tooltip',
    },
    number: {
      type: 'number',
    },
    integer: {
      type: 'integer',
    },
    date: {
      type: 'string',
      format: 'date',
    },
    time: {
      type: 'string',
      format: 'time',
    },
    dateTime: {
      type: 'string',
      format: 'date-time',
    },
    enum: {
      type: 'string',
      enum: ['One', 'Two', 'Three'],
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/string',
    },
    {
      type: 'Control',
      scope: '#/properties/boolean',
    },
    {
      type: 'Control',
      scope: '#/properties/number',
    },
    {
      type: 'Control',
      scope: '#/properties/integer',
    },
    {
      type: 'Control',
      scope: '#/properties/date',
    },
    {
      type: 'Control',
      scope: '#/properties/time',
    },
    {
      type: 'Control',
      scope: '#/properties/dateTime',
    },
    {
      type: 'Control',
      scope: '#/properties/enum',
    },
  ],
};

export const data = {
  string: 'This is a string',
  boolean: true,
  number: 50.5,
  integer: 50,
  date: '2020-06-25',
  time: '23:08:00',
  dateTime: '2020-06-25T23:08:42+02:00',
  enum: 'Two',
};

export const extendedSchema = {
  type: 'object',
  properties: {
    multilineString: {
      type: 'string',
      description: 'Multiline Example',
    },
    slider: {
      type: 'number',
      minimum: 1,
      maximum: 5,
      default: 2,
      description: 'Slider Example',
    },
    trimText: {
      type: 'string',
      description:
        'Trim indicates whether the control shall grab the full width available',
    },
    restrictText: {
      type: 'string',
      maxLength: 5,
      description:
        'Restricts the input length to the set value (in this case: 5)',
    },
    unfocusedDescription: {
      type: 'string',
      description:
        'This description is shown even when the control is not focused',
    },
    hideRequiredAsterisk: {
      type: 'string',
      description: 'Hides the "*" symbol, when the field is required',
    },
    toggle: {
      type: 'boolean',
      description: 'The "toggle" option renders boolean values as a toggle.',
    },
  },
  required: ['hideRequiredAsterisk', 'restrictText'],
};

export const extendedUischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/multilineString',
      options: {
        multi: true,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/slider',
      options: {
        slider: true,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/trimText',
      options: {
        trim: true,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/restrictText',
      options: {
        restrict: true,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/unfocusedDescription',
      options: {
        showUnfocusedDescription: true,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/hideRequiredAsterisk',
      options: {
        hideRequiredAsterisk: true,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/toggle',
      label: 'Boolean as Toggle',
      options: {
        toggle: true,
      },
    },
  ],
};

export const extendedData = {
  multilineString: 'Multi-\nline\nexample',
  slider: 4,
  trimText: 'abcdefg',
  restrictText: 'abcde',
  toggle: false,
};

const combinedSchema = {
  ...extendedSchema,
  properties: {
    ...schema.properties,
    ...extendedSchema.properties,
  },
};

const combinedUiSchema = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'Normal controls',
      elements: [uischema],
    },
    {
      type: 'Category',
      label: 'Configured controls',
      elements: [extendedUischema],
    },
  ],
};

const combinedData = {
  ...data,
  ...extendedData,
};

registerExamples([
  {
    name: 'control-options',
    label: 'Control Options',
    data: combinedData,
    schema: combinedSchema,
    uischema: combinedUiSchema,
  },
]);
