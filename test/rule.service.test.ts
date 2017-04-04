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
test('JsonFormsRuleService registers as datalisteners ', t => {
  const ruleService = new JsonFormsRuleService(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  const dataServiceListeners = <Array<any>>t.context.dataService['changeListeners'];
  t.is(dataServiceListeners.length, 1);
  t.is(dataServiceListeners[0], ruleService);
});
test('JsonFormsRuleService dispose unregisters as datalisteners ', t => {
  const ruleService = new JsonFormsRuleService(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  ruleService.dispose();
  const dataServiceListeners = <Array<any>>t.context.dataService['changeListeners'];
  t.is(dataServiceListeners.length, 0);
});
test('JsonFormsRuleService isRelevantKey null ', t => {
  const ruleService = new JsonFormsRuleService(t.context.dataService,
    t.context.schema, {} as UISchemaElement);
  t.true(ruleService.isRelevantKey(null));
});
test('JsonFormsRuleService isRelevantKey existing', t => {
  const uischema = {type: 'VerticalLayout', elements: [t.context.control1, t.context.control2,
    t.context.control3, t.context.control4, t.context.control5, t.context.control6]} as Layout;
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uischema);
  t.true(ruleService.isRelevantKey(t.context.control1));
});
test('JsonFormsRuleService isRelevantKey not existing', t => {
  const uischema = {type: 'VerticalLayout', elements: [t.context.control1]} as Layout;
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uischema);
  t.false(ruleService.isRelevantKey(t.context.control2));
});
test('JsonFormsRuleService notifyChange null updates all rules', t => {
  const uischema = {type: 'VerticalLayout', elements: [t.context.control1, t.context.control2,
    t.context.control3, t.context.control4, t.context.control5, t.context.control6]} as Layout;
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uischema);
  ruleService.notifyChange(null, null, t.context.data);
  t.false((<Runtime>t.context.control3['runtime']).visible);
  t.true((<Runtime>t.context.control4['runtime']).visible);
  t.true((<Runtime>t.context.control5['runtime']).enabled);
  t.false((<Runtime>t.context.control6['runtime']).enabled);
});
test('JsonFormsRuleService notifyChange updates relevant rules', t => {
  const uischema = {type: 'VerticalLayout', elements: [t.context.control1, t.context.control2,
    t.context.control3, t.context.control4, t.context.control5, t.context.control6]} as Layout;
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uischema);
  t.context.data.foo = 'Jane';
  ruleService.notifyChange(t.context.control1, null, t.context.data);
  t.true((<Runtime>t.context.control3['runtime']).visible);
  t.false((<Runtime>t.context.control5['runtime']).enabled);
});
