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
import get from 'lodash/get';
import { JsonSchema } from '../models';

/**
 * Map for storing refs and the respective schemas they are pointing to.
 */
export interface ReferenceSchemaMap {
  [ref: string]: JsonSchema;
}

const isObjectSchema = (schema: JsonSchema): boolean => {
  return schema.properties !== undefined;
};
const isArraySchema = (schema: JsonSchema): boolean => {
  return schema.type === 'array' && schema.items !== undefined;
};

export const resolveData = (instance: any, dataPath: string): any => {
  if (isEmpty(dataPath)) {
    return instance;
  }
  const dataPathSegments = dataPath.split('.');

  return dataPathSegments
    .map(segment => decodeURIComponent(segment))
    .reduce((curInstance, decodedSegment) => {
      if (!curInstance || !curInstance.hasOwnProperty(decodedSegment)) {
        return undefined;
      }

      return curInstance[decodedSegment];
    }, instance);
};

/**
 * Finds all references inside the given schema.
 *
 * @param schema The {@link JsonSchema} to find the references in
 * @param result The initial result map, default: empty map (this parameter is used for recursion
 *               inside the function)
 * @param resolveTuples Whether arrays of tuples should be considered; default: false
 */
export const findAllRefs = (
  schema: JsonSchema,
  result: ReferenceSchemaMap = {},
  resolveTuples = false
): ReferenceSchemaMap => {
  if (isObjectSchema(schema)) {
    Object.keys(schema.properties).forEach(key =>
      findAllRefs(schema.properties[key], result)
    );
  }
  if (isArraySchema(schema)) {
    if (Array.isArray(schema.items)) {
      if (resolveTuples) {
        const items: JsonSchema[] = schema.items;
        items.forEach(child => findAllRefs(child, result));
      }
    } else {
      findAllRefs(schema.items, result);
    }
  }
  if (Array.isArray(schema.anyOf)) {
    const anyOf: JsonSchema[] = schema.anyOf;
    anyOf.forEach(child => findAllRefs(child, result));
  }
  if (schema.$ref !== undefined) {
    result[schema.$ref] = schema;
  }

  return result;
};

const invalidSegment = (pathSegment: string) =>
  pathSegment === '#' || pathSegment === undefined || pathSegment === '';

/**
 * Resolve the given schema path in order to obtain a subschema.
 * @param {JsonSchema} schema the root schema from which to start
 * @param {string} schemaPath the schema path to be resolved
 * @param {JsonSchema} rootSchema the actual root schema
 * @returns {JsonSchema} the resolved sub-schema
 */
export const resolveSchema = (
  schema: JsonSchema,
  schemaPath: string,
  rootSchema?: JsonSchema
): JsonSchema => {
  if (isEmpty(schema)) {
    return undefined;
  }
  const validPathSegments = schemaPath.split('/');
  let resultSchema = schema;
  for (let i = 0; i < validPathSegments.length; i++) {
    let pathSegment = validPathSegments[i];
    resultSchema =
      resultSchema === undefined || resultSchema.$ref === undefined
        ? resultSchema
        : resolveSchema(schema, resultSchema.$ref);
    if (invalidSegment(pathSegment)) {
      // skip invalid segments
      continue;
    }
    let curSchema = get(resultSchema, pathSegment);
    if (!curSchema) {
      // resolving was not successful, check whether the scope omitted an oneOf, allOf or anyOf and resolve anyway
      const schemas = [].concat(
        resultSchema?.oneOf ?? [],
        resultSchema?.allOf ?? [],
        resultSchema?.anyOf ?? []
      );
      for (let item of schemas) {
        curSchema = resolveSchema(item, validPathSegments.slice(i).join('/'));
        if (curSchema) {
          break;
        }
      }
      if (curSchema) {
        // already resolved rest of the path
        resultSchema = curSchema;
        break;
      }
    }
    resultSchema = curSchema;
  }
  // TODO: because schema is already scoped we might end up with refs pointing
  // outside of the current schema. It would be better if we'd always could deal
  // with absolute paths here, so that we don't need to keep two different
  // schemas around
  if (resultSchema !== undefined && resultSchema.$ref !== undefined) {
    try {
      return retrieveResolvableSchema(schema, resultSchema.$ref);
    } catch (e) {
      return retrieveResolvableSchema(rootSchema, resultSchema.$ref);
    }
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
function retrieveResolvableSchema(
  full: JsonSchema,
  reference: string
): JsonSchema {
  // tslint:enable:only-arrow-functions
  const child = resolveSchema(full, reference);
  const allRefs = findAllRefs(child);
  const innerSelfReference = allRefs[reference];
  if (innerSelfReference !== undefined) {
    innerSelfReference.$ref = '#';
  }

  return child;
}
