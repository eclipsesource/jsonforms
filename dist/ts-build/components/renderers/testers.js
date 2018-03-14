"use strict";
var path_resolver_1 = require('../services/path-resolver/path-resolver');
var renderer_service_1 = require('./renderer.service');
function schemaTypeIs(expected) {
    return function (uiSchema, schema, data) {
        var schemaPath = uiSchema['scope'] === undefined ? undefined : uiSchema['scope']['$ref'];
        if (schemaPath === undefined) {
            return false;
        }
        var currentDataSchema = path_resolver_1.PathResolver.resolveSchema(schema, schemaPath);
        if (currentDataSchema === undefined) {
            return false;
        }
        return currentDataSchema.type === expected;
    };
}
exports.schemaTypeIs = schemaTypeIs;
function hasDataPropertyValue(propName, expected) {
    return function (uiSchema, schema, data) {
        return _.has(data, propName) && data[propName] === expected;
    };
}
exports.hasDataPropertyValue = hasDataPropertyValue;
function uiTypeIs(expected) {
    return function (uiSchema, schema, data) {
        return uiSchema.type === expected;
    };
}
exports.uiTypeIs = uiTypeIs;
function optionIs(optionName, expected) {
    return function (uiSchema, schema, data) {
        var options = uiSchema['options'];
        if (options === undefined) {
            return false;
        }
        return options[optionName] === expected;
    };
}
exports.optionIs = optionIs;
function schemaTypeMatches(check) {
    return function (uiSchema, schema, data) {
        var schemaPath = uiSchema['scope'] === undefined ? undefined : uiSchema['scope']['$ref'];
        var currentDataSchema = path_resolver_1.PathResolver.resolveSchema(schema, schemaPath);
        return check(currentDataSchema);
    };
}
exports.schemaTypeMatches = schemaTypeMatches;
function schemaPathEndsWith(expected) {
    return function (uiSchema, schema, data) {
        if (expected === undefined || uiSchema['scope'] === undefined) {
            return false;
        }
        return _.endsWith(uiSchema['scope']['$ref'], expected);
    };
}
exports.schemaPathEndsWith = schemaPathEndsWith;
function schemaPropertyName(expected) {
    return function (uiSchema, schema, data) {
        if (expected === undefined || uiSchema['scope'] === undefined) {
            return false;
        }
        var schemaPath = uiSchema['scope']['$ref'];
        return _.last(schemaPath.split('/')) === expected;
    };
}
exports.schemaPropertyName = schemaPropertyName;
function always(uiSchema, schema, data) {
    return true;
}
exports.always = always;
var RendererTesterBuilder = (function () {
    function RendererTesterBuilder() {
    }
    RendererTesterBuilder.prototype.and = function () {
        var testers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            testers[_i - 0] = arguments[_i];
        }
        return function (uiSchema, schema, data) {
            return testers.reduce(function (acc, tester) { return acc && tester(uiSchema, schema, data); }, true);
        };
    };
    RendererTesterBuilder.prototype.create = function (test, spec) {
        return function (uiSchema, schema, data) {
            if (test(uiSchema, schema, data)) {
                return spec;
            }
            return renderer_service_1.NOT_FITTING;
        };
    };
    return RendererTesterBuilder;
}());
exports.RendererTesterBuilder = RendererTesterBuilder;
exports.Testers = new RendererTesterBuilder();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms.testers', [])
    .service('JSONFormsTesters', function () {
    return {
        schemaPathEndsWith: schemaPathEndsWith,
        schemaPropertyName: schemaPropertyName,
        schemaTypeMatches: schemaTypeMatches,
        uiTypeIs: uiTypeIs,
        schemaTypeIs: schemaTypeIs,
        optionIs: optionIs,
        and: exports.Testers.and
    };
}).name;
//# sourceMappingURL=testers.js.map