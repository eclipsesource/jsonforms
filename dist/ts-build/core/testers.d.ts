import { JsonSchema } from '../models/jsonSchema';
import { UISchemaElement } from '../models/uischema';
/**
 * A tester is a function that receives an UI schema and a JSON schema and returns a boolean.
 */
export declare type Tester = (uiSchema: UISchemaElement, schema: JsonSchema) => boolean;
/**
 * A ranked tester associates a tester with a number.
 */
export declare type RankedTester = (uiSchema: UISchemaElement, schema: JsonSchema) => number;
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
export declare const schemaMatches: (predicate: (schema: JsonSchema) => boolean) => Tester;
export declare const schemaSubPathMatches: (subPath: string, predicate: (schema: JsonSchema) => boolean) => Tester;
/**
 * Only applicable for Controls.
 *
 * This function checks whether the given UI schema is of type Control
 * and if so, resolves the sub-schema referenced by the control and checks
 * whether the type of the sub-schema matches the expected one.
 *
 * @param {string} expectedType the expected type of the resolved sub-schema
 */
export declare const schemaTypeIs: (expectedType: string) => Tester;
/**
 * Only applicable for Controls.
 *
 * This function checks whether the given UI schema is of type Control
 * and if so, resolves the sub-schema referenced by the control and checks
 * whether the format of the sub-schema matches the expected one.
 *
 * @param {string} expectedFormat the expected format of the resolved sub-schema
 */
export declare const formatIs: (expectedFormat: string) => Tester;
/**
 * Checks whether the given UI schema has the expected type.
 *
 * @param {string} expected the expected UI schema type
 */
export declare const uiTypeIs: (expected: string) => Tester;
/**
 * Checks whether the given UI schema has an option with the given
 * name and whether it has the expected value. If no options property
 * is set, returns false.
 *
 * @param {string} optionName the name of the option to check
 * @param {any} optionValue the expected value of the option
 */
export declare const optionIs: (optionName: string, optionValue: any) => Tester;
/**
 * Only applicable for Controls.
 *
 * Checks whether the scope $ref of a control ends with the expected string.
 *
 * @param {string} expected the expected ending of the $ref value
 */
export declare const refEndsWith: (expected: string) => Tester;
/**
 * Only applicable for Controls.
 *
 * Checks whether the last segment of the scope $ref matches the expected string.
 *
 * @param {string} expected the expected ending of the $ref value
 */
export declare const refEndIs: (expected: string) => Tester;
/**
 * A tester that allow composing other testers by && them.
 *
 * @param {Array<Tester>} testers the testers to be composed
 */
export declare const and: (...testers: Tester[]) => Tester;
/**
 * Create a ranked tester that will associate a number with a given tester, if the
 * latter returns true.
 *
 * @param {number} rank the rank to be returned in case the tester returns true
 * @param {Tester} tester a tester
 */
export declare const rankWith: (rank: number, tester: Tester) => (uiSchema: UISchemaElement, schema: JsonSchema) => number;
