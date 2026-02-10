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
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import any from 'lodash/fp/any';
import all from 'lodash/fp/all';
import type { JsonSchema, JsonSchema7 } from '../models';
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

  return dataPathSegments.reduce((curInstance, decodedSegment) => {
    if (
      !curInstance ||
      !Object.prototype.hasOwnProperty.call(curInstance, decodedSegment)
    ) {
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
    Object.keys(schema.properties).forEach((key) =>
      findAllRefs(schema.properties[key], result)
    );
  }
  if (isArraySchema(schema)) {
    if (Array.isArray(schema.items)) {
      if (resolveTuples) {
        const items: JsonSchema[] = schema.items;
        items.forEach((child) => findAllRefs(child, result));
      }
    } else {
      findAllRefs(schema.items, result);
    }
  }
  if (Array.isArray(schema.anyOf)) {
    const anyOf: JsonSchema[] = schema.anyOf;
    anyOf.forEach((child) => findAllRefs(child, result));
  }
  if (schema.$ref !== undefined) {
    result[schema.$ref] = schema;
  }

  return result;
};

const invalidSegment = (pathSegment: string) =>
  pathSegment === '#' || pathSegment === undefined || pathSegment === '';

const checkDataCondition = (
  propertyCondition: unknown,
  property: string,
  data: Record<string, unknown>
) => {
  if (has(propertyCondition, 'const')) {
    return (
      has(data, property) &&
      isEqual(data[property], get(propertyCondition, 'const'))
    );
  } else if (has(propertyCondition, 'enum')) {
    return (
      has(data, property) &&
      (get(propertyCondition, 'enum') as unknown[]).find((value) =>
        isEqual(value, data[property])
      ) !== undefined
    );
  } else if (has(propertyCondition, 'pattern')) {
    const pattern = new RegExp(get(propertyCondition, 'pattern'));

    return (
      has(data, property) &&
      typeof data[property] === 'string' &&
      pattern.test(data[property] as string)
    );
  }
  if (typeof propertyCondition === 'object' && propertyCondition !== null) {
    return evaluateCondition(
      propertyCondition as JsonSchema,
      data[property] as Record<string, unknown>
    );
  }

  return false;
};

const checkPropertyCondition = (
  propertiesCondition: Record<string, unknown>,
  property: string,
  data: Record<string, unknown>
) => {
  if (!has(propertiesCondition, property)) {
    return true;
  }

  return checkDataCondition(propertiesCondition[property], property, data);
};

const evaluateCondition = (
  schema: JsonSchema,
  data: Record<string, unknown>
): boolean => {
  if (has(schema, 'allOf')) {
    return all(
      (subschema: JsonSchema) => evaluateCondition(subschema, data),
      get(schema, 'allOf')
    );
  }

  if (has(schema, 'anyOf')) {
    return any(
      (subschema: JsonSchema) => evaluateCondition(subschema, data),
      get(schema, 'anyOf')
    );
  }

  if (has(schema, 'oneOf')) {
    const subschemas = get(schema, 'oneOf');
    let satisfied = false;

    for (const subschema of subschemas) {
      if (evaluateCondition(subschema, data)) {
        if (satisfied) return false;
        satisfied = true;
      }
    }

    return satisfied;
  }
  if (has(schema, 'contains')) {
    if (Array.isArray(data) && 'contains' in schema) {
      return (data as unknown[]).includes(schema.contains?.const);
    }
    return false;
  }

  let requiredProperties: string[] = [];
  if (has(schema, 'required')) {
    requiredProperties = get(schema, 'required');
  }

  const requiredCondition = all(
    (property) => has(data, property),
    requiredProperties
  );

  if (has(schema, 'properties')) {
    const propertiesCondition = get(schema, 'properties') as Record<
      string,
      unknown
    >;

    const valueCondition = all(
      (property) => checkPropertyCondition(propertiesCondition, property, data),
      Object.keys(propertiesCondition)
    );

    return requiredCondition && valueCondition;
  }

  return requiredCondition;
};

const findActiveAllOfBranch = (
  schema: JsonSchema,
  currentData: any
): JsonSchema | undefined => {
  if (!schema.allOf || !currentData) {
    return undefined;
  }

  for (const branch of schema.allOf) {
    if (has(branch, 'if')) {
      const ifCondition = get(branch, 'if');
      if (evaluateCondition(ifCondition, currentData)) {
        return branch;
      }
    }
  }
  return undefined;
};

/**
 * Resolve the given schema path in order to obtain a subschema.
 * @param {JsonSchema} schema the root schema from which to start
 * @param {string} schemaPath the schema path to be resolved
 * @param {JsonSchema} rootSchema the actual root schema
 * @param {any} currentData optional current form data for context-aware resolution
 * @returns {JsonSchema} the resolved sub-schema
 */
export const resolveSchema = (
  schema: JsonSchema,
  schemaPath: string,
  rootSchema: JsonSchema,
  currentData?: any
): JsonSchema => {
  const segments = schemaPath?.split('/').map(decode);
  return resolveSchemaWithSegments(schema, segments, rootSchema, currentData);
};

const resolveSchemaWithSegments = (
  schema: JsonSchema,
  pathSegments: string[],
  rootSchema: JsonSchema,
  currentData?: any
): JsonSchema => {
  if (isEmpty(schema)) {
    return undefined;
  }

  // use typeof because schema can by of any type - check singleSegmentResolveSchema below
  if (typeof schema.$ref === 'string') {
    schema = resolveSchema(rootSchema, schema.$ref, rootSchema, currentData);
  }

  if (!pathSegments || pathSegments.length === 0) {
    return schema;
  }

  const [segment, ...remainingSegments] = pathSegments;

  if (invalidSegment(segment)) {
    return resolveSchemaWithSegments(
      schema,
      remainingSegments,
      rootSchema,
      currentData
    );
  }

  const singleSegmentResolveSchema = get(schema, segment);

  const resolvedSchema = resolveSchemaWithSegments(
    singleSegmentResolveSchema,
    remainingSegments,
    rootSchema,
    currentData
  );
  if (resolvedSchema) {
    return resolvedSchema;
  }

  if (segment === 'properties' || segment === 'items') {
    // Let's try to resolve the path, assuming oneOf/allOf/anyOf/then/else was omitted.
    // We only do this when traversing an object or array as we want to avoid
    // following a property which is named oneOf, allOf, anyOf, then or else.
    let alternativeResolveResult = undefined;

    if (currentData && schema.allOf && schema.allOf.length > 0) {
      const activeBranch = findActiveAllOfBranch(schema, currentData);
      if (activeBranch) {
        alternativeResolveResult = resolveSchemaWithSegments(
          activeBranch,
          [segment, ...remainingSegments],
          rootSchema,
          currentData
        );
        if (alternativeResolveResult) {
          return alternativeResolveResult;
        }
      }
    }

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
        rootSchema,
        currentData
      );
      if (alternativeResolveResult) {
        break;
      }
    }
    return alternativeResolveResult;
  }

  return undefined;
};
