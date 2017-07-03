import {test} from 'ava';
import {DataService} from '../src/core/data.service';
import {Runtime} from '../src/core/runtime';
import {Layout} from '../src/models/uischema';
import {JsonFormsValidator} from '../src/services/validation.service';

test.beforeEach(t => {
  t.context.data = {foo: 2, bar: 3};
  t.context.dataService = new DataService(t.context.data);
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {type: 'number', maximum: 10},
      bar: {type: 'number', minimum: 5},
    },
  };
  t.context.control1 = {type: 'Control', scope: {$ref: '#/properties/foo'}};
  t.context.control2 = {type: 'Control', scope: {$ref: '#/properties/bar'}};
  t.context.uiSchema = {
    type: 'VerticalLayout',
    elements: [
      t.context.control1,
      t.context.control2
    ]
  };
  t.context.control1.runtime = new Runtime();
});

test('validation service should act as a data change listener', t => {
  const validationService = new JsonFormsValidator(
      t.context.dataService,
      t.context.schema,
      t.context.uiSchema
  );
  const dataServiceListeners = t.context.dataService.dataChangeListeners as any[];
  t.is(dataServiceListeners.length, 1);
  t.is(dataServiceListeners[0], validationService);
});

test('disposing the validation service should de-register it as data change listener', t => {
  const validationService = new JsonFormsValidator(
      t.context.dataService,
      t.context.schema,
      t.context.uiSchema
  );
  validationService.dispose();
  const dataServiceListeners = t.context.dataService.dataChangeListeners as any[];
  t.is(dataServiceListeners.length, 0);
});

test('validation service needs notification about null', t => {
  const validationService = new JsonFormsValidator(
      t.context.dataService,
      t.context.schema,
      t.context.uiSchema
  );
  t.true(validationService.needsNotificationAbout(null));
});

test('validation service needs notification about registered control', t => {
  const validationService = new JsonFormsValidator(
      t.context.dataService,
      t.context.schema,
      t.context.uiSchema
  );
  t.true(validationService.needsNotificationAbout(t.context.control1));
});

test('validation service does not need notification about un-registered control', t => {
  const uiSchema: Layout = {
    type: 'VerticalLayout',
    elements: [t.context.control1]
  };
  const validationService = new JsonFormsValidator(
      t.context.dataService,
      t.context.schema,
      uiSchema
  );
  t.true(validationService.needsNotificationAbout(t.context.control2));
});

test('data change with null should update validation errors', t => {
  const validationService = new JsonFormsValidator(
      t.context.dataService,
      t.context.schema,
      t.context.uiSchema
  );
  validationService.dataChanged(null, null, t.context.data);
  t.is((t.context.control1.runtime as Runtime).validationErrors, undefined);
  t.deepEqual((t.context.control2.runtime as Runtime).validationErrors, ['should be >= 5']);
});

test('data chane should trigger re-validation', t => {
  const uiSchema: Layout = {
    type: 'VerticalLayout',
    elements: [
      t.context.control1,
      t.context.control2]
  };
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
  validationService.dataChanged(null, null, t.context.data);
  t.context.data.foo = 12;
  t.context.data.bar = 6;
  validationService.dataChanged(null, null, t.context.data);
  t.deepEqual((t.context.control1.runtime as Runtime).validationErrors, ['should be <= 10']);
  t.is((t.context.control2.runtime as Runtime).validationErrors, undefined);
});

test('data change should not cause validation errors if registered control is not visible', t => {
  const uiSchema: Layout = {
    type: 'VerticalLayout',
    elements: [t.context.control1]
  };
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
  validationService.dataChanged(null, null, t.context.data);
  t.is((t.context.control1.runtime as Runtime).validationErrors, undefined);
});

test('data change should not trigger creation of runtime object if instance is valid', t => {
  const uiSchema: Layout = {
    type: 'VerticalLayout',
    elements: [
      t.context.control1,
      t.context.control2
    ]
  };
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
  t.context.data.bar = 6;
  validationService.dataChanged(null, null, t.context.data);
  t.is((t.context.control1.runtime as Runtime).validationErrors, undefined);
  // as there are no validation errors, the runtime object is not even created
  t.is(t.context.control2.runtime, undefined);
});
