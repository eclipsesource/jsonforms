"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const data_service_1 = require("../src/core/data.service");
const runtime_1 = require("../src/core/runtime");
const uischema_1 = require("../src/models/uischema");
const rule_service_1 = require("../src/services/rule.service");
ava_1.test.beforeEach(t => {
    t.context.data = { foo: 'John', bar: 'Doe',
        hide: 'hide', show: 'show', enable: 'enable', disable: 'disable' };
    t.context.dataService = new data_service_1.DataService(t.context.data);
    t.context.schema = {
        type: 'object',
        properties: {
            foo: { type: 'string' },
            bar: { type: 'string' },
            hide: { type: 'string' },
            show: { type: 'string' },
            enable: { type: 'string' },
            disable: { type: 'string' }
        }
    };
    t.context.control1 = { type: 'Control', scope: { $ref: '#/properties/foo' } };
    t.context.control2 = { type: 'Control', scope: { $ref: '#/properties/bar' } };
    t.context.control3 = { type: 'Control', scope: { $ref: '#/properties/hide' },
        rule: { effect: uischema_1.RuleEffect.HIDE, condition: { type: 'Leaf', scope: { $ref: '#/properties/foo' },
                expectedValue: 'John' } } };
    t.context.control4 = { type: 'Control', scope: { $ref: '#/properties/show' },
        rule: { effect: uischema_1.RuleEffect.SHOW, condition: { type: 'Leaf', scope: { $ref: '#/properties/bar' },
                expectedValue: 'Doe' } } };
    t.context.control5 = { type: 'Control', scope: { $ref: '#/properties/enable' },
        rule: { effect: uischema_1.RuleEffect.ENABLE, condition: { type: 'Leaf', scope: { $ref: '#/properties/foo' },
                expectedValue: 'John' } } };
    t.context.control6 = { type: 'Control', scope: { $ref: '#/properties/disable' },
        rule: { effect: uischema_1.RuleEffect.DISABLE, condition: { type: 'Leaf', scope: { $ref: '#/properties/bar' },
                expectedValue: 'Doe' } } };
    t.context.control5.runtime = new runtime_1.Runtime();
    t.context.control6.runtime = new runtime_1.Runtime();
});
ava_1.test('rule service should act as data change listener', t => {
    const uiSchema = {
        type: ''
    };
    const ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
    const dataServiceListeners = t.context.dataService.dataChangeListeners;
    t.is(dataServiceListeners.length, 1);
    t.is(dataServiceListeners[0], ruleService);
});
ava_1.test('disposing the rule service should de-register it as data change listener', t => {
    const uiSchema = {
        type: ''
    };
    const ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
    ruleService.dispose();
    const dataServiceListeners = t.context.dataService.dataChangeListeners;
    t.is(dataServiceListeners.length, 0);
});
ava_1.test('rule service needs notification about null', t => {
    const uiSchema = {
        type: ''
    };
    const ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
    t.true(ruleService.needsNotificationAbout(null));
});
ava_1.test('rule service needs notification about registered control', t => {
    const uiSchema = {
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
    const ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
    t.true(ruleService.needsNotificationAbout(t.context.control1));
});
ava_1.test('rule service does not need notification about un-registered controls', t => {
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [t.context.control1]
    };
    const ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
    t.false(ruleService.needsNotificationAbout(t.context.control2));
});
ava_1.test('data change with null should update all rules', t => {
    const uiSchema = {
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
    const ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
    ruleService.dataChanged(null, null, t.context.data);
    t.false(t.context.control3.runtime.visible);
    t.true(t.context.control4.runtime.visible);
    t.true(t.context.control5.runtime.enabled);
    t.false(t.context.control6.runtime.enabled);
});
ava_1.test('data change should update relevant rules', t => {
    const uiSchema = {
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
    const ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, uiSchema);
    t.context.data.foo = 'Jane';
    ruleService.dataChanged(t.context.control1, null, t.context.data);
    t.true(t.context.control3.runtime.visible);
    t.false(t.context.control5.runtime.enabled);
});
//# sourceMappingURL=rule.service.test.js.map