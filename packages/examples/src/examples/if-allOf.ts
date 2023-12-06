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
    foo: { type: 'string' },
    bar: { type: 'string' },
    baz: { type: 'string' },
    nested: {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        bar: { type: 'string' },
      },
      allOf: [
        {
          if: {
            properties: {
              foo: { const: 'bar' },
            },
          },
          then: { required: ['bar'] },
        },
      ],
    },
  },
  allOf: [
    {
      if: {
        properties: {
          foo: { const: 'bar' },
        },
      },
      then: { required: ['bar'] },
    },
    {
      if: {
        properties: {
          foo: { const: 'baz' },
        },
      },
      then: { required: ['baz'] },
    },
    {
      if: {
        properties: {
          foo: { pattern: 'foo.' },
        },
      },
      then: {
        required: ['baz', 'bar'],
      },
    },
  ],
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      label: 'Foo',
      type: 'Control',
      scope: '#/properties/foo',
    },
    {
      type: 'Control',
      label: 'bar',
      scope: '#/properties/bar',
    },
    {
      type: 'Control',
      label: 'baz',
      scope: '#/properties/baz',
    },
    {
      type: 'Control',
      label: 'foo1',
      scope: '#/properties/nested/properties/foo',
    },
    {
      type: 'Control',
      label: 'bar1',
      scope: '#/properties/nested/properties/bar',
    },
  ],
};

const data = {};

registerExamples([
  {
    name: 'if-allOf',
    label: 'If AllOf',
    data,
    schema,
    uischema,
  },
]);
