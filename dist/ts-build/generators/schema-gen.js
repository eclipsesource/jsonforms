"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ADDITIONAL_PROPERTIES = 'additionalProperties';
var REQUIRED_PROPERTIES = 'required';
var distinct = function (array, discriminator) {
    var known = {};
    return array.filter(function (item) {
        var discriminatorValue = discriminator(item);
        if (known.hasOwnProperty(discriminatorValue)) {
            return false;
        }
        else {
            known[discriminatorValue] = true;
            return true;
        }
    });
};
var Gen = (function () {
    function Gen(findOption) {
        var _this = this;
        this.findOption = findOption;
        this.schemaObject = function (data) {
            var props = _this.properties(data);
            var schema = {
                'type': 'object',
                'properties': props,
                'additionalProperties': _this.findOption(props)(ADDITIONAL_PROPERTIES)
            };
            var required = _this.findOption(props)(REQUIRED_PROPERTIES);
            if (required.length > 0) {
                schema.required = required;
            }
            return schema;
        };
        this.properties = function (data) {
            var emptyProps = {};
            return Object
                .keys(data)
                .reduce(function (acc, propName) {
                acc[propName] = _this.property(data[propName]);
                return acc;
            }, emptyProps);
        };
        this.property = function (data) {
            switch (typeof data) {
                case 'string':
                    return { 'type': 'string' };
                case 'boolean':
                    return { 'type': 'boolean' };
                case 'number':
                    if (Number.isInteger(data)) {
                        return { 'type': 'integer' };
                    }
                    return { 'type': 'number' };
                case 'object':
                    if (data == null) {
                        return { 'type': 'null' };
                    }
                    return _this.schemaObjectOrArray(data);
                default:
                    return {};
            }
        };
        this.schemaObjectOrArray = function (data) {
            if (data instanceof Array) {
                return _this.schemaArray(data);
            }
            else {
                return _this.schemaObject(data);
            }
        };
        this.schemaArray = function (data) {
            if (data.length > 0) {
                var allProperties = data.map(_this.property);
                var uniqueProperties = distinct(allProperties, function (prop) { return JSON.stringify(prop); });
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
            else {
                return {
                    'type': 'array',
                    'items': {}
                };
            }
        };
    }
    return Gen;
}());
/**
 * Generate a JSON schema based on the given data and any additional options.
 * @param {Object} instance the data to create a JSON schema for
 * @param {any} options any additional options that may alter the generated JSON schema
 * @returns {JsonSchema} the generated schema
 */
exports.generateJsonSchema = function (instance, options) {
    if (options === void 0) { options = {}; }
    var findOption = function (props) { return function (optionName) {
        switch (optionName) {
            case ADDITIONAL_PROPERTIES:
                if (options.hasOwnProperty(ADDITIONAL_PROPERTIES)) {
                    return options[ADDITIONAL_PROPERTIES];
                }
                return true;
            case REQUIRED_PROPERTIES:
                if (options.hasOwnProperty(REQUIRED_PROPERTIES)) {
                    return options[REQUIRED_PROPERTIES](props);
                }
                return Object.keys(props);
            default:
                return;
        }
    }; };
    var gen = new Gen(findOption);
    return gen.schemaObject(instance);
};
//# sourceMappingURL=schema-gen.js.map