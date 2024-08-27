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
    oneOfMultiEnum: {
      type: 'array',
      uniqueItems: true,
      description: 'Description',
      items: {
        oneOf: [
          { const: 'foo', title: 'My Foo' },
          { const: 'bar', title: 'My Bar' },
          { const: 'foobar', title: 'My FooBar' },
        ],
      },
    },
    multiEnum: {
      type: 'array',
      uniqueItems: true,
      description: 'Description',
      items: {
        type: 'string',
        enum: ['foo', 'bar', 'foobar'],
      },
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/oneOfMultiEnum',
      label: 'Form Label',
      options: {
        showUnfocusedDescription: true,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/multiEnum',
      label: 'Form Label',
      options: {
        showUnfocusedDescription: true,
      },
    },
  ],
};

export const data = { oneOfMultiEnum: ['foo'], multiEnum: ['bar'] };

registerExamples([
  {
    name: 'multi-enum-with-label-and-desc',
    label: 'Enum - Multi selection with label and desc',
    data,
    schema,
    uischema,
  },
]);
