/*
  The MIT License
  
  Copyright (c) 2023-2023 EclipseSource Munich
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

import { ControlElement, JsonSchema } from '@jsonforms/core';
import { JsonFormsAngularService } from '../src/jsonforms.service';

import test from 'ava';

test('Should callMiddleware', (t) => {
  const data = { foo: true };
  const testSchema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'boolean',
      },
    },
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
  };

  const jsonFormsService = new JsonFormsAngularService();

  jsonFormsService.init({
    core: {
      data: data,
      schema: testSchema,
      uischema: uischema,
    },
    middleware: (_state, _action) => t.pass,
  });
  t.fail('schould have called middleware');
});
