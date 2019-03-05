import test from 'ava';
import * as _ from 'lodash';
import * as Redux from 'redux';
import configureStore from 'redux-mock-store';
import {
  findMatchingUISchema,
  uischemaRegistryReducer,
  UISchemaTester
} from '../../src/reducers/uischemas';
import {
  registerUISchema,
  RemoveUISchemaAction,
  unregisterUISchema
} from '../../src/actions';
import { findUISchema, getSchema } from '../../src/reducers';
import { Generate } from '../../src/generators';
import { JsonFormsState } from '../../src';

test('init state empty', t => {
  const dummyAction: RemoveUISchemaAction = {
    type: 'jsonforms/REMOVE_UI_SCHEMA',
    tester: undefined
  };
  t.deepEqual(uischemaRegistryReducer(undefined, dummyAction), []);
});

test('add ui schema', t => {
  const tester: UISchemaTester = () => 1;
  const control = {
    type: 'Control',
    scope: '#/definitions/foo'
  };
  const after = uischemaRegistryReducer(
    undefined,
    registerUISchema(tester, control)
  );
  t.is(after.length, 1);
});

test('remove ui schema', t => {
  const tester: UISchemaTester = () => 1;
  const control = {
    type: 'Control',
    scope: '#/definitions/foo'
  };
  const after = uischemaRegistryReducer(
    [
      {
        tester,
        uischema: control
      }
    ],
    unregisterUISchema(tester)
  );
  t.is(after.length, 0);
});

test('findMatchingUISchema', t => {
  const testerA: UISchemaTester = (_schema, schemaPath) =>
    _.endsWith(schemaPath, 'foo') ? 1 : 0;
  const testerB: UISchemaTester = (_schema, schemaPath) =>
    _.endsWith(schemaPath, 'bar') ? 1 : 0;
  const controlA = {
    type: 'Control',
    scope: '#/definitions/foo'
  };
  const controlB = {
    type: 'Control',
    scope: '#/definitions/bar'
  };
  const before = [
    {
      tester: testerA,
      uischema: controlA
    },
    {
      tester: testerB,
      uischema: controlB
    }
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

test('findUISchema returns generated UI schema if no match has been found', t => {
  const middlewares: Redux.Middleware[] = [];
  const mockStore = configureStore<JsonFormsState>(middlewares);
  const store = mockStore({
    jsonforms: {
      core: {
        schema: {
          definitions: {
            baz: {
              type: 'number'
            }
          }
        },
        data: undefined,
        uischema: undefined
      },
      uischemas: []
    }
  });

  t.deepEqual(
    findUISchema(store.getState())(
      getSchema(store.getState()),
      '#/definitions/baz',
      undefined
    ),
    Generate.uiSchema(getSchema(store.getState()))
  );
});

test('findMatchingUISchema with highest priority', t => {
  const testerA: UISchemaTester = (_schema, schemaPath) =>
    _.endsWith(schemaPath, 'foo') ? 2 : 0;
  const testerB: UISchemaTester = (_schema, schemaPath) =>
    _.endsWith(schemaPath, 'foo') ? 1 : 0;
  const controlA = {
    type: 'Control',
    scope: '#/definitions/foo'
  };
  const controlB = {
    type: 'Control',
    scope: '#/definitions/foo'
  };
  const before = [
    {
      tester: testerA,
      uischema: controlA
    },
    {
      tester: testerB,
      uischema: controlB
    }
  ];
  t.deepEqual(
    findMatchingUISchema(before)(undefined, '#/definitions/foo', undefined),
    controlA
  );
});
