"use strict";
exports.NOT_FITTING = -1;
var NO_UISCHEMA_DEFINITION = { uiSchema: null, tester: function (schema) { return 0; } };
var UiSchemaRegistryImpl = (function () {
    function UiSchemaRegistryImpl(uiSchemaGenerator) {
        this.uiSchemaGenerator = uiSchemaGenerator;
        this.registry = [];
        this.registry.push(NO_UISCHEMA_DEFINITION);
    }
    UiSchemaRegistryImpl.prototype.register = function (uiSchema, tester) {
        this.registry.push({ uiSchema: uiSchema, tester: tester });
    };
    UiSchemaRegistryImpl.prototype.getBestUiSchema = function (schema, data) {
        var bestSchema = _.maxBy(this.registry, function (renderer) {
            return renderer.tester(schema, data);
        });
        if (bestSchema === NO_UISCHEMA_DEFINITION) {
            return this.uiSchemaGenerator.generateDefaultUISchema(schema);
        }
        return bestSchema.uiSchema;
    };
    UiSchemaRegistryImpl.$inject = ['UISchemaGenerator'];
    return UiSchemaRegistryImpl;
}());
exports.UiSchemaRegistryImpl = UiSchemaRegistryImpl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.service.uischema-registry', [])
    .service('UiSchemaRegistry', UiSchemaRegistryImpl)
    .name;
//# sourceMappingURL=ui-schema-registry.service.js.map