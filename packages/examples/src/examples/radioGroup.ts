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

export const data = {};

export const schema = {
  type: 'object',
  properties: {
    exampleRadioEnum: {
      type: 'string',
      enum: ['One', 'Two', 'Three'],
    },
    exampleRadioOneOfEnum: {
      type: 'string',
      oneOf: [
        { const: 'foo', title: 'Foo' },
        { const: 'bar', title: 'Bar' },
        { const: 'foobar', title: 'FooBar' },
      ],
    },
  },
};
export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Simple enum',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/exampleRadioEnum',
          options: {
            format: 'radio',
            orientation: 'vertical',
          },
        },
      ],
    },
    {
      type: 'Group',
      label: 'One of Enum',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/exampleRadioOneOfEnum',
          options: {
            format: 'radio',
          },
        },
      ],
    },
  ],
};

registerExamples([
  {
    name: 'radio-group',
    label: 'Radio Group',
    data,
    schema,
    uischema,
  },
]);
