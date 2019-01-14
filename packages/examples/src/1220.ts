import { registerExamples } from './register';
import { Actions, JsonSchema, NOT_APPLICABLE } from '@jsonforms/core';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

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
