"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var ui_schema_gen_1 = require("../src/generators/ui-schema-gen");
var uischema_registry_1 = require("../src/core/uischema.registry");
ava_1.test('UiSchemaRegistry returns GeneratedUiSchema', function (t) {
    var registry = new uischema_registry_1.UiSchemaRegistryImpl();
    var schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    var bestUiSchema = registry.getBestUiSchema(schema, { name: 'John Doe' });
    t.deepEqual(bestUiSchema, ui_schema_gen_1.generateDefaultUISchema(schema));
});
ava_1.test('UiSchemaRegistry returns registered', function (t) {
    var registry = new uischema_registry_1.UiSchemaRegistryImpl();
    var schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    var uischema = { type: 'Group', elements: [
            { type: 'Control', scope: { $ref: '#/properties/name' }, label: 'My Name' }
        ] };
    registry.register(uischema, function () { return 5; });
    var bestUiSchema = registry.getBestUiSchema(schema, { name: 'John Doe' });
    t.is(bestUiSchema, uischema);
});
ava_1.test('UiSchemaRegistry returns generated if unregistered', function (t) {
    var registry = new uischema_registry_1.UiSchemaRegistryImpl();
    var schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    var uischema = { type: 'Group', elements: [
            { type: 'Control', scope: { $ref: '#/properties/name' }, label: 'My Name' }
        ] };
    var tester = function () { return 5; };
    registry.register(uischema, tester);
    registry.unregister(uischema, tester);
    var bestUiSchema = registry.getBestUiSchema(schema, { name: 'John Doe' });
    t.deepEqual(bestUiSchema, ui_schema_gen_1.generateDefaultUISchema(schema));
});
ava_1.test('UiSchemaRegistry returns highest Fitting', function (t) {
    var registry = new uischema_registry_1.UiSchemaRegistryImpl();
    var schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    var uischema1 = { type: 'HorizontalLayout', elements: [
            { type: 'Control', scope: { $ref: '#/properties/name' }, label: 'My Name' }
        ] };
    var uischema2 = { type: 'Group', label: 'My Group', elements: [
            { type: 'Control', scope: { $ref: '#/properties/name' }, label: 'My Name' }
        ] };
    registry.register(uischema2, function (test_schema) { return test_schema === schema ? 10 : -1; });
    registry.register(uischema1, function (test_schema) { return test_schema === schema ? 5 : -1; });
    var bestUiSchema = registry.getBestUiSchema(schema, { name: 'John Doe' });
    t.is(bestUiSchema, uischema2);
});
ava_1.test('UiSchemaRegistry returns best fit after unregistering an element', function (t) {
    var registry = new uischema_registry_1.UiSchemaRegistryImpl();
    var schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    var uischema1 = { type: 'HorizontalLayout', elements: [
            { type: 'Control', scope: { $ref: '#/properties/name' }, label: 'My Name' }
        ] };
    var uischema2 = { type: 'Group', label: 'My Group', elements: [
            { type: 'Control', scope: { $ref: '#/properties/name' }, label: 'My Name' }
        ] };
    var uischema3 = { type: 'VertialLayout', elements: [
            { type: 'Control', scope: { $ref: '#/properties/name' }, label: 'My Name' }
        ] };
    var tester1 = function (test_schema) { return test_schema === schema ? 1 : -1; };
    var tester2 = function (test_schema) { return test_schema === schema ? 3 : -1; };
    var tester3 = function (test_schema) { return test_schema === schema ? 2 : -1; };
    registry.register(uischema1, tester1);
    registry.register(uischema2, tester2);
    registry.register(uischema3, tester3);
    registry.unregister(uischema2, tester2);
    // tester3 should be triggered
    var bestUiSchema = registry.getBestUiSchema(schema, { name: 'John Doe' });
    t.is(bestUiSchema, uischema3);
});
//# sourceMappingURL=uischema.registry.test.js.map