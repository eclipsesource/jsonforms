"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ui_schema_gen_1 = require("../generators/ui-schema-gen");
exports.NOT_FITTING = -1;
var NO_UISCHEMA_DEFINITION = { uiSchema: null, tester: function (schema) { return 0; } };
var UiSchemaRegistryImpl = (function () {
    function UiSchemaRegistryImpl() {
        this.registry = [];
        this.registry.push(NO_UISCHEMA_DEFINITION);
    }
    UiSchemaRegistryImpl.prototype.register = function (uiSchema, tester) {
        this.registry.push({ uiSchema: uiSchema, tester: tester });
    };
    UiSchemaRegistryImpl.prototype.unregister = function (uiSchema, tester) {
        this.registry = _.filter(this.registry, function (el) {
            // compare testers via strict equality
            return el.tester !== tester || !_.eq(el.uiSchema, uiSchema);
        });
    };
    UiSchemaRegistryImpl.prototype.getBestUiSchema = function (schema, data) {
        var bestSchema = _.maxBy(this.registry, function (renderer) {
            return renderer.tester(schema, data);
        });
        if (bestSchema === NO_UISCHEMA_DEFINITION) {
            return ui_schema_gen_1.generateDefaultUISchema(schema);
        }
        return bestSchema.uiSchema;
    };
    return UiSchemaRegistryImpl;
}());
exports.UiSchemaRegistryImpl = UiSchemaRegistryImpl;
//# sourceMappingURL=uischema.registry.js.map