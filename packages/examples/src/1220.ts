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
import { registerExamples } from './register';
import { Actions, JsonSchema, NOT_APPLICABLE, AnyAction, Dispatch } from '@jsonforms/core';

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

const uischema = {
  type: 'Control',
  scope: '#/properties/orders'
};
const detail_uischema = {
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
};

registerExamples([
  {
    name: '1220',
    label: 'Issue 1220',
    data,
    schema,
    uischema
  }
]);

const nestedArrayTester = (_jsonSchema: JsonSchema, schemaPath: string) => {
  return schemaPath === '#/properties/orders' ? 2 : NOT_APPLICABLE;
};
export const registerIssue1220UISchema = (dispatch: Dispatch<AnyAction>) => {
  dispatch(Actions.registerUISchema(nestedArrayTester, detail_uischema));
};
export const unregisterIssue1220UISchema = (dispatch: Dispatch<AnyAction>) => {
  dispatch(Actions.unregisterUISchema(nestedArrayTester));
};
