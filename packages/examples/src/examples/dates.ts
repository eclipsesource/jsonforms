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
    schemaBased: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          format: 'date',
          description: 'schema-based date picker',
        },
        time: {
          type: 'string',
          format: 'time',
          description: 'schema-based time picker',
        },
        datetime: {
          type: 'string',
          format: 'date-time',
          description: 'schema-based datetime picker',
        },
      },
    },
    uiSchemaBased: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'does not allow to select days',
        },
        time: {
          type: 'string',
          description: '24 hour format',
        },
        datetime: {
          type: 'string',
          description: 'uischema-based datetime picker',
        },
      },
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
          scope: '#/properties/schemaBased/properties/date',
        },
        {
          type: 'Control',
          scope: '#/properties/schemaBased/properties/time',
        },
        {
          type: 'Control',
          scope: '#/properties/schemaBased/properties/datetime',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/uiSchemaBased/properties/date',
          label: 'Year Month Picker',
          options: {
            format: 'date',
            clearLabel: 'Clear it!',
            cancelLabel: 'Abort',
            okLabel: 'Do it',
            views: ['year', 'month'],
            dateFormat: 'YYYY.MM',
            dateSaveFormat: 'YYYY-MM',
          },
        },
        {
          type: 'Control',
          scope: '#/properties/uiSchemaBased/properties/time',
          options: {
            format: 'time',
            ampm: true,
          },
        },
        {
          type: 'Control',
          scope: '#/properties/uiSchemaBased/properties/datetime',
          options: {
            format: 'date-time',
            dateTimeFormat: 'DD-MM-YY hh:mm:a',
            dateTimeSaveFormat: 'YYYY/MM/DD h:mm a',
            ampm: true,
          },
        },
      ],
    },
  ],
};

export const data = {
  schemaBased: {
    date: new Date().toISOString().substr(0, 10),
    time: '13:37',
    datetime: new Date().toISOString(),
  },
  uiSchemaBased: {
    date: new Date().toISOString().substr(0, 10),
    time: '13:37',
    datetime: '1999/12/11 10:05 am',
  },
};
registerExamples([
  {
    name: 'dates',
    label: 'Dates',
    data,
    schema,
    uischema,
  },
]);
