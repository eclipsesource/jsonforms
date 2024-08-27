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

import { ErrorObject } from 'ajv';
import { decode } from './path';
import { JsonSchema } from '../models';
import { isOneOfEnumSchema } from './schema';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';

const getInvalidProperty = (error: ErrorObject): string | undefined => {
  switch (error.keyword) {
    case 'required':
    case 'dependencies':
      return error.params.missingProperty;
    case 'additionalProperties':
      return error.params.additionalProperty;
    default:
      return undefined;
  }
};

export const getControlPath = (error: ErrorObject) => {
  // Up until AJV v7 the path property was called 'dataPath'
  // With AJV v8 the property was renamed to 'instancePath'
  let controlPath = (error as any).dataPath || error.instancePath || '';

  // change '/' chars to '.'
  controlPath = controlPath.replace(/\//g, '.');

  const invalidProperty = getInvalidProperty(error);
  if (invalidProperty !== undefined && !controlPath.endsWith(invalidProperty)) {
    controlPath = `${controlPath}.${invalidProperty}`;
  }

  // remove '.' chars at the beginning of paths
  controlPath = controlPath.replace(/^./, '');

  // decode JSON Pointer escape sequences
  controlPath = decode(controlPath);
  return controlPath;
};

export const errorsAt =
  (
    instancePath: string,
    schema: JsonSchema,
    matchPath: (path: string) => boolean
  ) =>
  (errors: ErrorObject[]): ErrorObject[] => {
    // Get data paths of oneOf and anyOf errors to later determine whether an error occurred inside a subschema of oneOf or anyOf.
    const combinatorPaths = filter(
      errors,
      (error) => error.keyword === 'oneOf' || error.keyword === 'anyOf'
    ).map((error) => getControlPath(error));

    return filter(errors, (error) => {
      // Filter errors that match any keyword that we don't want to show in the UI
      // but keep the errors for oneOf enums
      if (
        filteredErrorKeywords.indexOf(error.keyword) !== -1 &&
        !isOneOfEnumSchema(error.parentSchema)
      ) {
        return false;
      }
      const controlPath = getControlPath(error);
      let result = matchPath(controlPath);
      // In anyOf and oneOf blocks with "primitive" (i.e. string, number etc.) or array subschemas,
      // we want to make sure that errors are only shown for the correct subschema.
      // Therefore, we compare the error's parent schema with the property's schema.
      // In the primitive case the error's data path is the same for all subschemas:
      // It directly points to the property defining the anyOf/oneOf.
      // The same holds true for errors on the array level (e.g. min item amount).
      // In contrast, this comparison must not be done for errors whose parent schema defines an object or a oneOf enum,
      // because the parent schema can never match the property schema (e.g. for 'required' checks).
      const parentSchema: JsonSchema | undefined = error.parentSchema;
      if (
        result &&
        !isObjectSchema(parentSchema) &&
        !isOneOfEnumSchema(parentSchema) &&
        combinatorPaths.findIndex((p) => instancePath.startsWith(p)) !== -1
      ) {
        result = result && isEqual(parentSchema, schema);
      }
      return result;
    });
  };

/**
 * @returns true if the schema describes an object.
 */
const isObjectSchema = (schema?: JsonSchema): boolean => {
  return schema?.type === 'object' || !!schema?.properties;
};

/**
 * The error-type of an AJV error is defined by its `keyword` property.
 * Certain errors are filtered because they don't fit to any rendered control.
 * All of them have in common that we don't want to show them in the UI
 * because controls will show the actual reason why they don't match their correponding sub schema.
 * - additionalProperties: Indicates that a property is present that is not defined in the schema.
 *      Jsonforms only allows to edit defined properties. These errors occur if an oneOf doesn't match.
 * - allOf: Indicates that not all of the allOf definitions match as a whole.
 * - anyOf: Indicates that an anyOf definition itself is not valid because none of its subschemas matches.
 * - oneOf: Indicates that an oneOf definition itself is not valid because not exactly one of its subschemas matches.
 */
const filteredErrorKeywords = [
  'additionalProperties',
  'allOf',
  'anyOf',
  'oneOf',
];

export const formatErrorMessage = (errors: string[]) => {
  if (errors === undefined || errors === null) {
    return '';
  }

  return errors.join('\n');
};
