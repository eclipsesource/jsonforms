import {test} from 'ava';
import {JsonFormsRuleService} from '../src/services/rule.service';
import {DataService} from '../src/core/data.service';
import {ControlElement, UISchemaElement, Layout, RuleEffect} from '../src/models/uischema';
import {Runtime} from '../src/core/runtime';
import {JsonSchema} from '../src/models/jsonSchema';

test.beforeEach(t => {
  t.context.data = {foo: 'John', bar: 'Doe',
    hide: 'hide', show: 'show', enable: 'enable', disable: 'disable'};
  t.context.dataService = new DataService(t.context.data);
  t.context.schema = {type: 'object', properties: {
    foo: {type: 'string'},
    bar: {type: 'string'},
    hide: {type: 'string'},
    show: {type: 'string'},
    enable: {type: 'string'},
    disable: {type: 'string'}
  }} as JsonSchema;
  t.context.control1 = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  t.context.control2 = {type: 'Control', scope: {$ref: '#/properties/bar'}} as ControlElement;
  t.context.control3 = {type: 'Control', scope: {$ref: '#/properties/hide'},
    rule: {effect: RuleEffect.HIDE, condition: {type: 'Leaf', scope: {$ref: '#/properties/foo'},
    expectedValue: 'John'}}} as ControlElement;
  t.context.control4 = {type: 'Control', scope: {$ref: '#/properties/show'},
    rule: {effect: RuleEffect.SHOW, condition: {type: 'Leaf', scope: {$ref: '#/properties/bar'},
    expectedValue: 'Doe'}}} as ControlElement;
  t.context.control5 = {type: 'Control', scope: {$ref: '#/properties/enable'},
    rule: {effect: RuleEffect.ENABLE, condition: {type: 'Leaf', scope: {$ref: '#/properties/foo'},
    expectedValue: 'John'}}} as ControlElement;
  t.context.control6 = {type: 'Control', scope: {$ref: '#/properties/disable'},
    rule: {effect: RuleEffect.DISABLE, condition: {type: 'Leaf', scope: {$ref: '#/properties/bar'},
    expectedValue: 'Doe'}}} as ControlElement;
  t.context.control5['runtime'] = new Runtime();
  t.context.control6['runtime'] = new Runtime();
});
test('rule service should act as data change listener', t => {
  const ruleService = new JsonFormsRuleService(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  const dataServiceListeners = <Array<any>>t.context.dataService['dataChangeListeners'];
  t.is(dataServiceListeners.length, 1);
  t.is(dataServiceListeners[0], ruleService);
});
test('disposing the rule service should de-register it as data change listener', t => {
  const ruleService = new JsonFormsRuleService(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  ruleService.dispose();
  const dataServiceListeners = <Array<any>>t.context.dataService['dataChangeListeners'];
  t.is(dataServiceListeners.length, 0);
});
test('rule service needs notification about null', t => {
  const ruleService = new JsonFormsRuleService(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  t.true(ruleService.needsNotificationAbout(null));
});
test('rule service needs notification about registered control', t => {
  const uiSchema = {type: 'VerticalLayout', elements: [t.context.control1, t.context.control2,
    t.context.control3, t.context.control4, t.context.control5, t.context.control6]} as Layout;
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
  t.true(ruleService.needsNotificationAbout(t.context.control1));
});
test('rule service does not need notification about un-registered controls', t => {
  const uiSchema = {type: 'VerticalLayout', elements: [t.context.control1]} as Layout;
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
  t.false(ruleService.needsNotificationAbout(t.context.control2));
});
test('data change with null should update all rules', t => {
  const uiSchema = {type: 'VerticalLayout', elements: [t.context.control1, t.context.control2,
    t.context.control3, t.context.control4, t.context.control5, t.context.control6]} as Layout;
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
  ruleService.dataChanged(null, null, t.context.data);
  t.false((<Runtime>t.context.control3['runtime']).visible);
  t.true((<Runtime>t.context.control4['runtime']).visible);
  t.true((<Runtime>t.context.control5['runtime']).enabled);
  t.false((<Runtime>t.context.control6['runtime']).enabled);
});
test('data change should update relevant rules', t => {
  const uiSchema = {type: 'VerticalLayout', elements: [t.context.control1, t.context.control2,
    t.context.control3, t.context.control4, t.context.control5, t.context.control6]} as Layout;
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
  t.context.data.foo = 'Jane';
  ruleService.dataChanged(t.context.control1, null, t.context.data);
  t.true((<Runtime>t.context.control3['runtime']).visible);
  t.false((<Runtime>t.context.control5['runtime']).enabled);
});
