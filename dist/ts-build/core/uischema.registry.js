"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ui_schema_gen_1 = require("../generators/ui-schema-gen");
/**
 * Constant that indicates that a tester is not capable of handling
 * a combination of schema/data.
 * @type {number}
 */
exports.NOT_APPLICABLE = -1;
/**
 * Default UI schema definition that always returns 0 as its priority.
 * @type {UISchemaDefinition}
 */
var NO_UISCHEMA_DEFINITION = {
    uiSchema: null,
    tester: function (schema) { return 0; }
};
/**
 * Implementation of the UI schema registry.
 */
var UISchemaRegistryImpl = (function () {
    function UISchemaRegistryImpl() {
        this.registry = [];
        this.registry.push(NO_UISCHEMA_DEFINITION);
    }
    /**
     * @inheritDoc
     */
    UISchemaRegistryImpl.prototype.register = function (uiSchema, tester) {
        this.registry.push({ uiSchema: uiSchema, tester: tester });
    };
    /**
     * @inheritDoc
     */
    UISchemaRegistryImpl.prototype.deregister = function (uiSchema, tester) {
        this.registry = _.filter(this.registry, function (el) {
            // compare testers via strict equality
            return el.tester !== tester || !_.eq(el.uiSchema, uiSchema);
        });
    };
    /**
     * @inheritDoc
     */
    UISchemaRegistryImpl.prototype.findMostApplicableUISchema = function (schema, data) {
        var bestSchema = _.maxBy(this.registry, function (renderer) {
            return renderer.tester(schema, data);
        });
        if (bestSchema === NO_UISCHEMA_DEFINITION) {
            return ui_schema_gen_1.generateDefaultUISchema(schema);
        }
        return bestSchema.uiSchema;
    };
    return UISchemaRegistryImpl;
}());
exports.UISchemaRegistryImpl = UISchemaRegistryImpl;
//# sourceMappingURL=uischema.registry.js.map