/*
  The MIT License
  
  Copyright (c) 2022 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the 'Software'), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { registerExamples } from '../register';
import { UISchemaElement } from '@jsonforms/core';

export const schema = {
  type: 'object',
  definitions: {
    import: {
      title: 'Import',
      type: 'object',
      properties: {
        eClass: {
          const: 'http://my_schema/1.0.0#//Import',
        },
        document: {
          type: 'string',
        },
        package: {
          type: 'string',
        },
        prefix: {
          type: 'string',
        },
      },
    },
  },
  properties: {
    import: {
      type: 'array',
      items: {
        $ref: '#/definitions/import',
      },
    },
  },
};

export const uischema: UISchemaElement = undefined;

export const data = {
  import: [
    {
      document: 'Document1',
      package: 'Package1',
      prefix: 'Prefix',
    },
  ],
};

registerExamples([
  {
    name: '1948_with',
    label: 'Issue 1948 - Array renderer selection (with schema)',
    data,
    schema,
    uischema,
  },
  {
    name: '1948_without',
    label: 'Issue 1948 - Array renderer selection (w/o schema)',
    data,
    schema: undefined,
    uischema,
  },
]);
