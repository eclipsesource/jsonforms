/*
  The MIT License
  
  Copyright (c) 2017-2020 EclipseSource Munich
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
    plainEnum: {
      type: 'string',
      enum: ['foo', 'bar'],
    },
    plainEnumSet: {
      type: 'string',
      enum: ['foo', 'bar'],
    },
    enumWithError: {
      type: 'string',
      enum: ['foo', 'bar'],
    },
    oneOfEnum: {
      type: 'string',
      oneOf: [
        { const: 'foo', title: 'Foo' },
        { const: 'bar', title: 'Bar' },
        { const: 'foobar', title: 'FooBar' },
      ],
    },
    oneOfEnumSet: {
      type: 'string',
      oneOf: [
        { const: 'foo', title: 'Foo' },
        { const: 'bar', title: 'Bar' },
        { const: 'foobar', title: 'FooBar' },
      ],
    },
    oneOfEnumWithError: {
      type: 'string',
      oneOf: [
        { const: 'foo', title: 'Foo' },
        { const: 'bar', title: 'Bar' },
        { const: 'foobar', title: 'FooBar' },
      ],
    },
    constEnum: {
      const: 'Const Value',
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Enums',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/constEnum',
        },
        {
          type: 'Control',
          scope: '#/properties/plainEnum',
        },
        {
          type: 'Control',
          scope: '#/properties/plainEnumSet',
        },
        {
          type: 'Control',
          scope: '#/properties/plainEnum',
          options: {
            autocomplete: false,
          },
        },
        {
          type: 'Control',
          scope: '#/properties/plainEnumSet',
          options: {
            autocomplete: false,
          },
        },
        {
          type: 'Control',
          scope: '#/properties/enumWithError',
        },
      ],
    },
    {
      type: 'Group',
      label: 'One of Enums',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/oneOfEnum',
        },
        {
          type: 'Control',
          scope: '#/properties/oneOfEnumSet',
        },
        {
          type: 'Control',
          scope: '#/properties/oneOfEnum',
          options: {
            autocomplete: false,
          },
        },
        {
          type: 'Control',
          scope: '#/properties/oneOfEnumSet',
          options: {
            autocomplete: false,
          },
        },
        {
          type: 'Control',
          scope: '#/properties/oneOfEnumWithError',
        },
      ],
    },
  ],
};

export const data = {
  plainEnumSet: 'foo',
  enumWithError: 'bogus',
  oneOfEnumSet: 'bar',
  oneOfEnumWithError: 'bogus',
};

registerExamples([
  {
    name: 'enum',
    label: 'Enums',
    data,
    schema,
    uischema,
  },
]);
