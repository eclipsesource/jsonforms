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
      minLength: 1,
      description: "The task's name",
    },
    recurrence: {
      type: 'string',
      enum: ['Never', 'Daily', 'Weekly', 'Monthly'],
    },
  },
  anyOf: [
    {
      if: {
        properties: {
          recurrence: {
            const: 'Never',
          },
        },
      },
      then: {
        properties: {
          lastname: {
            type: 'string',
          },
          age: {
            type: 'number',
          },
        },
      },
    },
  ],
};

export const uischema = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/name',
        },
        {
          type: 'Control',
          scope: '#/properties/recurrence',
        },
        {
          type: 'Control',
          scope: '#/anyOf/0/then/properties/lastname',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/recurrence',
              schema: {
                const: 'Never',
              },
            },
          },
        },
        {
          type: 'Control',
          scope: '#/properties/age',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/recurrence',
              schema: {
                const: 'Never',
              },
            },
          },
        },
      ],
    },
  ],
};

const data = {};

registerExamples([
  {
    name: 'conditional-schema-compositions',
    label: 'Conditional Schema Compositions',
    data,
    schema,
    uischema,
  },
]);
