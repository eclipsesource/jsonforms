import * as _ from 'lodash';
import { JsonSchema } from '../models/jsonSchema';
import { ControlElement, UISchemaElement } from '../models/uischema';
import { resolveSchema } from '../path.util';
import { NOT_APPLICABLE } from './uischema.registry';

/**
 * A tester is a function that receives an UI schema and a JSON schema and returns a boolean.
 */
export type Tester = (uischema: UISchemaElement, schema: JsonSchema) => boolean;

/**
 * A ranked tester associates a tester with a number.
 */
export type RankedTester = (uischema: UISchemaElement, schema: JsonSchema) => number;

export const isControl = (uischema: any): uischema is ControlElement =>
  !_.isEmpty(uischema) && uischema.scope !== undefined;

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
export const schemaMatches = (predicate: (schema: JsonSchema) => boolean): Tester =>
    (uischema: UISchemaElement, schema: JsonSchema): boolean => {
        if (_.isEmpty(uischema) || !isControl(uischema)) {
            return false;
        }
        const schemaPath = uischema.scope.$ref;
        if (_.isEmpty(schemaPath)) {
            return false;
        }
        let currentDataSchema: JsonSchema = resolveSchema(schema, schemaPath);
        while (!_.isEmpty(currentDataSchema) && !_.isEmpty(currentDataSchema.$ref)) {
          currentDataSchema = resolveSchema(schema, currentDataSchema.$ref);
        }
        if (currentDataSchema === undefined) {
            return false;
        }

        return predicate(currentDataSchema);
    };

export const schemaSubPathMatches =
(subPath: string, predicate: (schema: JsonSchema) => boolean): Tester =>
    (uischema: UISchemaElement, schema: JsonSchema): boolean => {
      if (_.isEmpty(uischema) || !isControl(uischema)) {
          return false;
      }
      const schemaPath = uischema.scope.$ref;
      if (_.isEmpty(schemaPath)) {
          return false;
      }
      let currentDataSchema: JsonSchema = resolveSchema(schema, `${schemaPath}/${subPath}`);
      while (!_.isEmpty(currentDataSchema.$ref)) {
        currentDataSchema = resolveSchema(schema, currentDataSchema.$ref);
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
 * @param {string} expectedFormat the expected format of the resolved sub-schema
 */
export const formatIs = (expectedFormat: string): Tester => schemaMatches(schema =>
    !_.isEmpty(schema)
    && schema.format === expectedFormat
    && schema.type === 'string'
);

/**
 * Only applicable for Controls.
 *
 * This function checks whether the given UI schema is of type Control
 * and if so, resolves the sub-schema referenced by the control and checks
 * whether the pattern of the sub-schema matches the expected one.
 *
 * @param {string} expectedPattern the expected pattern of the resolved sub-schema
 */
export const patternIs = (expectedPattern: string): Tester => schemaMatches(schema =>
    !_.isEmpty(schema)
    && schema.pattern === expectedPattern
    && schema.type === 'string'
);

/**
 * Checks whether the given UI schema has the expected type.
 *
 * @param {string} expected the expected UI schema type
 */
export const uiTypeIs = (expected: string): Tester =>
    (uischema: UISchemaElement): boolean =>
    !_.isEmpty(uischema) && uischema.type === expected;

/**
 * Checks whether the given UI schema has an option with the given
 * name and whether it has the expected value. If no options property
 * is set, returns false.
 *
 * @param {string} optionName the name of the option to check
 * @param {any} optionValue the expected value of the option
 */
export const optionIs = (optionName: string, optionValue: any): Tester =>
    (uischema: UISchemaElement): boolean => {
        const options = uischema.options;

        return !_.isEmpty(options) && options[optionName] === optionValue;
    };

/**
 * Only applicable for Controls.
 *
 * Checks whether the scope $ref of a control ends with the expected string.
 *
 * @param {string} expected the expected ending of the $ref value
 */
export const refEndsWith = (expected: string): Tester =>
    (uischema: UISchemaElement): boolean => {
        if (_.isEmpty(expected) || !isControl(uischema)) {
            return false;
        }

        return _.endsWith(uischema.scope.$ref, expected);
    };

/**
 * Only applicable for Controls.
 *
 * Checks whether the last segment of the scope $ref matches the expected string.
 *
 * @param {string} expected the expected ending of the $ref value
 */
export const refEndIs = (expected: string): Tester =>
    (uischema: UISchemaElement): boolean => {
        if (_.isEmpty(expected) || !isControl(uischema)) {
            return false;
        }
        const schemaPath = uischema.scope.$ref;

        return !_.isEmpty(schemaPath) && _.last(schemaPath.split('/')) === expected;
    };

/**
 * A tester that allow composing other testers by && them.
 *
 * @param {Array<Tester>} testers the testers to be composed
 */
export const and = (...testers: Tester[]): Tester =>
    (uischema: UISchemaElement, schema: JsonSchema) =>
        testers.reduce((acc, tester) => acc && tester(uischema, schema), true);

/**
 * Create a ranked tester that will associate a number with a given tester, if the
 * latter returns true.
 *
 * @param {number} rank the rank to be returned in case the tester returns true
 * @param {Tester} tester a tester
 */
export const rankWith = (rank: number, tester: Tester)  =>
    (uischema: UISchemaElement, schema: JsonSchema): number => {
        if (tester(uischema, schema)) {
            return rank;
        }

        return NOT_APPLICABLE;
    };

export const withIncreasedRank = (by: number, rankedTester: RankedTester) =>
  (uischema: UISchemaElement, schema: JsonSchema): number => {
    return rankedTester(uischema, schema) + by;
};
