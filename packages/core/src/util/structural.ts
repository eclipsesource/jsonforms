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
import isEqual from 'lodash/isEqual';
import type { JsonSchema } from '../models';
import { resolveSchema } from './resolvers';

/**
 * The JSON Schema keywords the Structural Matcher evaluates.
 * Combinator tab selection has always ignored every other keyword.
 */
export const structuralKeywords = [
  'required',
  'additionalProperties',
  'type',
  'enum',
  'const',
] as const;

type SchemaLike = JsonSchema & {
  nullable?: boolean;
  prefixItems?: JsonSchema[];
  if?: JsonSchema;
  then?: JsonSchema;
  else?: JsonSchema;
};

/** Schema/data pairs already being evaluated on the current path. */
type Visited = ReadonlyArray<readonly [object, unknown]>;

const isPlainObject = (data: unknown): data is Record<string, unknown> =>
  typeof data === 'object' && data !== null && !Array.isArray(data);

const matchesType = (type: string, data: unknown): boolean => {
  switch (type) {
    case 'null':
      return data === null;
    case 'boolean':
      return typeof data === 'boolean';
    case 'string':
      return typeof data === 'string';
    case 'number':
      return typeof data === 'number';
    case 'integer':
      return typeof data === 'number' && Number.isInteger(data);
    case 'array':
      return Array.isArray(data);
    case 'object':
      return isPlainObject(data);
    default:
      // Unknown type names cannot be decided structurally.
      return true;
  }
};

const compilePattern = (pattern: string): RegExp | undefined => {
  try {
    return new RegExp(pattern, 'u');
  } catch {
    return undefined;
  }
};

/**
 * Structural Matcher: decides whether `data` fits `schema` by evaluating only
 * the structural keywords `type`, `enum`, `const`, `required` and
 * `additionalProperties`, recursively through `properties`,
 * `patternProperties`, `items`, `$ref`, nested combinators and
 * `if`/`then`/`else`. It needs no validator instance and generates no code,
 * so it works under a Content Security Policy without `unsafe-eval`.
 *
 * Keywords outside that set (`format`, `pattern`, `minimum`, ...) are ignored,
 * matching what combinator tab selection has always done. A `$ref` that
 * cannot be resolved against `rootSchema` is treated as not matching.
 *
 * @param schema the schema to match against
 * @param data the data to check
 * @param rootSchema the root schema used to resolve `$ref`s; defaults to `schema`
 * @returns `true` when no structural keyword rejects the data
 */
export const isStructuralMatch = (
  schema: JsonSchema | boolean | undefined,
  data: unknown,
  rootSchema?: JsonSchema
): boolean => {
  const root = rootSchema ?? (typeof schema === 'object' ? schema : {});
  return match(schema, data, root, []);
};

const match = (
  schema: JsonSchema | boolean | undefined,
  data: unknown,
  rootSchema: JsonSchema,
  visited: Visited
): boolean => {
  if (schema === undefined || schema === null) {
    return true;
  }
  if (typeof schema === 'boolean') {
    return schema;
  }
  if (visited.some(([s, d]) => s === schema && d === data)) {
    // The same schema applied to the same data again on this path: a
    // recursive schema that cannot be decided any further structurally.
    return true;
  }
  const nextVisited: Visited = [...visited, [schema, data]];

  if (typeof schema.$ref === 'string') {
    const resolved = resolveSchema(rootSchema, schema.$ref, rootSchema);
    if (resolved === undefined) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $ref, ...siblings } = schema;
    return (
      match(resolved, data, rootSchema, nextVisited) &&
      matchKeywords(siblings, data, rootSchema, nextVisited)
    );
  }
  return matchKeywords(schema, data, rootSchema, nextVisited);
};

const matchKeywords = (
  schema: SchemaLike,
  data: unknown,
  rootSchema: JsonSchema,
  visited: Visited
): boolean => {
  const sub = (s: JsonSchema | boolean | undefined, d: unknown): boolean =>
    match(s, d, rootSchema, visited);

  if (schema.nullable === true && data === null) {
    return true;
  }
  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((type) => matchesType(type, data))) {
      return false;
    }
  }
  if (
    Array.isArray(schema.enum) &&
    !schema.enum.some((value) => isEqual(value, data))
  ) {
    return false;
  }
  if ('const' in schema && !isEqual(schema.const, data)) {
    return false;
  }
  if (Array.isArray(schema.allOf) && !schema.allOf.every((s) => sub(s, data))) {
    return false;
  }
  if (Array.isArray(schema.anyOf) && !schema.anyOf.some((s) => sub(s, data))) {
    return false;
  }
  // When several oneOf branches match, AJV reports only a `oneOf` error, which
  // tab selection ignores. "At least one branch" is therefore the structural
  // reading of oneOf.
  if (Array.isArray(schema.oneOf) && !schema.oneOf.some((s) => sub(s, data))) {
    return false;
  }
  if (schema.if !== undefined) {
    const branch = sub(schema.if, data) ? schema.then : schema.else;
    if (!sub(branch, data)) {
      return false;
    }
  }

  if (isPlainObject(data)) {
    if (
      Array.isArray(schema.required) &&
      !schema.required.every((key) => data[key] !== undefined)
    ) {
      return false;
    }
    const properties = schema.properties ?? {};
    const patterns = Object.entries(schema.patternProperties ?? {})
      .map(([pattern, s]) => ({ regex: compilePattern(pattern), schema: s }))
      .filter(
        (p): p is { regex: RegExp; schema: JsonSchema } => p.regex !== undefined
      );
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        continue;
      }
      const matchingPatterns = patterns.filter((p) => p.regex.test(key));
      const isDeclared = key in properties || matchingPatterns.length > 0;
      if (key in properties && !sub(properties[key], value)) {
        return false;
      }
      if (!matchingPatterns.every((p) => sub(p.schema, value))) {
        return false;
      }
      if (!isDeclared && schema.additionalProperties !== undefined) {
        if (schema.additionalProperties === false) {
          return false;
        }
        if (
          typeof schema.additionalProperties === 'object' &&
          !sub(schema.additionalProperties, value)
        ) {
          return false;
        }
      }
    }
  }

  if (Array.isArray(data)) {
    const tuple = Array.isArray(schema.prefixItems)
      ? schema.prefixItems
      : Array.isArray(schema.items)
      ? schema.items
      : undefined;
    if (tuple !== undefined) {
      if (!data.every((item, i) => i >= tuple.length || sub(tuple[i], item))) {
        return false;
      }
    } else if (
      typeof schema.items === 'object' &&
      !data.every((item) => sub(schema.items as JsonSchema, item))
    ) {
      return false;
    }
  }
  return true;
};
