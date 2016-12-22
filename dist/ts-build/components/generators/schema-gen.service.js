"use strict";
var SchemaGenerator = (function () {
    function SchemaGenerator() {
        var _this = this;
        this.properties = function (instance, allowAdditionalProperties, requiredProperties) {
            var generator = _this;
            return _.keys(instance).reduce(function (acc, key) {
                acc[key] = generator.property(instance[key], allowAdditionalProperties, requiredProperties);
                return acc;
            }, {});
        };
    }
    SchemaGenerator.requiredProperties = function (properties) {
        return properties;
    };
    SchemaGenerator.allowAdditionalProperties = function (properties) {
        return true;
    };
    SchemaGenerator.prototype.generateDefaultSchema = function (instance) {
        return this.schemaObject(instance, SchemaGenerator.allowAdditionalProperties, SchemaGenerator.requiredProperties);
    };
    ;
    SchemaGenerator.prototype.generateDefaultSchemaWithOptions = function (instance, allowAdditionalProperties, requiredProperties) {
        return this.schemaObject(instance, allowAdditionalProperties, requiredProperties);
    };
    SchemaGenerator.prototype.schemaObject = function (instance, allowAdditionalProperties, requiredProperties) {
        var properties = this.properties(instance, allowAdditionalProperties, requiredProperties);
        return {
            'type': 'object',
            'properties': properties,
            'additionalProperties': allowAdditionalProperties(properties),
            'required': requiredProperties(_.keys(properties))
        };
    };
    SchemaGenerator.prototype.property = function (instance, allowAdditionalProperties, requiredProperties) {
        switch (typeof instance) {
            case 'string':
                return { 'type': 'string' };
            case 'boolean':
                return { 'type': 'boolean' };
            case 'number':
                if (_.toNumber(instance) % 1 === 0) {
                    return { 'type': 'integer' };
                }
                return { 'type': 'number' };
            case 'object':
                return this.schemaObjectOrNullOrArray(instance, allowAdditionalProperties, requiredProperties);
            default:
                return {};
        }
    };
    SchemaGenerator.prototype.schemaObjectOrNullOrArray = function (instance, allowAdditionalProperties, requiredProperties) {
        if (!_.isNull(instance)) {
            if (_.isArray(instance)) {
                return this.schemaArray(instance, allowAdditionalProperties, requiredProperties);
            }
            else {
                return this.schemaObject(instance, allowAdditionalProperties, requiredProperties);
            }
        }
        else {
            return { 'type': 'null' };
        }
    };
    SchemaGenerator.prototype.schemaArray = function (instance, allowAdditionalProperties, requiredProperties) {
        if (instance.length) {
            var generator_1 = this;
            var allProperties = instance.map(function (object) {
                return generator_1.property(object, allowAdditionalProperties, requiredProperties);
            });
            var uniqueProperties = this.distinct(allProperties, JSON.stringify);
            if (uniqueProperties.length === 1) {
                return {
                    'type': 'array',
                    'items': uniqueProperties[0]
                };
            }
            else {
                return {
                    'type': 'array',
                    'items': {
                        'oneOf': uniqueProperties
                    }
                };
            }
        }
    };
    ;
    SchemaGenerator.prototype.distinct = function (array, discriminator) {
        var known = {};
        return array.filter(function (item) {
            var discriminatorValue = discriminator(item);
            if (_.has(known, discriminatorValue)) {
                return false;
            }
            else {
                return (known[discriminatorValue] = true);
            }
        });
    };
    ;
    return SchemaGenerator;
}());
exports.SchemaGenerator = SchemaGenerator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.generators.schema', ['jsonforms.generators'])
    .service('SchemaGenerator', SchemaGenerator)
    .name;
//# sourceMappingURL=schema-gen.service.js.map