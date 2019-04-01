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
import head from 'lodash/head';
import find from 'lodash/find';
import { JsonSchema, Scopable, UISchemaElement } from '../';
import { resolveData, resolveSchema } from './resolvers';
import {
  compose as composePaths,
  composeWithUi,
  toDataPath,
  toDataPathSegments
} from './path';
import { isEnabled, isVisible } from './runtime';

export { createCleanLabel, createLabelDescriptionFrom } from './label';

/**
 * Escape the given string such that it can be used as a class name,
 * i.e. hashes and slashes will be replaced.
 *
 * @param {string} s the string that should be converted to a valid class name
 * @returns {string} the escaped string
 */
export const convertToValidClassName = (s: string): string =>
  s.replace('#', 'root').replace(new RegExp('/', 'g'), '_');

export const formatErrorMessage = (errors: string[]) => {
  if (errors === undefined || errors === null) {
    return '';
  }

  return errors.join('\n');
};

/**
 * Checks if the type of jsonSchema is a union of multiple types
 *
 * @param {JsonSchema} jsonSchema
 * @returns {boolean}
 */
const isUnionType = (jsonSchema: JsonSchema): boolean =>
  !isEmpty(jsonSchema) && !isEmpty(jsonSchema.type) && isArray(jsonSchema.type);

/**
 * Derives the type of the jsonSchema element
 */
const deriveType = (jsonSchema: JsonSchema): string => {
  if (
    !isEmpty(jsonSchema) &&
    !isEmpty(jsonSchema.type) &&
    typeof jsonSchema.type === 'string'
  ) {
    return jsonSchema.type;
  }
  if (isUnionType(jsonSchema)) {
    return head(jsonSchema.type);
  }
  if (
    !isEmpty(jsonSchema) &&
    (!isEmpty(jsonSchema.properties) ||
      !isEmpty(jsonSchema.additionalProperties))
  ) {
    return 'object';
  }
  if (!isEmpty(jsonSchema) && !isEmpty(jsonSchema.items)) {
    return 'array';
  }

  if (!isEmpty(jsonSchema) && !isEmpty(jsonSchema.allOf)) {
    const allOfType = find(
      jsonSchema.allOf,
      (schema: JsonSchema) => deriveType(schema) !== 'null'
    );

    if (allOfType) {
      return deriveType(allOfType);
    }
  }
  // ignore all remaining cases
  return 'null';
};

/**
 * Convenience wrapper around resolveData and resolveSchema.
 */
const Resolve: {
  schema(
    schema: JsonSchema,
    schemaPath: string,
    rootSchema?: JsonSchema
  ): JsonSchema;
  data(data: any, path: string): any;
} = {
  schema: resolveSchema,
  data: resolveData
};
export { resolveData, resolveSchema, findRefs } from './resolvers';
export { Resolve };

// Paths --
const fromScopable = (scopable: Scopable) =>
  toDataPathSegments(scopable.scope).join('.');

const Paths = {
  compose: composePaths,
  fromScopable
};
export { composePaths, composeWithUi, Paths, toDataPath };

// Runtime --
const Runtime = {
  isEnabled(uischema: UISchemaElement, data: any): boolean {
    return isEnabled(uischema, data);
  },
  isVisible(uischema: UISchemaElement, data: any): boolean {
    return isVisible(uischema, data);
  }
};
export { isEnabled, isVisible, Runtime, deriveType };

export * from './renderer';
export * from './field';
export * from './runtime';
export * from './Formatted';
export * from './ids';
export * from './validator';
