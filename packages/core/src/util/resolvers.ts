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
import * as _ from 'lodash';

import { JsonSchema } from '../models/jsonSchema';

/**
 * Map for storing refs and the respective schemas they are pointing to.
 */
export interface ReferenceSchemaMap {
  [ref: string]: JsonSchema;
}

const isObject = (schema: JsonSchema): boolean => {
  return schema.properties !== undefined;
};
const isArray = (schema: JsonSchema): boolean => {
  return schema.type === 'array' && schema.items !== undefined;
};

export const resolveData = (instance: any, dataPath: string): any => {
  const dataPathSegments = dataPath.split('.');
  if (_.isEmpty(dataPath)) {
    return instance;
  }

  return dataPathSegments
    .map(segment => decodeURIComponent(segment))
    .reduce(
      (curInstance, decodedSegment) => {
        if (curInstance === undefined || !curInstance.hasOwnProperty(decodedSegment)) {
          return undefined;
        }

        return curInstance[decodedSegment];
      },
      instance
    );
};

/**
 * Finds all references inside the given schema.
 *
 * @param schema The {@link JsonSchema} to find the references in
 * @param result The initial result map, default: empty map (this parameter is used for recursion
 *               inside the function)
 * @param resolveTuples Whether arrays of tuples should be considered; default: false
 */
export const findAllRefs =
  (schema: JsonSchema, result: ReferenceSchemaMap = {}, resolveTuples = false)
    : ReferenceSchemaMap => {

    if (isObject(schema)) {
      Object.keys(schema.properties).forEach(key =>
        findAllRefs(schema.properties[key], result));
    }
    if (isArray(schema)) {
      if (Array.isArray(schema.items)) {
        if (resolveTuples) {
          schema.items.forEach(child => findAllRefs(child, result));
        }
      } else {
        findAllRefs(schema.items, result);
      }
    }
    if (Array.isArray(schema.anyOf)) {
      schema.anyOf.forEach(child => findAllRefs(child, result));
    }
    if (schema.$ref !== undefined) {
      result[schema.$ref] = schema;
    }

    // tslint:disable:no-string-literal
    if (schema['links'] !== undefined) {
      schema['links'].forEach(link => {
        if (!_.isEmpty(link.targetSchema.$ref)) {
          result[link.targetSchema.$ref] = schema;
        } else {
          findAllRefs(link.targetSchema, result);
        }
      });
    }

    return result;
  };

/**
 * Resolve the given schema path in order to obtain a subschema.
 * @param {JsonSchema} schema the root schema from which to start
 * @param {string} schemaPath the schema path to be resolved
 * @returns {JsonSchema} the resolved sub-schema
 */
export const resolveSchema = (schema: JsonSchema, schemaPath: string): JsonSchema => {
  if (_.isEmpty(schema)) {
    return undefined;
  }
  const validPathSegments = schemaPath.split('/');
  const invalidSegment =
    pathSegment => pathSegment === '#' || pathSegment === undefined || pathSegment === '';
  const resultSchema = validPathSegments.reduce(
    (curSchema, pathSegment) =>
      invalidSegment(pathSegment) ? curSchema : curSchema[pathSegment],
    schema
  );
  if (resultSchema !== undefined && resultSchema.$ref !== undefined) {
    return retrieveResolvableSchema(schema, resultSchema.$ref);
  }

  return resultSchema;
};

/**
 * Normalizes the schema and resolves the given ref.
 *
 * @param {JsonSchema} full the JSON schema to resolved the reference against
 * @param {string} reference the reference to be resolved
 * @returns {JsonSchema} the resolved sub-schema
 */
// disable rule because resolve is mutually recursive
// tslint:disable:only-arrow-functions
function retrieveResolvableSchema(full: JsonSchema, reference: string): JsonSchema {
  // tslint:enable:only-arrow-functions
  const child = resolveSchema(full, reference);
  const allRefs = findAllRefs(child);
  const innerSelfReference = allRefs[reference];
  if (innerSelfReference !== undefined) {
    innerSelfReference.$ref = '#';
  }

  return child;
}
