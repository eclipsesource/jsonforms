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
import { JsonSchema, JsonSchema7 } from '../models';
import { decode } from './path';

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
  rootSchema: JsonSchema
): JsonSchema => {
  const segments = schemaPath?.split('/').map(decode);
  return resolveSchemaWithSegments(schema, segments, rootSchema);
};

const resolveSchemaWithSegments = (
  schema: JsonSchema,
  pathSegments: string[],
  rootSchema: JsonSchema
): JsonSchema => {
  if (isEmpty(schema)) {
    return undefined;
  }

  if (schema.$ref) {
    schema = resolveSchema(rootSchema, schema.$ref, rootSchema);
  }

  if (!pathSegments || pathSegments.length === 0) {
    return schema;
  }

  const [segment, ...remainingSegments] = pathSegments;

  if (invalidSegment(segment)) {
    return resolveSchemaWithSegments(schema, remainingSegments, rootSchema);
  }

  const singleSegmentResolveSchema = get(schema, segment);

  const resolvedSchema = resolveSchemaWithSegments(singleSegmentResolveSchema, remainingSegments, rootSchema);
  if (resolvedSchema) {
    return resolvedSchema;
  }

  if (segment === 'properties' || segment === 'items') {
    // Let's try to resolve the path, assuming oneOf/allOf/anyOf/then/else was omitted.
    // We only do this when traversing an object or array as we want to avoid
    // following a property which is named oneOf, allOf, anyOf, then or else.
    let alternativeResolveResult = undefined;

    const subSchemas = [].concat(
      schema.oneOf ?? [],
      schema.allOf ?? [],
      schema.anyOf ?? [],
      (schema as JsonSchema7).then ?? [],
      (schema as JsonSchema7).else ?? []
    );

    for (const subSchema of subSchemas) {
      alternativeResolveResult = resolveSchemaWithSegments(
        subSchema,
        [segment, ...remainingSegments],
        rootSchema
      );
      if (alternativeResolveResult) {
        break;
      }
    }
    return alternativeResolveResult;
  }

  return undefined;
}