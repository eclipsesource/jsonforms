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
import { JsonFormsUISchemaRegistryEntry, JsonSchema, NOT_APPLICABLE } from '@jsonforms/core';
import { StateProps } from '../example';

const data = {
  orders: [
    {
      title: '42 killer robots',
      ordered: true,
      assignee: 'Philip J. Fry'
    }
  ]
};

const schema = {
  definitions: {
    order: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          minLength: 5
        },
        ordered: { type: 'boolean' },
        assignee: { type: 'string' },
        // needed to enforce nested layout instead of table
        choices: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      },
      required: ['title']
    }
  },
  type: 'object',
  properties: {
    orders: {
      type: 'array',
      items: {
        $ref: '#/definitions/order'
      }
    }
  }
};

export const uischema = {
  type: 'Control',
  scope: '#/properties/orders'
};

const uischemas = [
  {
    tester: (_jsonSchema: JsonSchema, schemaPath: string) => {
      return schemaPath === '#/properties/orders' ? 2 : NOT_APPLICABLE;
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/title'
        },
        {
          type: 'Control',
          scope: '#/properties/ordered'
        },
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/assignee'
            }
          ],
          rule: {
            effect: 'SHOW',
            condition: {
              type: 'LEAF',
              scope: '#/properties/ordered',
              expectedValue: true
            }
          }
        }
      ]
    },
  },
];

const actions = [
  {
    'label': 'Register Issue 1220 UISchema',
    'apply': (props: StateProps) => {
      return {
        ...props,
        uischemas: uischemas
      }
    }
  },
  {
    'label': 'Unregister Issue 1220 UISchema',
    'apply': (props: StateProps) => {
      const uischemas: JsonFormsUISchemaRegistryEntry[] = undefined;
      return {
        ...props,
        uischemas: uischemas
      }
    }
  },
];

registerExamples([
  {
    name: '1220',
    label: 'Issue 1220',
    data,
    schema,
    uischema,
    actions
  }
]);
