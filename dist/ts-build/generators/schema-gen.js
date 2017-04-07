"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdditionalProperties = 'additionalProperties';
var RequiredProperties = 'required';
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
exports.generateJsonSchema = function (instance, options) {
    if (options === void 0) { options = {}; }
    var findOption = function (props) { return function (optionName) {
        switch (optionName) {
            case AdditionalProperties:
                if (options.hasOwnProperty(AdditionalProperties)) {
                    return options[AdditionalProperties];
                }
                return true;
            case RequiredProperties:
                if (options.hasOwnProperty(RequiredProperties)) {
                    return options[RequiredProperties](props);
                }
                return Object.keys(props);
        }
    }; };
    var gen = new (function () {
        function class_1() {
            var _this = this;
            this.schemaObject = function (data) {
                var props = _this.properties(data);
                var schema = {
                    'type': 'object',
                    'properties': props,
                    'additionalProperties': findOption(props)(AdditionalProperties)
                };
                var required = findOption(props)(RequiredProperties);
                if (required.length > 0) {
                    schema['required'] = required;
                }
                return schema;
            };
            this.properties = function (data) {
                return Object.keys(data).reduce(function (acc, propName) {
                    acc[propName] = _this.property(data[propName]);
                    return acc;
                }, {});
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
                if (data.length) {
                    var allProperties = data.map(_this.property);
                    var uniqueProperties = distinct(allProperties, JSON.stringify);
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
        return class_1;
    }());
    return gen.schemaObject(instance);
};
exports.default = exports.generateJsonSchema;
//# sourceMappingURL=schema-gen.js.map