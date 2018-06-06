import test from 'ava';
import * as _ from 'lodash';
import configureStore from 'redux-mock-store';
import {
  findMatchingUISchema,
  uischemaRegistryReducer,
  UISchemaTester
} from '../../src/reducers/uischemas';
import { registerUISchema, unregisterUISchema } from '../../src/actions';
import { findUISchema } from '../../src/reducers';

test('init state empty', t => {
  t.deepEqual(uischemaRegistryReducer(undefined, { type: 'whatever' }), []);
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
    unregisterUISchema(tester, control)
  );
  t.is(after.length, 0);
});

test('findMatchingUISchema', t => {
  const testerA: UISchemaTester = (_schema, schemaPath) => _.endsWith(schemaPath, 'foo') ? 1 : 0;
  const testerB: UISchemaTester = (_schema, schemaPath) => _.endsWith(schemaPath, 'bar') ? 1 : 0;
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

test('findUISchema returns default if no matching UI schema has been found', t => {

  const testerA: UISchemaTester = (_schema, schemaPath) => _.endsWith(schemaPath, 'foo') ? 1 : 0;
  const testerB: UISchemaTester = (_schema, schemaPath) => _.endsWith(schemaPath, 'bar') ? 1 : 0;
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
  const uischema = {
    type: 'Control',
    scope: '#/properties/any'
  };

  const middlewares = [];
  const mockStore = configureStore(middlewares);
  const store = mockStore({
    jsonforms: {
      core: {
        uischema
      },
      uischemas: before
    }
  });

  t.deepEqual(
    findUISchema(store.getState())(undefined, '#/defintions/baz', undefined),
    uischema
  );
});

test('findMatchingUISchema with highest priority', t => {
  const testerA: UISchemaTester = (_schema, schemaPath) => _.endsWith(schemaPath, 'foo') ? 2 : 0;
  const testerB: UISchemaTester = (_schema, schemaPath) => _.endsWith(schemaPath, 'foo') ? 1 : 0;
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
