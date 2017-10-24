"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var uischema_registry_1 = require("./core/uischema.registry");
var styling_registry_1 = require("./core/styling.registry");
var schema_service_impl_1 = require("./core/schema.service.impl");
var JsonFormsConfig = /** @class */ (function () {
    function JsonFormsConfig() {
    }
    JsonFormsConfig.prototype.setIdentifyingProp = function (propName) {
        this._identifyingProp = propName;
    };
    JsonFormsConfig.prototype.getIdentifyingProp = function () {
        return this._identifyingProp;
    };
    JsonFormsConfig.prototype.shouldGenerateIdentifier = function () {
        return this._identifyingProp !== undefined;
    };
    return JsonFormsConfig;
}());
exports.JsonFormsConfig = JsonFormsConfig;
/**
 * Global JSONForms object that holds services and registries.
 */
var JsonForms = /** @class */ (function () {
    function JsonForms() {
    }
    Object.defineProperty(JsonForms, "schema", {
        set: function (schema) {
            JsonForms._schemaService = new schema_service_impl_1.SchemaServiceImpl(schema);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonForms, "schemaService", {
        get: function () {
            if (this._schemaService === undefined) {
                console.error('Schema service has not been initialized');
            }
            return this._schemaService;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonForms, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    JsonForms._config = new JsonFormsConfig();
    JsonForms.renderers = [];
    JsonForms.jsonFormsServices = [];
    JsonForms.uischemaRegistry = new uischema_registry_1.UISchemaRegistryImpl();
    JsonForms.stylingRegistry = new styling_registry_1.StylingRegistryImpl();
    /**
     * Uses the model mapping to filter all objects that are associated with the type
     * defined by the given schema id. If there is no applicable mapping,
     * we assume that no mapping is necessary and do not filter out affected data objects.
     *
     * @param objects the list of data objects to filter
     * @param schemaId The id of the JsonSchema defining the type to filter for
     * @return The filtered data objects or all objects if there is no applicable mapping
     */
    JsonForms.filterObjectsByType = function (objects, schemaId) {
        return objects.filter(function (value) {
            var valueSchemaId = JsonForms.getSchemaIdForObject(value);
            if (valueSchemaId === null) {
                return true;
            }
            return valueSchemaId === schemaId;
        });
    };
    /**
     * Uses the model mapping to find the schema id defining the type of the given object.
     * If no schema id can be determined either because the object is empty, there is no model
     * mapping, or the object does not contain a mappable property.
     * TODO expected behavior?
     *
     * @param object The object whose type is determined
     * @return The schema id of the object or null if it could not be determined
     */
    JsonForms.getSchemaIdForObject = function (object) {
        if (JsonForms.modelMapping !== undefined && !_.isEmpty(object)) {
            var mappingAttribute = JsonForms.modelMapping.attribute;
            if (!_.isEmpty(mappingAttribute)) {
                var mappingValue = object[mappingAttribute];
                var schemaElementId = JsonForms.modelMapping.mapping[mappingValue];
                return !_.isEmpty(schemaElementId) ? schemaElementId : null;
            }
        }
        return null;
    };
    return JsonForms;
}());
exports.JsonForms = JsonForms;
/**
 * Annotation for registering a class as JSONForms service.
 * @param config
 * @constructor
 */
// Disable rule because it is used as an decorator
// tslint:disable:variable-name
exports.JsonFormsServiceElement = function (config) { return function (cls) {
    JsonForms.jsonFormsServices.push(cls);
}; };
// tslint:enable:variable-name
//# sourceMappingURL=core.js.map