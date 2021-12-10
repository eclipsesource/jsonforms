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
import { data as day4Data, schema as day4Schema } from './day4';

export const schema = day4Schema;

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      label: false,
      scope: '#/properties/done'
    },
    {
      type: 'Control',
      scope: '#/properties/name'
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/dueDate'
        },
        {
          type: 'Control',
          scope: '#/properties/rating'
        }
      ]
    },
    {
      type: 'Control',
      scope: '#/properties/description',
      options: {
        multi: true
      }
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/recurrence'
        },
        {
          type: 'Control',
          scope: '#/properties/recurrenceInterval',
          rule: {
            effect: 'HIDE',
            condition: {
              scope: '#/properties/recurrence',
              schema: { enum: ['Never'] }
            }
          }
        }
      ]
    }
  ]
};

export const categoryUiSchema = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'Main',
      elements: [
        {
          type: 'Control',
          label: false,
          scope: '#/properties/done'
        },
        {
          type: 'Control',
          scope: '#/properties/name'
        },
        {
          type: 'Control',
          scope: '#/properties/description',
          options: {
            multi: true
          }
        }
      ]
    },
    {
      type: 'Category',
      label: 'Additional',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/dueDate'
            },
            {
              type: 'Control',
              scope: '#/properties/rating'
            }
          ]
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/recurrence'
            },
            {
              type: 'Control',
              scope: '#/properties/recurrenceInterval',
              rule: {
                effect: 'HIDE',
                condition: {
                  scope: '#/properties/recurrence',
                  schema: { enum: ['Never'] }
                }
              }
            }
          ]
        }
      ]
    }
  ]
};

export const data = day4Data;

registerExamples([
  {
    name: 'day5',
    label: 'Day 5',
    data,
    schema,
    uischema
  },
  {
    name: 'day5_category',
    label: 'Day 5 With Category',
    data,
    schema,
    uischema: categoryUiSchema
  }
]);
