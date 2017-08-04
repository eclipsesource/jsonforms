"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const data_service_1 = require("../src/core/data.service");
const runtime_1 = require("../src/core/runtime");
const validation_service_1 = require("../src/services/validation.service");
ava_1.test.beforeEach(t => {
    t.context.data = { foo: 2, bar: 3 };
    t.context.dataService = new data_service_1.DataService(t.context.data);
    t.context.schema = {
        type: 'object',
        properties: {
            foo: { type: 'number', maximum: 10 },
            bar: { type: 'number', minimum: 5 },
        },
    };
    t.context.control1 = { type: 'Control', scope: { $ref: '#/properties/foo' } };
    t.context.control2 = { type: 'Control', scope: { $ref: '#/properties/bar' } };
    t.context.uiSchema = {
        type: 'VerticalLayout',
        elements: [
            t.context.control1,
            t.context.control2
        ]
    };
    t.context.control1.runtime = new runtime_1.Runtime();
});
ava_1.test('validation service should act as a data change listener', t => {
    const validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, t.context.uiSchema);
    const dataServiceListeners = t.context.dataService.dataChangeListeners;
    t.is(dataServiceListeners.length, 1);
    t.is(dataServiceListeners[0], validationService);
});
ava_1.test('disposing the validation service should de-register it as data change listener', t => {
    const validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, t.context.uiSchema);
    validationService.dispose();
    const dataServiceListeners = t.context.dataService.dataChangeListeners;
    t.is(dataServiceListeners.length, 0);
});
ava_1.test('validation service needs notification about null', t => {
    const validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, t.context.uiSchema);
    t.true(validationService.needsNotificationAbout(null));
});
ava_1.test('validation service needs notification about registered control', t => {
    const validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, t.context.uiSchema);
    t.true(validationService.needsNotificationAbout(t.context.control1));
});
ava_1.test('validation service does not need notification about un-registered control', t => {
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [t.context.control1]
    };
    const validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
    t.true(validationService.needsNotificationAbout(t.context.control2));
});
ava_1.test('data change with null should update validation errors', t => {
    const validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, t.context.uiSchema);
    validationService.dataChanged(null, null, t.context.data);
    t.is(t.context.control1.runtime.validationErrors, undefined);
    t.deepEqual(t.context.control2.runtime.validationErrors, ['should be >= 5']);
});
ava_1.test('data chane should trigger re-validation', t => {
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [
            t.context.control1,
            t.context.control2
        ]
    };
    const validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
    validationService.dataChanged(null, null, t.context.data);
    t.context.data.foo = 12;
    t.context.data.bar = 6;
    validationService.dataChanged(null, null, t.context.data);
    t.deepEqual(t.context.control1.runtime.validationErrors, ['should be <= 10']);
    t.is(t.context.control2.runtime.validationErrors, undefined);
});
ava_1.test('data change should not cause validation errors if registered control is not visible', t => {
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [t.context.control1]
    };
    const validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
    validationService.dataChanged(null, null, t.context.data);
    t.is(t.context.control1.runtime.validationErrors, undefined);
});
ava_1.test('data change should not trigger creation of runtime object if instance is valid', t => {
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [
            t.context.control1,
            t.context.control2
        ]
    };
    const validationService = new validation_service_1.JsonFormsValidator(t.context.dataService, t.context.schema, uiSchema);
    t.context.data.bar = 6;
    validationService.dataChanged(null, null, t.context.data);
    t.is(t.context.control1.runtime.validationErrors, undefined);
    // as there are no validation errors, the runtime object is not even created
    t.is(t.context.control2.runtime, undefined);
});
//# sourceMappingURL=validation.service.test.js.map