"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var path_util_1 = require("../path.util");
var uischema_registry_1 = require("./uischema.registry");
exports.isControl = function (uischema) {
    return !_.isEmpty(uischema) && uischema.scope !== undefined;
};
/**
 * Only applicable for Controls.
 *
 * This function checks whether the given UI schema is of type Control
 * and if so, resolves the sub-schema referenced by the control and applies
 * the given predicate
 *
 * @param {(JsonSchema) => boolean} predicate the predicate that should be
 *        applied to the resolved sub-schema
 */
exports.schemaMatches = function (predicate) {
    return function (uischema, schema) {
        if (_.isEmpty(uischema) || !exports.isControl(uischema)) {
            return false;
        }
        var schemaPath = uischema.scope.$ref;
        if (_.isEmpty(schemaPath)) {
            return false;
        }
        var currentDataSchema = path_util_1.resolveSchema(schema, schemaPath);
        while (!_.isEmpty(currentDataSchema) && !_.isEmpty(currentDataSchema.$ref)) {
            currentDataSchema = path_util_1.resolveSchema(schema, currentDataSchema.$ref);
        }
        if (currentDataSchema === undefined) {
            return false;
        }
        return predicate(currentDataSchema);
    };
};
exports.schemaSubPathMatches = function (subPath, predicate) {
    return function (uischema, schema) {
        if (_.isEmpty(uischema) || !exports.isControl(uischema)) {
            return false;
        }
        var schemaPath = uischema.scope.$ref;
        if (_.isEmpty(schemaPath)) {
            return false;
        }
        var currentDataSchema = path_util_1.resolveSchema(schema, schemaPath + "/" + subPath);
        while (!_.isEmpty(currentDataSchema.$ref)) {
            currentDataSchema = path_util_1.resolveSchema(schema, currentDataSchema.$ref);
        }
        if (currentDataSchema === undefined) {
            return false;
        }
        return predicate(currentDataSchema);
    };
};
/**
 * Only applicable for Controls.
 *
 * This function checks whether the given UI schema is of type Control
 * and if so, resolves the sub-schema referenced by the control and checks
 * whether the type of the sub-schema matches the expected one.
 *
 * @param {string} expectedType the expected type of the resolved sub-schema
 */
exports.schemaTypeIs = function (expectedType) { return exports.schemaMatches(function (schema) {
    return !_.isEmpty(schema) && schema.type === expectedType;
}); };
/**
 * Only applicable for Controls.
 *
 * This function checks whether the given UI schema is of type Control
 * and if so, resolves the sub-schema referenced by the control and checks
 * whether the format of the sub-schema matches the expected one.
 *
 * @param {string} expectedFormat the expected format of the resolved sub-schema
 */
exports.formatIs = function (expectedFormat) { return exports.schemaMatches(function (schema) {
    return !_.isEmpty(schema)
        && schema.format === expectedFormat
        && schema.type === 'string';
}); };
/**
 * Only applicable for Controls.
 *
 * This function checks whether the given UI schema is of type Control
 * and if so, resolves the sub-schema referenced by the control and checks
 * whether the pattern of the sub-schema matches the expected one.
 *
 * @param {string} expectedPattern the expected pattern of the resolved sub-schema
 */
exports.patternIs = function (expectedPattern) { return exports.schemaMatches(function (schema) {
    return !_.isEmpty(schema)
        && schema.pattern === expectedPattern
        && schema.type === 'string';
}); };
/**
 * Checks whether the given UI schema has the expected type.
 *
 * @param {string} expected the expected UI schema type
 */
exports.uiTypeIs = function (expected) {
    return function (uischema) {
        return !_.isEmpty(uischema) && uischema.type === expected;
    };
};
/**
 * Checks whether the given UI schema has an option with the given
 * name and whether it has the expected value. If no options property
 * is set, returns false.
 *
 * @param {string} optionName the name of the option to check
 * @param {any} optionValue the expected value of the option
 */
exports.optionIs = function (optionName, optionValue) {
    return function (uischema) {
        var options = uischema.options;
        return !_.isEmpty(options) && options[optionName] === optionValue;
    };
};
/**
 * Only applicable for Controls.
 *
 * Checks whether the scope $ref of a control ends with the expected string.
 *
 * @param {string} expected the expected ending of the $ref value
 */
exports.refEndsWith = function (expected) {
    return function (uischema) {
        if (_.isEmpty(expected) || !exports.isControl(uischema)) {
            return false;
        }
        return _.endsWith(uischema.scope.$ref, expected);
    };
};
/**
 * Only applicable for Controls.
 *
 * Checks whether the last segment of the scope $ref matches the expected string.
 *
 * @param {string} expected the expected ending of the $ref value
 */
exports.refEndIs = function (expected) {
    return function (uischema) {
        if (_.isEmpty(expected) || !exports.isControl(uischema)) {
            return false;
        }
        var schemaPath = uischema.scope.$ref;
        return !_.isEmpty(schemaPath) && _.last(schemaPath.split('/')) === expected;
    };
};
/**
 * A tester that allow composing other testers by && them.
 *
 * @param {Array<Tester>} testers the testers to be composed
 */
exports.and = function () {
    var testers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        testers[_i] = arguments[_i];
    }
    return function (uischema, schema) {
        return testers.reduce(function (acc, tester) { return acc && tester(uischema, schema); }, true);
    };
};
/**
 * Create a ranked tester that will associate a number with a given tester, if the
 * latter returns true.
 *
 * @param {number} rank the rank to be returned in case the tester returns true
 * @param {Tester} tester a tester
 */
exports.rankWith = function (rank, tester) {
    return function (uischema, schema) {
        if (tester(uischema, schema)) {
            return rank;
        }
        return uischema_registry_1.NOT_APPLICABLE;
    };
};
exports.withIncreasedRank = function (by, rankedTester) {
    return function (uischema, schema) {
        return rankedTester(uischema, schema) + by;
    };
};
//# sourceMappingURL=testers.js.map