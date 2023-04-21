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
import test from 'ava';
import {
  Actions,
  JsonSchema,
  UISchemaElement,
  ControlElement,
  VerticalLayout,
} from '../../src';

test('Init Action generates schema when not provided', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
    additionalProperties: true,
    required: ['name'],
  };

  const init = Actions.init({ name: 'foobar' });
  t.deepEqual(init.schema, schema);
});

test('Init Action generates ui schema when not provided', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
  };
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name',
      } as ControlElement,
    ],
  };

  const init = Actions.init({}, schema);
  t.deepEqual(init.uischema, uischema);
});

test('Init Action generates ui schema when not valid', (t) => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
  };

  const init = Actions.init({}, schema, false as any);
  t.deepEqual(init.uischema, {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name',
      },
    ],
  } as UISchemaElement);
});
