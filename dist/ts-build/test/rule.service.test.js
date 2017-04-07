"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var rule_service_1 = require("../src/services/rule.service");
var data_service_1 = require("../src/core/data.service");
var uischema_1 = require("../src/models/uischema");
var runtime_1 = require("../src/core/runtime");
ava_1.test.beforeEach(function (t) {
    t.context.data = { foo: 'John', bar: 'Doe',
        hide: 'hide', show: 'show', enable: 'enable', disable: 'disable' };
    t.context.dataService = new data_service_1.DataService(t.context.data);
    t.context.schema = { type: 'object', properties: {
            foo: { type: 'string' },
            bar: { type: 'string' },
            hide: { type: 'string' },
            show: { type: 'string' },
            enable: { type: 'string' },
            disable: { type: 'string' }
        } };
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
    t.context.control5['runtime'] = new runtime_1.Runtime();
    t.context.control6['runtime'] = new runtime_1.Runtime();
});
ava_1.test('JsonFormsRuleService registers as datalisteners ', function (t) {
    var ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, {});
    var dataServiceListeners = t.context.dataService['changeListeners'];
    t.is(dataServiceListeners.length, 1);
    t.is(dataServiceListeners[0], ruleService);
});
ava_1.test('JsonFormsRuleService dispose unregisters as datalisteners ', function (t) {
    var ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, {});
    ruleService.dispose();
    var dataServiceListeners = t.context.dataService['changeListeners'];
    t.is(dataServiceListeners.length, 0);
});
ava_1.test('JsonFormsRuleService isRelevantKey null ', function (t) {
    var ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, {});
    t.true(ruleService.isRelevantKey(null));
});
ava_1.test('JsonFormsRuleService isRelevantKey existing', function (t) {
    var uischema = { type: 'VerticalLayout', elements: [t.context.control1, t.context.control2,
            t.context.control3, t.context.control4, t.context.control5, t.context.control6] };
    var ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, uischema);
    t.true(ruleService.isRelevantKey(t.context.control1));
});
ava_1.test('JsonFormsRuleService isRelevantKey not existing', function (t) {
    var uischema = { type: 'VerticalLayout', elements: [t.context.control1] };
    var ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, uischema);
    t.false(ruleService.isRelevantKey(t.context.control2));
});
ava_1.test('JsonFormsRuleService notifyChange null updates all rules', function (t) {
    var uischema = { type: 'VerticalLayout', elements: [t.context.control1, t.context.control2,
            t.context.control3, t.context.control4, t.context.control5, t.context.control6] };
    var ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, uischema);
    ruleService.notifyChange(null, null, t.context.data);
    t.false(t.context.control3['runtime'].visible);
    t.true(t.context.control4['runtime'].visible);
    t.true(t.context.control5['runtime'].enabled);
    t.false(t.context.control6['runtime'].enabled);
});
ava_1.test('JsonFormsRuleService notifyChange updates relevant rules', function (t) {
    var uischema = { type: 'VerticalLayout', elements: [t.context.control1, t.context.control2,
            t.context.control3, t.context.control4, t.context.control5, t.context.control6] };
    var ruleService = new rule_service_1.JsonFormsRuleService(t.context.dataService, t.context.schema, uischema);
    t.context.data.foo = 'Jane';
    ruleService.notifyChange(t.context.control1, null, t.context.data);
    t.true(t.context.control3['runtime'].visible);
    t.false(t.context.control5['runtime'].enabled);
});
//# sourceMappingURL=rule.service.test.js.map