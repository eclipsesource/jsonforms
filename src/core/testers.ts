import * as _ from 'lodash';
import {UISchemaElement} from '../models/uischema';
import {JsonSchema} from '../models/jsonSchema';
import {resolveSchema} from '../path.util';
import {NOT_FITTING} from './uischema.registry';

/**
 * A tester is a function that receives an UI schema and a JSON schema and returns a boolean.
 */
export type Tester = (uiSchema: UISchemaElement, schema: JsonSchema) => boolean

/**
 * A ranked tester associate a tester with a number.
 */
export type RankedTester = (uiSchema: UISchemaElement, schema: JsonSchema) => number

/**
 * Only applicable for Controls.
 *
 * This function checks whether the given UI schema is of type Control
 * and if so, resolves the sub-schema referenced by the control and applies
 * the given predicate
 *
 * @param predicate the predicate that should be applied to the resolved sub-schema
 */
export const schemaMatches = (predicate: (schema: JsonSchema) => boolean): Tester =>
    (uiSchema: UISchemaElement, schema: JsonSchema): boolean => {
        if (_.isEmpty(uiSchema)) {
            return false;
        }
        const schemaPath = _.isEmpty(uiSchema['scope']) ? undefined : uiSchema['scope']['$ref'];
        if (_.isEmpty(schemaPath)) {
            return false;
        }
        const currentDataSchema: JsonSchema = resolveSchema(schema, schemaPath);
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
 * @param expectedType the expected type of the resolved sub-schema
 */
export const schemaTypeIs = (expectedType: string): Tester => schemaMatches(schema =>
    !_.isEmpty(schema) && schema.type === expectedType
);

/**
 * Only applicable for Controls.
 *
 * This function checks whether the given UI schema is of type Control
 * and if so, resolves the sub-schema referenced by the control and checks
 * whether the format of the sub-schema matches the expected one.
 *
 * @param expectedFormat the expected format of the resolved sub-schema
 */
export const formatIs = (expectedFormat: string): Tester => schemaMatches(schema =>
    !_.isEmpty(schema)
    && schema.format === expectedFormat
    && schema.type === 'string'
);

/**
 * Checks whether the given UI schema has the expected type.
 *
 * @param expected the expected UI schema type
 */
export const uiTypeIs = (expected: string): Tester =>
    (uiSchema: UISchemaElement): boolean =>
    !_.isEmpty(uiSchema) && uiSchema.type === expected;


/**
 * Checks whether the given UI schema has an option with the given
 * name and whether it has the expected value. If no options property
 * is set, returns false.
 *
 * @param optionName the name of the option to check
 * @param optionValue the expected value of the option
 */
export const optionIs = (optionName: string, optionValue: any): Tester =>
    (uiSchema: UISchemaElement): boolean => {
        const options = uiSchema['options'];
        return !_.isEmpty(options) && options[optionName] === optionValue;
    };

/**
 * Only applicable for Controls.
 *
 * Checks whether the scope $ref of a control ends with the expected string.
 *
 * @param expected the expected ending of the $ref value
 */
export const refEndsWith = (expected: string): Tester =>
    (uiSchema: UISchemaElement): boolean => {
        if (_.isEmpty(expected) || _.isEmpty(uiSchema['scope'])) {
            return false;
        }
        return _.endsWith(uiSchema['scope']['$ref'], expected);
    };

/**
 * Only applicable for Controls.
 *
 * Checks whether the last segment of the scope $ref matches the expected string.
 *
 * @param expected the expected ending of the $ref value
 */
export const refEndIs = (expected: string): Tester =>
    (uiSchema: UISchemaElement): boolean => {
        if (_.isEmpty(expected) || _.isEmpty(uiSchema['scope'])) {
            return false;
        }
        const schemaPath = uiSchema['scope']['$ref'];
        return !_.isEmpty(schemaPath) && _.last(schemaPath.split('/')) === expected;
    };

/**
 * A tester that allow composing other testers by && them.
 *
 * @param testers the tester to be composed
 */
export const and = (
    ...testers: Array<(uiSchema: UISchemaElement, schema: JsonSchema) => boolean>
): Tester =>
    (uiSchema: UISchemaElement, schema: JsonSchema) =>
        testers.reduce((acc, tester) => acc && tester(uiSchema, schema), true);


/**
 * Create a ranked tester that will associate a number with a given tester, if the
 * latter returns true.
 *
 * @param rank the rank to be returned in case the tester returns true
 * @param tester a tester
 */
export const rankWith = (rank: number, tester: Tester)  =>
    (uiSchema: UISchemaElement, schema: JsonSchema): number => {
        if (tester(uiSchema, schema)) {
            return rank;
        }
        return NOT_FITTING;
    };
