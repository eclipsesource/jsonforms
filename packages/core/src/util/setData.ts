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

import type { JsonSchema } from '../models';
import { encode } from './path';
import { resolveSchema } from './resolvers';
import { hasType } from './util';

const splitPath = (path: string): string[] => path.split('.');

/**
 * Walks one step in the schema along the given data path segment, so we can
 * tell whether a missing intermediate container should be created as an
 * array or as an object.
 */
const stepSchema = (
  schema: JsonSchema | undefined,
  segment: string,
  rootSchema: JsonSchema | undefined
): JsonSchema | undefined => {
  if (!schema || !rootSchema) {
    return undefined;
  }
  const pointer = hasType(schema, 'array')
    ? Array.isArray(schema.items)
      ? `/items/${segment}`
      : '/items'
    : `/properties/${encode(segment)}`;
  return resolveSchema(schema, pointer, rootSchema);
};

const cloneContainer = (data: any): any => {
  if (Array.isArray(data)) {
    return [...data];
  }
  return { ...(data ?? {}) };
};

const assign = (container: any, segment: string, value: any): any => {
  if (Array.isArray(container)) {
    const index = Number(segment);
    container[Number.isInteger(index) ? index : (segment as any)] = value;
  } else {
    container[segment] = value;
  }
  return container;
};

/**
 * Immutably sets `value` at the dotted `path` within `data`.
 *
 * Numeric path segments and segments containing bracket notation are treated
 * as plain object property names. The optional `rootSchema` is consulted when
 * a new intermediate container has to be created, so that arrays are still
 * created where the schema declares an array type.
 */
export const setDataAt = (
  data: any,
  path: string,
  value: any,
  rootSchema?: JsonSchema
): any => {
  const segments = splitPath(path);
  if (segments.length === 0) {
    return value;
  }
  return doSet(data, segments, 0, value, rootSchema, rootSchema);
};

const doSet = (
  data: any,
  segments: string[],
  index: number,
  value: any,
  currentSchema: JsonSchema | undefined,
  rootSchema: JsonSchema | undefined
): any => {
  const segment = segments[index];
  const childSchema = stepSchema(currentSchema, segment, rootSchema);
  const container = cloneContainer(data);

  if (index === segments.length - 1) {
    return assign(container, segment, value);
  }

  const existingChild = data?.[segment];
  let nextValue;
  if (
    existingChild !== undefined &&
    existingChild !== null &&
    typeof existingChild === 'object'
  ) {
    nextValue = doSet(
      existingChild,
      segments,
      index + 1,
      value,
      childSchema,
      rootSchema
    );
  } else {
    const initial = hasType(childSchema, 'array') ? [] : {};
    nextValue = doSet(
      initial,
      segments,
      index + 1,
      value,
      childSchema,
      rootSchema
    );
  }
  return assign(container, segment, nextValue);
};

/**
 * Immutably unsets the value at the dotted `path` within `data`.
 *
 * Numeric path segments and bracket notation in segments are treated as
 * plain object property names, mirroring the semantics of {@link setDataAt}.
 */
export const unsetDataAt = (data: any, path: string): any => {
  const segments = splitPath(path);
  if (segments.length === 0) {
    return data;
  }
  return doUnset(data, segments, 0);
};

const doUnset = (data: any, segments: string[], index: number): any => {
  if (data === undefined || data === null) {
    return data;
  }
  const segment = segments[index];
  if (index === segments.length - 1) {
    if (Array.isArray(data)) {
      const container = [...data];
      const numericIndex = Number(segment);
      if (Number.isInteger(numericIndex)) {
        delete container[numericIndex];
      }
      return container;
    }
    if (!Object.prototype.hasOwnProperty.call(data, segment)) {
      return data;
    }
    const container: { [key: string]: any } = { ...data };
    delete container[segment];
    return container;
  }

  const existingChild = data[segment];
  if (
    existingChild === undefined ||
    existingChild === null ||
    typeof existingChild !== 'object'
  ) {
    return data;
  }
  const nextValue = doUnset(existingChild, segments, index + 1);
  if (nextValue === existingChild) {
    return data;
  }
  const container = cloneContainer(data);
  return assign(container, segment, nextValue);
};
