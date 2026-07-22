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
import { deriveTypes, hasType } from './util';

const splitPath = (path: string): string[] => path.split('.');

/**
 * Whether the segment addresses an array element, i.e. is a canonical
 * non-negative integer without leading zeros.
 */
const isIndexSegment = (segment: string): boolean =>
  /^(?:0|[1-9]\d*)$/.test(segment);

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

const assign = (container: any, segment: string, value: any): any => {
  if (segment === '__proto__') {
    // A plain assignment would overwrite the container's prototype instead
    // of creating an own property.
    Object.defineProperty(container, segment, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } else {
    container[segment] = value;
  }
  return container;
};

const cloneContainer = (data: any): any => {
  if (Array.isArray(data)) {
    return [...data];
  }
  if (typeof data === 'object' && data !== null) {
    // Not a spread because downleveled object spreads assign instead of
    // defining properties, which mishandles own "__proto__" properties.
    const clone: { [key: string]: any } = {};
    for (const key of Object.keys(data)) {
      assign(clone, key, data[key]);
    }
    return clone;
  }
  return {};
};

/**
 * Looks up the own property `segment` of `data`, ignoring inherited
 * properties like `__proto__`, mirroring the semantics of `resolveData`.
 */
const ownPropertyValue = (data: any, segment: string): any =>
  data != null && Object.prototype.hasOwnProperty.call(data, segment)
    ? data[segment]
    : undefined;

/**
 * Determines the container to create for a missing child. The schema takes
 * precedence; without any schema type information the next path segment
 * decides, mirroring the behavior of lodash's `set`.
 */
const createInitialContainer = (
  childSchema: JsonSchema | undefined,
  nextSegment: string
): any => {
  const types = childSchema ? deriveTypes(childSchema) : [];
  if (types.includes('array')) {
    return [];
  }
  if (types.length > 0) {
    return {};
  }
  return isIndexSegment(nextSegment) ? [] : {};
};

/**
 * Immutably sets `value` at the dotted `path` within `data`.
 *
 * Numeric path segments and segments containing bracket notation are treated
 * as plain object property names. The optional `rootSchema` is consulted when
 * a new intermediate container has to be created, so that arrays are still
 * created where the schema declares an array type. Without schema type
 * information, a canonical numeric follow-up segment creates an array.
 *
 * An empty `path` addresses the root, i.e. `value` itself is returned.
 */
export const setDataAt = (
  data: any,
  path: string,
  value: any,
  rootSchema?: JsonSchema
): any => {
  if (path === '') {
    return value;
  }
  return doSet(data, splitPath(path), 0, value, rootSchema, rootSchema);
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
  const container = cloneContainer(data);

  if (index === segments.length - 1) {
    return assign(container, segment, value);
  }

  const childSchema = stepSchema(currentSchema, segment, rootSchema);
  const existingChild = ownPropertyValue(data, segment);
  const child =
    existingChild !== null && typeof existingChild === 'object'
      ? existingChild
      : createInitialContainer(childSchema, segments[index + 1]);
  const nextValue = doSet(
    child,
    segments,
    index + 1,
    value,
    childSchema,
    rootSchema
  );
  return assign(container, segment, nextValue);
};

/**
 * Immutably unsets the value at the dotted `path` within `data`.
 *
 * Numeric path segments and bracket notation in segments are treated as
 * plain object property names, mirroring the semantics of {@link setDataAt}.
 * Unsetting an array element leaves a hole, i.e. the array is not compacted.
 * If there is nothing to unset at `path`, `data` is returned unchanged.
 */
export const unsetDataAt = (data: any, path: string): any => {
  if (path === '') {
    return data;
  }
  return doUnset(data, splitPath(path), 0);
};

const doUnset = (data: any, segments: string[], index: number): any => {
  if (data === null || typeof data !== 'object') {
    return data;
  }
  const segment = segments[index];
  if (index === segments.length - 1) {
    if (!Object.prototype.hasOwnProperty.call(data, segment)) {
      return data;
    }
    if (Array.isArray(data)) {
      // Non-index own properties of arrays (e.g. `length`) are not form data
      // and deleting them could throw in strict mode.
      if (!isIndexSegment(segment)) {
        return data;
      }
      const container = [...data];
      delete container[Number(segment)];
      return container;
    }
    const container = cloneContainer(data);
    delete container[segment];
    return container;
  }

  const existingChild = ownPropertyValue(data, segment);
  if (existingChild === null || typeof existingChild !== 'object') {
    return data;
  }
  const nextValue = doUnset(existingChild, segments, index + 1);
  if (nextValue === existingChild) {
    return data;
  }
  return assign(cloneContainer(data), segment, nextValue);
};
