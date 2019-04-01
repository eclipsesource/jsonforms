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
import {
  Actions,
  ControlElement,
  JsonSchema,
  NOT_APPLICABLE,
  VerticalLayout
} from '@jsonforms/core';
import { AnyAction, Dispatch } from 'redux';

const schema = {
  type: 'object',
  properties: {
    exampleArray: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          choices: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }
    }
  }
};

const uischema = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'Control',
      label: {
        text: 'Example Array',
        show: true
      },
      scope: '#/properties/exampleArray'
    }
  ]
};

const data = {
  exampleArray: [
    {
      choices: ['This', 'is', 'an', 'example'],
      name: 'Hi there'
    }
  ]
};

registerExamples([
  {
    name: 'nestedArray',
    label: 'Nested Array',
    data,
    schema,
    uischema
  }
]);

const nestedArrayTester = (_jsonSchema: JsonSchema, schemaPath: string) => {
  return schemaPath === '#/properties/exampleArray' ? 2 : NOT_APPLICABLE;
};
const control1: ControlElement = {
  type: 'Control',
  scope: '#/properties/name'
};
// register inner layout
const control2: ControlElement = {
  type: 'Control',
  scope: '#/properties/choices'
};
export const nestedArrayLayout: VerticalLayout = {
  type: 'VerticalLayout',
  elements: [control1, control2]
};
export const registerNestedArrayUISchema = (dispatch: Dispatch<AnyAction>) => {
  dispatch(Actions.registerUISchema(nestedArrayTester, nestedArrayLayout));
};
export const unregisterNestedArrayUISchema = (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(Actions.unregisterUISchema(nestedArrayTester));
};
