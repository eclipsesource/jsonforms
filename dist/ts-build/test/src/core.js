"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const uischema_registry_1 = require("./core/uischema.registry");
const styling_registry_1 = require("./core/styling.registry");
const schema_service_impl_1 = require("./core/schema.service.impl");
class JsonFormsConfig {
    setIdentifyingProp(propName) {
        this._identifyingProp = propName;
    }
    getIdentifyingProp() {
        return this._identifyingProp;
    }
    shouldGenerateIdentifier() {
        return this._identifyingProp !== undefined;
    }
}
exports.JsonFormsConfig = JsonFormsConfig;
/**
 * Global JSONForms object that holds services and registries.
 */
class JsonForms {
    static set schema(schema) {
        JsonForms._schemaService = new schema_service_impl_1.SchemaServiceImpl(schema);
    }
    static get schemaService() {
        if (this._schemaService === undefined) {
            console.error('Schema service has not been initialized');
        }
        return this._schemaService;
    }
    static get config() {
        return this._config;
    }
}
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
JsonForms.filterObjectsByType = (objects, schemaId) => {
    return objects.filter(value => {
        const valueSchemaId = JsonForms.getSchemaIdForObject(value);
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
JsonForms.getSchemaIdForObject = (object) => {
    if (JsonForms.modelMapping !== undefined && !_.isEmpty(object)) {
        const mappingAttribute = JsonForms.modelMapping.attribute;
        if (!_.isEmpty(mappingAttribute)) {
            const mappingValue = object[mappingAttribute];
            const schemaElementId = JsonForms.modelMapping.mapping[mappingValue];
            return !_.isEmpty(schemaElementId) ? schemaElementId : null;
        }
    }
    return null;
};
exports.JsonForms = JsonForms;
/**
 * Annotation for registering a class as JSONForms service.
 * @param config
 * @constructor
 */
// Disable rule because it is used as an decorator
// tslint:disable:variable-name
exports.JsonFormsServiceElement = config => (cls) => {
    JsonForms.jsonFormsServices.push(cls);
};
// tslint:enable:variable-name
//# sourceMappingURL=core.js.map