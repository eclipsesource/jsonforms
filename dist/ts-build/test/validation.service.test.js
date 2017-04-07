"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var validation_service_1 = require("../src/services/validation.service");
var data_service_1 = require("../src/core/data.service");
var runtime_1 = require("../src/core/runtime");
ava_1.test.beforeEach(function (t) {
    t.context.data = { foo: 2, bar: 3 };
    t.context.dataService = new data_service_1.DataService(t.context.data);
    t.context.schema = {
        type: 'object',
        properties: {
            foo: { type: 'number', maximum: 10 },
            bar: { type: 'number', minimum: 5 }
        }
    };
    t.context.control1 = { type: 'Control', scope: { $ref: '#/properties/foo' } };
    t.context.control2 = { type: 'Control', scope: { $ref: '#/properties/bar' } };
    t.context.control1['runtime'] = new runtime_1.Runtime();
});
ava_1.test('JsonFormsValidator registers as datalisteners ', function (t) {
    var validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, {});
    var dataServiceListeners = t.context.dataService['changeListeners'];
    t.is(dataServiceListeners.length, 1);
    t.is(dataServiceListeners[0], validationService);
});
ava_1.test('JsonFormsValidator dispose unregisters as datalisteners ', function (t) {
    var validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, {});
    validationService.dispose();
    var dataServiceListeners = t.context.dataService['changeListeners'];
    t.is(dataServiceListeners.length, 0);
});
ava_1.test('JsonFormsValidator isRelevantKey null ', function (t) {
    var validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, {});
    t.true(validationService.isRelevantKey(null));
});
ava_1.test('JsonFormsValidator isRelevantKey existing', function (t) {
    var uischema = { type: 'VerticalLayout',
        elements: [t.context.control1, t.context.control2] };
    var validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
    t.true(validationService.isRelevantKey(t.context.control1));
});
ava_1.test('JsonFormsValidator isRelevantKey not existing', function (t) {
    var uischema = { type: 'VerticalLayout', elements: [t.context.control1] };
    var validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
    t.true(validationService.isRelevantKey(t.context.control2));
});
ava_1.test('JsonFormsValidator notifyChange null', function (t) {
    var uischema = { type: 'VerticalLayout',
        elements: [t.context.control1, t.context.control2] };
    var validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
    validationService.notifyChange(null, null, t.context.data);
    t.is(t.context.control1['runtime'].validationErrors, undefined);
    t.deepEqual(t.context.control2['runtime'].validationErrors, ['should be >= 5']);
});
ava_1.test('JsonFormsValidator notifyChange revalidate', function (t) {
    var uischema = { type: 'VerticalLayout',
        elements: [t.context.control1, t.context.control2] };
    var validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
    validationService.notifyChange(null, null, t.context.data);
    t.context.data.foo = 12;
    t.context.data.bar = 6;
    validationService.notifyChange(null, null, t.context.data);
    t.deepEqual(t.context.control1['runtime'].validationErrors, ['should be <= 10']);
    t.is(t.context.control2['runtime'].validationErrors, undefined);
});
ava_1.test('JsonFormsValidator notifyChange error on invisible', function (t) {
    var uischema = { type: 'VerticalLayout',
        elements: [t.context.control1] };
    var validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
    validationService.notifyChange(null, null, t.context.data);
    t.is(t.context.control1['runtime'].validationErrors, undefined);
});
ava_1.test('JsonFormsValidator notifyChange all valid', function (t) {
    var uischema = { type: 'VerticalLayout',
        elements: [t.context.control1, t.context.control2] };
    var validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, uischema);
    t.context.data.bar = 6;
    validationService.notifyChange(null, null, t.context.data);
    t.is(t.context.control1['runtime'].validationErrors, undefined);
    // as there are no validation errors, the runtime object is not even created
    t.is(t.context.control2['runtime'], undefined);
});
//# sourceMappingURL=validation.service.test.js.map