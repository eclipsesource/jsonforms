"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const path_util_1 = require("../path.util");
const uischema_registry_1 = require("./uischema.registry");
const isControl = (uiSchema) => uiSchema.scope !== undefined;
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
exports.schemaMatches = (predicate) => (uiSchema, schema) => {
    if (_.isEmpty(uiSchema) || !isControl(uiSchema)) {
        return false;
    }
    const schemaPath = uiSchema.scope.$ref;
    if (_.isEmpty(schemaPath)) {
        return false;
    }
    let currentDataSchema = path_util_1.resolveSchema(schema, schemaPath);
    while (!_.isEmpty(currentDataSchema) && !_.isEmpty(currentDataSchema.$ref)) {
        currentDataSchema = path_util_1.resolveSchema(schema, currentDataSchema.$ref);
    }
    if (currentDataSchema === undefined) {
        return false;
    }
    return predicate(currentDataSchema);
};
exports.schemaSubPathMatches = (subPath, predicate) => (uiSchema, schema) => {
    if (_.isEmpty(uiSchema) || !isControl(uiSchema)) {
        return false;
    }
    const schemaPath = uiSchema.scope.$ref;
    if (_.isEmpty(schemaPath)) {
        return false;
    }
    let currentDataSchema = path_util_1.resolveSchema(schema, `${schemaPath}/${subPath}`);
    while (!_.isEmpty(currentDataSchema.$ref)) {
        currentDataSchema = path_util_1.resolveSchema(schema, currentDataSchema.$ref);
    }
    if (currentDataSchema === undefined) {
        return false;
    }
    return predicate(currentDataSchema);
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
exports.schemaTypeIs = (expectedType) => exports.schemaMatches(schema => !_.isEmpty(schema) && schema.type === expectedType);
/**
 * Only applicable for Controls.
 *
 * This function checks whether the given UI schema is of type Control
 * and if so, resolves the sub-schema referenced by the control and checks
 * whether the format of the sub-schema matches the expected one.
 *
 * @param {string} expectedFormat the expected format of the resolved sub-schema
 */
exports.formatIs = (expectedFormat) => exports.schemaMatches(schema => !_.isEmpty(schema)
    && schema.format === expectedFormat
    && schema.type === 'string');
/**
 * Checks whether the given UI schema has the expected type.
 *
 * @param {string} expected the expected UI schema type
 */
exports.uiTypeIs = (expected) => (uiSchema) => !_.isEmpty(uiSchema) && uiSchema.type === expected;
/**
 * Checks whether the given UI schema has an option with the given
 * name and whether it has the expected value. If no options property
 * is set, returns false.
 *
 * @param {string} optionName the name of the option to check
 * @param {any} optionValue the expected value of the option
 */
exports.optionIs = (optionName, optionValue) => (uiSchema) => {
    const options = uiSchema.options;
    return !_.isEmpty(options) && options[optionName] === optionValue;
};
/**
 * Only applicable for Controls.
 *
 * Checks whether the scope $ref of a control ends with the expected string.
 *
 * @param {string} expected the expected ending of the $ref value
 */
exports.refEndsWith = (expected) => (uiSchema) => {
    if (_.isEmpty(expected) || !isControl(uiSchema)) {
        return false;
    }
    return _.endsWith(uiSchema.scope.$ref, expected);
};
/**
 * Only applicable for Controls.
 *
 * Checks whether the last segment of the scope $ref matches the expected string.
 *
 * @param {string} expected the expected ending of the $ref value
 */
exports.refEndIs = (expected) => (uiSchema) => {
    if (_.isEmpty(expected) || !isControl(uiSchema)) {
        return false;
    }
    const schemaPath = uiSchema.scope.$ref;
    return !_.isEmpty(schemaPath) && _.last(schemaPath.split('/')) === expected;
};
/**
 * A tester that allow composing other testers by && them.
 *
 * @param {Array<Tester>} testers the testers to be composed
 */
exports.and = (...testers) => (uiSchema, schema) => testers.reduce((acc, tester) => acc && tester(uiSchema, schema), true);
/**
 * Create a ranked tester that will associate a number with a given tester, if the
 * latter returns true.
 *
 * @param {number} rank the rank to be returned in case the tester returns true
 * @param {Tester} tester a tester
 */
exports.rankWith = (rank, tester) => (uiSchema, schema) => {
    if (tester(uiSchema, schema)) {
        return rank;
    }
    return uischema_registry_1.NOT_APPLICABLE;
};
//# sourceMappingURL=testers.js.map