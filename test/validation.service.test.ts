import {test} from 'ava';
import {JsonFormsValidator} from '../src/services/validation.service';
import {DataService} from '../src/core/data.service';
import {ControlElement, UISchemaElement, Layout} from '../src/models/uischema';
import {Runtime} from '../src/core/runtime';
import {JsonSchema} from '../src/models/jsonSchema';

test.beforeEach(t => {
  t.context.data = {foo: 2, bar: 3};
  t.context.dataService = new DataService(t.context.data);
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {type: 'number', maximum: 10},
      bar: {type: 'number', minimum: 5}
    }
  } as JsonSchema;
  t.context.control1 = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  t.context.control2 = {type: 'Control', scope: {$ref: '#/properties/bar'}} as ControlElement;
  t.context.control1['runtime'] = new Runtime();
});
test('validation service should act as a data change listener', t => {
  const validationService = new JsonFormsValidator(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  const dataServiceListeners = <Array<any>>t.context.dataService['dataChangeListeners'];
  t.is(dataServiceListeners.length, 1);
  t.is(dataServiceListeners[0], validationService);
});
test('disposing the validation service should de-register it as data change listener', t => {
  const validationService = new JsonFormsValidator(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  validationService.dispose();
  const dataServiceListeners = <Array<any>>t.context.dataService['dataChangeListeners'];
  t.is(dataServiceListeners.length, 0);
});
test('validation service needs notification about null', t => {
  const validationService = new JsonFormsValidator(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  t.true(validationService.needsNotificationAbout(null));
});
test('validation service needs notification about registered control', t => {
  const uiSchema = {type: 'VerticalLayout',
    elements: [t.context.control1, t.context.control2]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
  t.true(validationService.needsNotificationAbout(t.context.control1));
});
test('validation service does not need notification about un-registered control', t => {
  const uiSchema = {type: 'VerticalLayout', elements: [t.context.control1]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
  t.true(validationService.needsNotificationAbout(t.context.control2));
});
test('data change with null should update validation errors', t => {
  const uiSchema = {type: 'VerticalLayout',
    elements: [t.context.control1, t.context.control2]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
  validationService.dataChanged(null, null, t.context.data);
  t.is((<Runtime>t.context.control1['runtime']).validationErrors, undefined);
  t.deepEqual((<Runtime>t.context.control2['runtime']).validationErrors, ['should be >= 5']);
});
test('data chane should trigger re-validation', t => {
  const uiSchema = {type: 'VerticalLayout',
    elements: [t.context.control1, t.context.control2]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
  validationService.dataChanged(null, null, t.context.data);
  t.context.data.foo = 12;
  t.context.data.bar = 6;
  validationService.dataChanged(null, null, t.context.data);
  t.deepEqual((<Runtime>t.context.control1['runtime']).validationErrors, ['should be <= 10']);
  t.is((<Runtime>t.context.control2['runtime']).validationErrors, undefined);
});
test('data change should not cause validation errors if registered control is not visible', t => {
  const uiSchema = {type: 'VerticalLayout',
    elements: [t.context.control1]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
  validationService.dataChanged(null, null, t.context.data);
  t.is((<Runtime>t.context.control1['runtime']).validationErrors, undefined);
});
test('data change should not trigger creation of runtime object if instance is valid', t => {
  const uiSchema = {type: 'VerticalLayout',
    elements: [t.context.control1, t.context.control2]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
  t.context.data.bar = 6;
  validationService.dataChanged(null, null, t.context.data);
  t.is((<Runtime>t.context.control1['runtime']).validationErrors, undefined);
  // as there are no validation errors, the runtime object is not even created
  t.is(t.context.control2['runtime'], undefined);
});
