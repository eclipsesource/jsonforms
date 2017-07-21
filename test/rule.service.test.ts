import { test } from 'ava';
import { DataService } from '../src/core/data.service';
import { Runtime } from '../src/core/runtime';
import { RuleEffect, UISchemaElement, VerticalLayout } from '../src/models/uischema';
import { JsonFormsRuleService } from '../src/services/rule.service';

test.beforeEach(t => {
  t.context.data = {foo: 'John', bar: 'Doe',
    hide: 'hide', show: 'show', enable: 'enable', disable: 'disable'};
  t.context.dataService = new DataService(t.context.data);
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {type: 'string'},
      bar: {type: 'string'},
      hide: {type: 'string'},
      show: {type: 'string'},
      enable: {type: 'string'},
      disable: {type: 'string'}
    }
  };
  t.context.control1 = {type: 'Control', scope: {$ref: '#/properties/foo'}};
  t.context.control2 = {type: 'Control', scope: {$ref: '#/properties/bar'}};
  t.context.control3 = {type: 'Control', scope: {$ref: '#/properties/hide'},
    rule: {effect: RuleEffect.HIDE, condition: {type: 'Leaf', scope: {$ref: '#/properties/foo'},
    expectedValue: 'John'}}};
  t.context.control4 = {type: 'Control', scope: {$ref: '#/properties/show'},
    rule: {effect: RuleEffect.SHOW, condition: {type: 'Leaf', scope: {$ref: '#/properties/bar'},
    expectedValue: 'Doe'}}};
  t.context.control5 = {type: 'Control', scope: {$ref: '#/properties/enable'},
    rule: {effect: RuleEffect.ENABLE, condition: {type: 'Leaf', scope: {$ref: '#/properties/foo'},
    expectedValue: 'John'}}};
  t.context.control6 = {type: 'Control', scope: {$ref: '#/properties/disable'},
    rule: {effect: RuleEffect.DISABLE, condition: {type: 'Leaf', scope: {$ref: '#/properties/bar'},
    expectedValue: 'Doe'}}};
  t.context.control5.runtime = new Runtime();
  t.context.control6.runtime = new Runtime();
});

test('rule service should act as data change listener', t => {
  const uiSchema: UISchemaElement = {
    type: ''
  };
  const ruleService = new JsonFormsRuleService(
      t.context.dataService,
      t.context.schema,
      uiSchema
  );
  const dataServiceListeners = t.context.dataService.dataChangeListeners as any[];
  t.is(dataServiceListeners.length, 1);
  t.is(dataServiceListeners[0], ruleService);
});

test('disposing the rule service should de-register it as data change listener', t => {
  const uiSchema: UISchemaElement = {
    type: ''
  };
  const ruleService = new JsonFormsRuleService(
      t.context.dataService,
      t.context.schema,
      uiSchema
  );
  ruleService.dispose();
  const dataServiceListeners = t.context.dataService.dataChangeListeners as any[];
  t.is(dataServiceListeners.length, 0);
});

test('rule service needs notification about null', t => {
  const uiSchema: UISchemaElement = {
    type: ''
  };
  const ruleService = new JsonFormsRuleService(
      t.context.dataService,
      t.context.schema,
      uiSchema
  );
  t.true(ruleService.needsNotificationAbout(null));
});

test('rule service needs notification about registered control', t => {
  const uiSchema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [
      t.context.control1,
      t.context.control2,
      t.context.control3,
      t.context.control4,
      t.context.control5,
      t.context.control6
    ]
  };
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
  t.true(ruleService.needsNotificationAbout(t.context.control1));
});

test('rule service does not need notification about un-registered controls', t => {
  const uiSchema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [t.context.control1]
  };
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
  t.false(ruleService.needsNotificationAbout(t.context.control2));
});

test('data change with null should update all rules', t => {
  const uiSchema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [
      t.context.control1,
      t.context.control2,
      t.context.control3,
      t.context.control4,
      t.context.control5,
      t.context.control6
    ]
  };
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
  ruleService.dataChanged(null, null, t.context.data);
  t.false((t.context.control3.runtime as Runtime).visible);
  t.true((t.context.control4.runtime as Runtime).visible);
  t.true((t.context.control5.runtime as Runtime).enabled);
  t.false((t.context.control6.runtime as Runtime).enabled);
});

test('data change should update relevant rules', t => {
  const uiSchema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [
      t.context.control1,
      t.context.control2,
      t.context.control3,
      t.context.control4,
      t.context.control5,
      t.context.control6
    ]
  };
  const ruleService = new JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
  t.context.data.foo = 'Jane';
  ruleService.dataChanged(t.context.control1, null, t.context.data);
  t.true((t.context.control3.runtime as Runtime).visible);
  t.false((t.context.control5.runtime as Runtime).enabled);
});
