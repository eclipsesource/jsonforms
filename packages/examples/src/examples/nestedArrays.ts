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
import { ControlElement, JsonFormsUISchemaRegistryEntry, JsonSchema, NOT_APPLICABLE } from '@jsonforms/core';
import { StateProps } from '..';

const schema = {
  definitions: {
    choicesContainer: {
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
  },
  type: 'object',
  properties: {
    exampleArray: {
      type: 'array',
      items: {
        $ref: '#/definitions/choicesContainer'
      }
    }
  }
};

export const uischema = {
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

const control1: ControlElement = {
  type: 'Control',
  scope: '#/properties/name'
};
// register inner layout
const control2: ControlElement = {
  type: 'Control',
  scope: '#/properties/choices'
};

const uischemas = [
  {
    tester: (_jsonSchema: JsonSchema, schemaPath: string) => {
      return schemaPath === '#/properties/exampleArray' ? 2 : NOT_APPLICABLE;
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [control1, control2]
    }
  }
];

const actions = [
  {
    'label': 'Register NestedArray UISchema',
    'apply': (props: StateProps) => {
      return {
        ...props,
        uischemas: uischemas
      }
    }
  },
  {
    'label': 'Unregister NestedArray UISchema',
    'apply': (props: StateProps) => {
      const uischemas: JsonFormsUISchemaRegistryEntry[] = undefined;
      return {
        ...props,
        uischemas: uischemas
      }
    }
  },
]

registerExamples([
  {
    name: 'nestedArray',
    label: 'Nested Array',
    data,
    schema,
    uischema,
    actions
  }
]);
