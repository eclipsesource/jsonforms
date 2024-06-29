/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
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
import isArray from 'lodash/isArray';
import includes from 'lodash/includes';
import find from 'lodash/find';
import { resolveData, resolveSchema } from './resolvers';
import { composePaths, toDataPathSegments } from './path';
import { isEnabled, isVisible } from './runtime';
import type Ajv from 'ajv';
import type { JsonSchema, Scoped, UISchemaElement } from '../models';

/**
 * Returns the string representation of the given date. The format of the output string can be specified:
 * - 'date' for a date-only string (YYYY-MM-DD),
 * - 'time' for a time-only string (HH:mm:ss), or
 * - 'date-time' for a full date-time string in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ).
 * If no format is specified, the full date-time ISO string is returned by default.
 *
 * @returns {string} A string representation of the date in the specified format.
 *
 * @example
 * // returns '2023-11-09'
 * convertDateToString(new Date('2023-11-09T14:22:54.131Z'), 'date');
 *
 * @example
 * // returns '14:22:54'
 * convertDateToString(new Date('2023-11-09T14:22:54.131Z'), 'time');
 *
 * @example
 * // returns '2023-11-09T14:22:54.131Z'
 * convertDateToString(new Date('2023-11-09T14:22:54.131Z'), 'date-time');
 *
 * @example
 * // returns '2023-11-09T14:22:54.131Z'
 * convertDateToString(new Date('2023-11-09T14:22:54.131Z'));
 */
export const convertDateToString = (
  date: Date,
  format?: 'date' | 'time' | 'date-time'
): string => {
  //e.g. '2023-11-09T14:22:54.131Z'
  const dateString = date.toISOString();
  if (format === 'date-time') {
    return dateString;
  } else if (format === 'date') {
    // e.g. '2023-11-09'
    return dateString.split('T')[0];
  } else if (format === 'time') {
    //e.g. '14:22:54'
    return dateString.split('T')[1].split('.')[0];
  }
  return dateString;
};

/**
 * Escape the given string such that it can be used as a class name,
 * i.e. hashes and slashes will be replaced.
 *
 * @param {string} s the string that should be converted to a valid class name
 * @returns {string} the escaped string
 */
export const convertToValidClassName = (s: string): string =>
  s.replace('#', 'root').replace(new RegExp('/', 'g'), '_');

export const hasType = (jsonSchema: JsonSchema, expected: string): boolean => {
  return includes(deriveTypes(jsonSchema), expected);
};

/**
 * Derives the type of the jsonSchema element
 */
export const deriveTypes = (jsonSchema: JsonSchema): string[] => {
  if (isEmpty(jsonSchema)) {
    return [];
  }
  if (!isEmpty(jsonSchema.type) && typeof jsonSchema.type === 'string') {
    return [jsonSchema.type];
  }
  if (isArray(jsonSchema.type)) {
    return jsonSchema.type;
  }
  if (
    !isEmpty(jsonSchema.properties) ||
    !isEmpty(jsonSchema.additionalProperties)
  ) {
    return ['object'];
  }
  if (!isEmpty(jsonSchema.items)) {
    return ['array'];
  }
  if (!isEmpty(jsonSchema.enum)) {
    const types: Set<string> = new Set();
    jsonSchema.enum.forEach((enumElement) => {
      if (typeof enumElement === 'string') {
        types.add('string');
      } else {
        deriveTypes(enumElement).forEach((type) => types.add(type));
      }
    });
    return Array.from(types);
  }
  if (!isEmpty(jsonSchema.allOf)) {
    const allOfType = find(
      jsonSchema.allOf,
      (schema: JsonSchema) => deriveTypes(schema).length !== 0
    );

    if (allOfType) {
      return deriveTypes(allOfType);
    }
  }
  // ignore all remaining cases
  return [];
};

/**
 * Convenience wrapper around resolveData and resolveSchema.
 */
export const Resolve: {
  schema(
    schema: JsonSchema,
    schemaPath: string,
    rootSchema: JsonSchema
  ): JsonSchema;
  data(data: any, path: string): any;
} = {
  schema: resolveSchema,
  data: resolveData,
};

// Paths --
const fromScoped = (scopable: Scoped): string =>
  toDataPathSegments(scopable.scope).join('.');

export const Paths = {
  compose: composePaths,
  fromScoped,
};

// Runtime --
export const Runtime = {
  isEnabled(uischema: UISchemaElement, data: any, ajv: Ajv): boolean {
    return isEnabled(uischema, data, undefined, ajv);
  },
  isVisible(uischema: UISchemaElement, data: any, ajv: Ajv): boolean {
    return isVisible(uischema, data, undefined, ajv);
  },
};
