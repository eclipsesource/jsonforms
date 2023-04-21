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
    readonly: {
      type: 'string',
      readOnly: true,
    },
    readonlyByUISchema: {
      type: 'string',
    },
    notReadonly: {
      type: 'string',
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/readonly',
      label: 'A readonly field',
    },
    {
      type: 'Control',
      scope: '#/properties/readonlyByUISchema',
      label: 'A readonly field by ui schema',
      options: {
        readonly: true,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/notReadonly',
      label: 'A normal field',
    },
  ],
};

export const data = {
  readonly: 'readonly by schema',
  readonlyByUISchema: 'readonly by ui schema',
  notReadonly: 'normal field',
};

registerExamples([
  {
    name: 'Readonly Fields',
    label: 'Readonly examples',
    data,
    schema,
    uischema,
  },
]);
