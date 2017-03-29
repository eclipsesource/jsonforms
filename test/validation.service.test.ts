import {test} from 'ava';
import {JsonFormsValidator} from '../src/services/validation.service';
import {DataService} from '../src/core/data.service';
import {ControlElement, UISchemaElement, Layout, RuleEffect} from '../src/models/uischema';
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
test('JsonFormsValidator registers as datalisteners ', t => {
  const validationService = new JsonFormsValidator(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  const dataServiceListeners = <Array<any>>t.context.dataService['changeListeners'];
  t.is(dataServiceListeners.length, 1);
  t.is(dataServiceListeners[0], validationService);
});
test('JsonFormsValidator dispose unregisters as datalisteners ', t => {
  const validationService = new JsonFormsValidator(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  validationService.dispose();
  const dataServiceListeners = <Array<any>>t.context.dataService['changeListeners'];
  t.is(dataServiceListeners.length, 0);
});
test('JsonFormsValidator isRelevantKey null ', t => {
  const validationService = new JsonFormsValidator(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  t.true(validationService.isRelevantKey(null));
});
test('JsonFormsValidator isRelevantKey existing', t => {
  const uischema = {type: 'VerticalLayout',
    elements: [t.context.control1, t.context.control2]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
  t.true(validationService.isRelevantKey(t.context.control1));
});
test('JsonFormsValidator isRelevantKey not existing', t => {
  const uischema = {type: 'VerticalLayout', elements: [t.context.control1]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
  t.true(validationService.isRelevantKey(t.context.control2));
});
test('JsonFormsValidator notifyChange null', t => {
  const uischema = {type: 'VerticalLayout',
    elements: [t.context.control1, t.context.control2]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
  validationService.notifyChange(null, null, t.context.data);
  t.is((<Runtime>t.context.control1['runtime']).validationErrors, undefined);
  t.deepEqual((<Runtime>t.context.control2['runtime']).validationErrors, ['should be >= 5']);
});
test('JsonFormsValidator notifyChange revalidate', t => {
  const uischema = {type: 'VerticalLayout',
    elements: [t.context.control1, t.context.control2]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
  validationService.notifyChange(null, null, t.context.data);
  t.context.data.foo = 12;
  t.context.data.bar = 6;
  validationService.notifyChange(null, null, t.context.data);
  t.deepEqual((<Runtime>t.context.control1['runtime']).validationErrors, ['should be <= 10']);
  t.is((<Runtime>t.context.control2['runtime']).validationErrors, undefined);
});
test('JsonFormsValidator notifyChange error on invisible', t => {
  const uischema = {type: 'VerticalLayout',
    elements: [t.context.control1]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
  validationService.notifyChange(null, null, t.context.data);
  t.is((<Runtime>t.context.control1['runtime']).validationErrors, undefined);
});
test('JsonFormsValidator notifyChange all valid', t => {
  const uischema = {type: 'VerticalLayout',
    elements: [t.context.control1, t.context.control2]} as Layout;
  const validationService =
    new JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
  t.context.data.bar = 6;
  validationService.notifyChange(null, null, t.context.data);
  t.is((<Runtime>t.context.control1['runtime']).validationErrors, undefined);
  // as there are no validation errors, the runtime object is not even created
  t.is(t.context.control2['runtime'], undefined);
});
