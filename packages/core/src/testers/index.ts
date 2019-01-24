/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import endsWith from 'lodash/endsWith';
import last from 'lodash/last';
import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';
import toPairs from 'lodash/toPairs';
import has from 'lodash/has';
import includes from 'lodash/includes';
import { JsonSchema } from '../models/jsonSchema';
import {
  Categorization,
  ControlElement,
  UISchemaElement
} from '../models/uischema';
import { resolveSchema } from '../util/resolvers';

/**
 * Constant that indicates that a tester is not capable of handling
 * a combination of schema/data.
 * @type {number}
 */
export const NOT_APPLICABLE = -1;
/**
 * A tester is a function that receives an UI schema and a JSON schema and returns a boolean.
 */
export type Tester = (uischema: UISchemaElement, schema: JsonSchema) => boolean;

/**
 * A ranked tester associates a tester with a number.
 */
export type RankedTester = (
  uischema: UISchemaElement,
  schema: JsonSchema
) => number;

export const isControl = (uischema: any): uischema is ControlElement =>
  !isEmpty(uischema) &&
  uischema.scope !== undefined &&
  uischema.scope !== undefined;

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
export const schemaMatches = (
  predicate: (schema: JsonSchema) => boolean
): Tester => (uischema: UISchemaElement, schema: JsonSchema): boolean => {
  if (isEmpty(uischema) || !isControl(uischema)) {
    return false;
  }
  const schemaPath = uischema.scope;
  if (isEmpty(schemaPath)) {
    return false;
  }
  let currentDataSchema: JsonSchema = resolveSchema(schema, schemaPath);
  while (!isEmpty(currentDataSchema) && !isEmpty(currentDataSchema.$ref)) {
    currentDataSchema = resolveSchema(schema, currentDataSchema.$ref);
  }
  if (currentDataSchema === undefined) {
    return false;
  }

  return predicate(currentDataSchema);
};

