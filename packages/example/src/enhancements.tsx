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

import { JsonFormsInitStateProps } from '@jsonforms/react';
import { JsonFormsUISchemaRegistryEntry } from '@jsonforms/core';
import { array as ArrayExample } from '@jsonforms/examples';
import { nestedArray } from '@jsonforms/examples';
import { issue_1220 } from '@jsonforms/examples';

export const enhancements = () => {
  return {
    'array': [
      {
        'label': 'Enable Sorting',
        'apply': (props: JsonFormsInitStateProps) => {
          return {
            ...props,
            uischema: ArrayExample.uischemaWithSorting
          }
        }
      },
      {
        'label': 'Disable Sorting',
        'apply': (props: JsonFormsInitStateProps) => {
          return {
            ...props,
            uischema: ArrayExample.uischema
          }
        }
      },
    ],
    'nestedArray': [
      {
        'label': 'Register NestedArray UISchema',
        'apply': (props: JsonFormsInitStateProps) => {
          return {
            ...props,
            uischemas: nestedArray.uischemas
          }
        }
      },
      {
        'label': 'Unregister NestedArray UISchema',
        'apply': (props: JsonFormsInitStateProps) => {
          const uischemas: JsonFormsUISchemaRegistryEntry[] = undefined;
          return {
            ...props,
            uischemas: uischemas
          }
        }
      },
    ],
    '1220': [
      {
        'label': 'Register Issue 1220 UISchema',
        'apply': (props: JsonFormsInitStateProps) => {
          return {
            ...props,
            uischemas: issue_1220.uischemas
          }
        }
      },
      {
        'label': 'Unregister Issue 1220 UISchema',
        'apply': (props: JsonFormsInitStateProps) => {
          const uischemas: JsonFormsUISchemaRegistryEntry[] = undefined;
          return {
            ...props,
            uischemas: uischemas
          }
        }
      },
    ],
    'dynamic': [
      {
        'label': 'Change data',
        'apply': (props: JsonFormsInitStateProps) => {
          return {
            ...props,
            data: { id: 'aaa' }
          }
        }
      },
    ],
    'rule-enable': [
      {
        'label': 'Enable/Disable top layout',
        'apply': (props: JsonFormsInitStateProps) => {
          return {
            ...props,
            data: { ...props.data, toggleTopLayout: !props.data.toggleTopLayout }
          }
        }
      },
      {
        'label': 'Show/Hide bottom layout',
        'apply': (props: JsonFormsInitStateProps) => {
          return {
            ...props,
            data: { ...props.data, toggleBottomLayout: !props.data.toggleBottomLayout }
          }
        }
      },
    ],
  }
};
