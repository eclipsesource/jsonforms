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
import { StateProps } from '../example';
import { registerExamples } from '../register';

export const schema = {
  type: 'object',
  properties: {
    toggleTopLayout: {
      type: 'boolean',
    },
    topString: {
      type: 'string',
    },
    middleNumber: {
      type: 'number',
    },
    toggleBottomLayout: {
      type: 'boolean',
    },
    bottomBoolean: {
      type: 'boolean',
    },
  },
};
export const uischema = {
  type: 'VerticalLayout',
  rule: {
    effect: 'ENABLE',
    condition: {
      scope: '#/properties/toggleTopLayout',
      schema: { const: true },
    },
  },
  elements: [
    {
      type: 'Control',
      scope: '#/properties/topString',
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/middleNumber',
        },
        {
          type: 'Group',
          label: 'group',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/toggleBottomLayout',
              schema: { const: true },
            },
          },
          elements: [
            {
              type: 'Control',
              scope: '#/properties/bottomBoolean',
            },
          ],
        },
      ],
    },
  ],
} as any;

export const data = {
  toggleTopLayout: true,
  toggleBottomLayout: true,
  toggleControl: true,
};

const actions = [
  {
    label: 'Enable/Disable top layout',
    apply: (props: StateProps) => {
      return {
        ...props,
        data: { ...props.data, toggleTopLayout: !props.data.toggleTopLayout },
      };
    },
  },
  {
    label: 'Show/Hide bottom layout',
    apply: (props: StateProps) => {
      return {
        ...props,
        data: {
          ...props.data,
          toggleBottomLayout: !props.data.toggleBottomLayout,
        },
      };
    },
  },
];

registerExamples([
  {
    name: 'rule-enable',
    label: 'Rule Inheritance',
    data,
    schema,
    uischema,
    actions,
  },
]);