export const schemaSubPathMatches = (
  subPath: string,
  predicate: (schema: JsonSchema) => boolean
): Tester => (uischema: UISchemaElement, schema: JsonSchema): boolean => {
  if (isEmpty(uischema) || !isControl(uischema)) {
    return false;
  }
  const schemaPath = uischema.scope;
  if (isEmpty(schemaPath)) {
    return false;
  }
  let currentDataSchema: JsonSchema = resolveSchema(schema, `${schemaPath}`);
  while (!isEmpty(currentDataSchema.$ref)) {
    currentDataSchema = resolveSchema(schema, currentDataSchema.$ref);
  }
  currentDataSchema = get(currentDataSchema, subPath);

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
export const schemaTypeIs = (expectedType: string): Tester =>
  schemaMatches(schema => !isEmpty(schema) && schema.type === expectedType);

/**
 * Only applicable for Controls.
 *
 * This function checks whether the given UI schema is of type Control
 * and if so, resolves the sub-schema referenced by the control and checks
 * whether the format of the sub-schema matches the expected one.
 *
 * @param {string} expectedFormat the expected format of the resolved sub-schema
 */
export const formatIs = (expectedFormat: string): Tester =>
  schemaMatches(
    schema =>
      !isEmpty(schema) &&
      schema.format === expectedFormat &&
      schema.type === 'string'
  );

/**
 * Checks whether the given UI schema has the expected type.
 *
 * @param {string} expected the expected UI schema type
 */
export const uiTypeIs = (expected: string): Tester => (
  uischema: UISchemaElement
): boolean => !isEmpty(uischema) && uischema.type === expected;

/**
 * Checks whether the given UI schema has an option with the given
 * name and whether it has the expected value. If no options property
 * is set, returns false.
 *
 * @param {string} optionName the name of the option to check
 * @param {any} optionValue the expected value of the option
 */
export const optionIs = (optionName: string, optionValue: any): Tester => (
  uischema: UISchemaElement
): boolean => {
  const options = uischema.options;

  return !isEmpty(options) && options[optionName] === optionValue;
};

/**
 * Only applicable for Controls.
 *
 * Checks whether the scope of a control ends with the expected string.
 *
 * @param {string} expected the expected ending of the reference
 */
export const scopeEndsWith = (expected: string): Tester => (
  uischema: UISchemaElement
): boolean => {
  if (isEmpty(expected) || !isControl(uischema)) {
    return false;
  }

  return endsWith(uischema.scope, expected);
};

/**
 * Only applicable for Controls.
 *
 * Checks whether the last segment of the scope matches the expected string.
 *
 * @param {string} expected the expected ending of the reference
 */
export const scopeEndIs = (expected: string): Tester => (
  uischema: UISchemaElement
): boolean => {
  if (isEmpty(expected) || !isControl(uischema)) {
    return false;
  }
  const schemaPath = uischema.scope;

  return !isEmpty(schemaPath) && last(schemaPath.split('/')) === expected;
};

/**
 * A tester that allow composing other testers by && them.
 *
 * @param {Array<Tester>} testers the testers to be composed
 */
export const and = (...testers: Tester[]): Tester => (
  uischema: UISchemaElement,
  schema: JsonSchema
) => testers.reduce((acc, tester) => acc && tester(uischema, schema), true);

/**
 * A tester that allow composing other testers by || them.
 *
 * @param {Array<Tester>} testers the testers to be composed
 */
export const or = (...testers: Tester[]): Tester => (
  uischema: UISchemaElement,
  schema: JsonSchema
) => testers.reduce((acc, tester) => acc || tester(uischema, schema), false);
/**
 * Create a ranked tester that will associate a number with a given tester, if the
 * latter returns true.
 *
 * @param {number} rank the rank to be returned in case the tester returns true
 * @param {Tester} tester a tester
 */
export const rankWith = (rank: number, tester: Tester) => (
  uischema: UISchemaElement,
  schema: JsonSchema
): number => {
  if (tester(uischema, schema)) {
    return rank;
  }

  return NOT_APPLICABLE;
};

export const withIncreasedRank = (by: number, rankedTester: RankedTester) => (
  uischema: UISchemaElement,
  schema: JsonSchema
): number => {
  const rank = rankedTester(uischema, schema);
  if (rank === NOT_APPLICABLE) {
    return NOT_APPLICABLE;
  }

  return rank + by;
};

/**
 * Default tester for boolean.
 * @type {RankedTester}
 */
export const isBooleanControl = and(
  uiTypeIs('Control'),
  schemaTypeIs('boolean')
);

// TODO: rather check for properties property
export const isObjectControl = and(uiTypeIs('Control'), schemaTypeIs('object'));

export const isAllOfControl = and(
  uiTypeIs('Control'),
  schemaMatches(schema => schema.hasOwnProperty('allOf'))
);

export const isAnyOfControl = and(
  uiTypeIs('Control'),
  schemaMatches(schema => schema.hasOwnProperty('anyOf'))
);

export const isOneOfControl = and(
  uiTypeIs('Control'),
  schemaMatches(schema => schema.hasOwnProperty('oneOf'))
);

/**
 * Tests whether the given UI schema is of type Control and if the schema
 * has a 'date' format.
 * @type {Tester}
 */
export const isDateControl = and(uiTypeIs('Control'), formatIs('date'));

/**
 * Tests whether the given UI schema is of type Control and if the schema
 * has an enum.
 * @type {Tester}
 */
export const isEnumControl = and(
  uiTypeIs('Control'),
  schemaMatches(schema => schema.hasOwnProperty('enum'))
);

/**
 * Tests whether the given UI schema is of type Control and if the schema
 * is of type integer
 * @type {Tester}
 */
export const isIntegerControl = and(
  uiTypeIs('Control'),
  schemaTypeIs('integer')
);

/**
 * Tests whether the given UI schema is of type Control and if the schema
 * is of type number
 * @type {Tester}
 */
export const isNumberControl = and(uiTypeIs('Control'), schemaTypeIs('number'));

/**
 * Tests whether the given UI schema is of type Control and if the schema
 * is of type string
 * @type {Tester}
 */
export const isStringControl = and(uiTypeIs('Control'), schemaTypeIs('string'));

/**
 * Tests whether the given UI schema is of type Control and if is has
 * a 'multi' option.
 * @type {Tester}
 */
export const isMultiLineControl = and(
  uiTypeIs('Control'),
  optionIs('multi', true)
);

/**
 * Tests whether the given UI schema is of type Control and if the schema
 * has a 'time' format.
 * @type {Tester}
 */
export const isTimeControl = and(uiTypeIs('Control'), formatIs('time'));

/**
 * Tests whether the given UI schema is of type Control and if the schema
 * has a 'date-time' format.
 * @type {Tester}
 */
export const isDateTimeControl = and(
  uiTypeIs('Control'),
  formatIs('date-time')
);

/**
 * Tests whether the given UI schema is of type Control and if the schema
 * is an array of objects.
 * @type {Tester}
 */
export const isObjectArrayControl = and(
  uiTypeIs('Control'),
  schemaMatches(
    schema =>
      !isEmpty(schema) &&
      schema.type === 'array' &&
      !isEmpty(schema.items) &&
      !Array.isArray(schema.items) // we don't care about tuples
  ),
  schemaSubPathMatches('items', schema => schema.type === 'object')
);

const traverse = (
  any: JsonSchema | JsonSchema[],
  pred: (obj: JsonSchema) => boolean
): boolean => {
  if (isArray(any)) {
    return reduce(any, (acc, el) => acc || traverse(el, pred), false);
  }

  if (pred(any)) {
    return true;
  }
  if (any.items) {
    return traverse(any.items, pred);
  }
  if (any.properties) {
    return reduce(
      toPairs(any.properties),
      (acc, [_key, val]) => acc || traverse(val, pred),
      false
    );
  }

  return false;
};

export const isObjectArrayWithNesting = (
  uischema: UISchemaElement,
  schema: JsonSchema
): boolean => {
  if (!uiTypeIs('Control')(uischema, schema)) {
    return false;
  }
  const schemaPath = (uischema as ControlElement).scope;
  const resolvedSchema = resolveSchema(schema, schemaPath);
  const wantedNestingByType: { [key: string]: number } = {
    object: 2,
    array: 1
  };
  if (has(resolvedSchema, 'items')) {
    // check if nested arrays
    if (
      traverse(resolvedSchema.items, val => {
        if (val === schema) {
          return false;
        }
        // we don't support multiple types
        if (typeof val.type !== 'string') {
          return true;
        }
        const typeCount = wantedNestingByType[val.type];
        if (typeCount === undefined) {
          return false;
        }
        wantedNestingByType[val.type] = typeCount - 1;
        if (wantedNestingByType[val.type] === 0) {
          return true;
        }
        return false;
      })
    ) {
      return true;
    }
    // check if uischema options detail is set
    if (uischema.options && uischema.options.detail) {
      if (typeof uischema.options.detail === 'string') {
        return uischema.options.detail.toUpperCase() !== 'DEFAULT';
      } else if (
        typeof uischema.options.detail === 'object' &&
        uischema.options.detail.type
      ) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Synonym for isObjectArrayControl
 */
export const isArrayObjectControl = isObjectArrayControl;

/**
 * Tests whether the given UI schema is of type Control and if the schema
 * is an array of a primitive type.
 * @type {Tester}
 */
export const isPrimitiveArrayControl = and(
  uiTypeIs('Control'),
  schemaMatches(
    schema =>
      !isEmpty(schema) &&
      schema.type === 'array' &&
      !isEmpty(schema.items) &&
      !Array.isArray(schema.items) // we don't care about tuples
  ),
  schemaSubPathMatches('items', schema =>
    includes(['integer', 'number', 'boolean', 'string'], schema.type)
  )
);

/**
 * Tests whether a given UI schema is of type Control,
 * if the schema is of type number or integer and
 * whether the schema defines a numerical range with a default value.
 * @type {Tester}
 */
export const isRangeControl = and(
  uiTypeIs('Control'),
  or(schemaTypeIs('number'), schemaTypeIs('integer')),
  schemaMatches(
    schema =>
      schema.hasOwnProperty('maximum') &&
      schema.hasOwnProperty('minimum') &&
      schema.hasOwnProperty('default')
  ),
  optionIs('slider', true)
);

/**
 * Tests whether the given UI schema is of type Control, if the schema
 * is of type string and has option format
 * @type {Tester}
 */
export const isNumberFormatControl = and(
  uiTypeIs('Control'),
  schemaTypeIs('integer'),
  optionIs('format', true)
);

export const isCategorization = (
  category: UISchemaElement
): category is Categorization => category.type === 'Categorization';

export const isCategory = (uischema: UISchemaElement): boolean =>
  uischema.type === 'Category';

export const hasCategory = (categorization: Categorization): boolean => {
  if (isEmpty(categorization.elements)) {
    return false;
  }
  // all children of the categorization have to be categories
  return categorization.elements
    .map(elem =>
      isCategorization(elem) ? hasCategory(elem) : isCategory(elem)
    )
    .reduce((prev, curr) => prev && curr, true);
};

export const categorizationHasCategory = (uischema: UISchemaElement) =>
  hasCategory(uischema as Categorization);
