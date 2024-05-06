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
import * as _ from 'lodash';
import * as Redux from 'redux';
import configureStore from 'redux-mock-store';
import {
  registerUISchema,
  RemoveUISchemaAction,
  unregisterUISchema,
} from '../../src/actions';
import { Generate } from '../../src/generators';
import {
  findMatchingUISchema,
  findUISchema,
  uischemaRegistryReducer,
} from '../../src/reducers';
import { UISchemaTester } from '../../src/testers';
import { JsonFormsState, getSchema } from '../../src/store';

test('init state empty', (t) => {
  const dummyAction: RemoveUISchemaAction = {
    type: 'jsonforms/REMOVE_UI_SCHEMA',
    tester: undefined,
  };
  t.deepEqual(uischemaRegistryReducer(undefined, dummyAction), []);
});

test('add ui schema', (t) => {
  const tester: UISchemaTester = () => 1;
  const control = {
    type: 'Control',
    scope: '#/definitions/foo',
  };
  const after = uischemaRegistryReducer(
    undefined,
    registerUISchema(tester, control)
  );
  t.is(after.length, 1);
});

test('remove ui schema', (t) => {
  const tester: UISchemaTester = () => 1;
  const control = {
    type: 'Control',
    scope: '#/definitions/foo',
  };
  const after = uischemaRegistryReducer(
    [
      {
        tester,
        uischema: control,
      },
    ],
    unregisterUISchema(tester)
  );
  t.is(after.length, 0);
});

test('findMatchingUISchema', (t) => {
  const testerA: UISchemaTester = (_schema, schemaPath) =>
    _.endsWith(schemaPath, 'foo') ? 1 : 0;
  const testerB: UISchemaTester = (_schema, schemaPath) =>
    _.endsWith(schemaPath, 'bar') ? 1 : 0;
  const controlA = {
    type: 'Control',
    scope: '#/definitions/foo',
  };
  const controlB = {
    type: 'Control',
    scope: '#/definitions/bar',
  };
  const before = [
    {
      tester: testerA,
      uischema: controlA,
    },
    {
      tester: testerB,
      uischema: controlB,
    },
  ];
  t.deepEqual(
    findMatchingUISchema(before)(undefined, '#/defintions/foo', undefined),
    controlA
  );
  t.deepEqual(
    findMatchingUISchema(before)(undefined, '#/defintions/bar', undefined),
    controlB
  );
});

test('findUISchema returns generated UI schema if no match has been found', (t) => {
  const middlewares: Redux.Middleware[] = [];
  const mockStore = configureStore<JsonFormsState>(middlewares);
  const store = mockStore({
    jsonforms: {
      core: {
        schema: {
          definitions: {
            baz: {
              type: 'number',
            },
          },
        },
        data: undefined,
        uischema: undefined,
      },
      uischemas: [],
    },
  });

  t.deepEqual(
    findUISchema(
      store.getState().jsonforms.uischemas,
      getSchema(store.getState()),
      '#/definitions/baz',
      undefined
    ),
    Generate.uiSchema(getSchema(store.getState()))
  );
});

test('findMatchingUISchema with highest priority', (t) => {
  const testerA: UISchemaTester = (_schema, schemaPath) =>
    _.endsWith(schemaPath, 'foo') ? 2 : 0;
  const testerB: UISchemaTester = (_schema, schemaPath) =>
    _.endsWith(schemaPath, 'foo') ? 1 : 0;
  const controlA = {
    type: 'Control',
    scope: '#/definitions/foo',
  };
  const controlB = {
    type: 'Control',
    scope: '#/definitions/foo',
  };
  const before = [
    {
      tester: testerA,
      uischema: controlA,
    },
    {
      tester: testerB,
      uischema: controlB,
    },
  ];
  t.deepEqual(
    findMatchingUISchema(before)(undefined, '#/definitions/foo', undefined),
    controlA
  );
});
