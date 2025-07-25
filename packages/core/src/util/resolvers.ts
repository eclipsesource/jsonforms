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

/**
 * Map for tracking schema resolution to prevent infinite recursion.
 * Key: schema object reference, Value: Set of paths being resolved from that schema
 */
type ResolutionTrackingMap = Map<JsonSchema, Set<string>>;
interface ResolveContext {
  rootSchema: JsonSchema;
  resolutionMap: ResolutionTrackingMap;
}

/**
 * Resolve the given schema path in order to obtain a subschema.
 * @param {JsonSchema} schema the root schema from which to start
 * @param {string} schemaPath the schema path to be resolved
 * @param {JsonSchema} rootSchema the actual root schema
 * @returns {JsonSchema} the resolved sub-schema or undefined
 */
export const resolveSchema = (
  schema: JsonSchema,
  schemaPath: string,
  rootSchema: JsonSchema
): JsonSchema | undefined => {
  const result = doResolveSchema(schema, schemaPath, {
    rootSchema,
    resolutionMap: new Map(),
  });
  return result;
};

const doResolveSchema = (
  schema: JsonSchema,
  schemaPath: string,
  ctx: ResolveContext
): JsonSchema | undefined => {
  let resolvedSchema: JsonSchema | undefined = undefined;
  // If the schema has a $ref, we resolve it first before continuing.
  if (schema && typeof schema.$ref === 'string') {
    const baseSchema = resolvePath(ctx.rootSchema, schema.$ref, ctx);
    if (baseSchema !== undefined) {
      resolvedSchema = resolvePath(baseSchema, schemaPath, ctx);
    }
  }
  // With later versions of JSON Schema, the $ref can also be used next to other properties,
  // therefore we also try to resolve the path from the schema itself, even if it has a $ref.
  if (resolvedSchema === undefined) {
    resolvedSchema = resolvePath(schema, schemaPath, ctx);
  }
  return resolvedSchema;
};

const resolvePath = (
  schema: JsonSchema,
  schemaPath: string | undefined,
  ctx: ResolveContext
): JsonSchema => {
  let visitedPaths: Set<string> | undefined = ctx.resolutionMap.get(schema);
  if (!visitedPaths) {
    visitedPaths = new Set();
    ctx.resolutionMap.set(schema, visitedPaths);
  }
  if (visitedPaths.has(schemaPath)) {
    // We were already asked to resolve this path from this schema, we must be stuck in a circular reference.
    return undefined;
  }

  visitedPaths.add(schemaPath);

  const resolvedSchema = resolvePathSegmentsWithCombinatorFallback(
    schema,
    schemaPath?.split('/').map(decode),
    ctx
  );

  visitedPaths.delete(schemaPath);

  return resolvedSchema;
};

const resolvePathSegmentsWithCombinatorFallback = (
  schema: JsonSchema,
  pathSegments: string[],
  ctx: ResolveContext
): JsonSchema | undefined => {
  if (!pathSegments || pathSegments.length === 0) {
    return schema;
  }

  if (isEmpty(schema)) {
    return undefined;
  }

  const resolvedSchema = resolvePathSegments(schema, pathSegments, ctx);
  if (resolvedSchema !== undefined) {
    return resolvedSchema;
  }

  // If the schema is not found, try combinators
  const subSchemas = [].concat(
    schema.oneOf ?? [],
    schema.allOf ?? [],
    schema.anyOf ?? [],
    (schema as JsonSchema7).then ?? [],
    (schema as JsonSchema7).else ?? []
  );

  for (const subSchema of subSchemas) {
    let resolvedSubSchema = subSchema;
    // check whether the subSchema is a $ref. If it is, resolve it first.
    if (subSchema && typeof subSchema.$ref === 'string') {
      resolvedSubSchema = doResolveSchema(ctx.rootSchema, subSchema.$ref, ctx);
    }
    const alternativeResolveResult = resolvePathSegmentsWithCombinatorFallback(
      resolvedSubSchema,
      pathSegments,
      ctx
    );
    if (alternativeResolveResult) {
      return alternativeResolveResult;
    }
  }

  return undefined;
};

const resolvePathSegments = (
  schema: JsonSchema,
  pathSegments: string[],
  ctx: ResolveContext
): JsonSchema | undefined => {
  if (!pathSegments || pathSegments.length === 0) {
    return schema;
  }

  if (isEmpty(schema)) {
    return undefined;
  }

  // perform a single step
  const singleStepResult = resolveSingleStep(schema, pathSegments);

  // Check whether resolving the next step was successful and returned a schema which has a $ref itself.
  // In this case, we need to resolve the $ref first before continuing.
  if (
    singleStepResult.schema &&
    typeof singleStepResult.schema.$ref === 'string'
  ) {
    singleStepResult.schema = doResolveSchema(
      ctx.rootSchema,
      singleStepResult.schema.$ref,
      ctx
    );
  }

  return resolvePathSegmentsWithCombinatorFallback(
    singleStepResult.schema,
    singleStepResult.remainingPathSegments,
    ctx
  );
};

interface ResolveSingleStepResult {
  schema: JsonSchema | undefined;
  remainingPathSegments: string[];
  resolvedSegment?: string;
}
/**
 * Tries to resolve the next "step" of the pathSegments.
 * Often this will be a single segment, but it might be multiples ones in case there are invalid segments.
 */
const resolveSingleStep = (
  schema: JsonSchema,
  pathSegments: string[]
): ResolveSingleStepResult => {
  if (!pathSegments || pathSegments.length === 0) {
    return { schema, remainingPathSegments: [] };
  }

  if (isEmpty(schema)) {
    return {
      schema: undefined,
      remainingPathSegments: pathSegments,
    };
  }

  const [segment, ...remainingPathSegments] = pathSegments;

  if (invalidSegment(segment)) {
    return resolveSingleStep(schema, remainingPathSegments);
  }

  const singleSegmentResolveSchema = get(schema, segment);
  return {
    schema: singleSegmentResolveSchema,
    remainingPathSegments,
    resolvedSegment: segment,
  };
};
