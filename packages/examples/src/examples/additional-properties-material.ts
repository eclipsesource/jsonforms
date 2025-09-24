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
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    auth_style: {
      type: 'string',
      enum: ['header', 'param', 'body'],
      title: 'Authentication Style',
    },
    client_key: {
      type: 'string',
      title: 'Client Key',
    },
    client_secret: {
      type: 'string',
      title: 'Client Secret',
    },
    endpoint_params: {
      type: 'object',
      title: 'Endpoint Parameters',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'string',
        },
        title: 'Parameter Values',
      },
    },
  },
  required: ['auth_style', 'client_key', 'client_secret'],
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/auth_style',
    },
    {
      type: 'Control',
      scope: '#/properties/client_key',
    },
    {
      type: 'Control',
      scope: '#/properties/client_secret',
    },
    {
      type: 'Control',
      scope: '#/properties/endpoint_params',
    },
  ],
};

const data = {
  auth_style: 'header',
  client_key: 'my-client-key',
  client_secret: 'my-client-secret',
  endpoint_params: {
    custom_param1: ['value1', 'value2'],
    custom_param2: ['value3'],
  },
};

registerExamples([
  {
    name: 'additional-properties-material',
    label: 'Additional Properties (Material)',
    data,
    schema,
    uischema,
  },
]);