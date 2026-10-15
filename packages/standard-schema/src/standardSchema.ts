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
import type {
  StandardJSONSchemaV1,
  StandardSchemaV1,
} from '@standard-schema/spec';
import type {
  FormValidator,
  JsonSchema,
  ValidationIssue,
} from '@jsonforms/core';

/** JSON Schema dialect a Standard JSON Schema converter can produce. */
export type JsonSchemaTarget = StandardJSONSchemaV1.Options['target'];

/**
 * Decides which JSON Schema keyword a library issue stands for. Return
 * `undefined` to fall back to the built-in mapping.
 */
export type IssueKeyMapper = (
  issue: StandardSchemaV1.Issue,
  vendor: string
) => string | undefined;

export interface StandardSchemaFormOptions {
  /**
   * JSON Schema dialect to derive. Defaults to `draft-07`, the dialect JSON
   * Forms' default validator understands.
   */
  target?: JsonSchemaTarget;
  /**
   * Whether the JSON Schema describes the schema's input type (what the user
   * enters) or its output type (after transformations). Defaults to `input`.
   */
  io?: 'input' | 'output';
  /**
   * Where the JSON Schema comes from when the validating schema itself does not
   * implement Standard JSON Schema: a Standard JSON Schema object (for
   * Valibot: `toStandardJsonSchema(schema)` from `@valibot/to-json-schema`),
   * or a ready JSON Schema.
   */
  jsonSchema?: StandardJSONSchemaV1 | JsonSchema;
  /** Overrides the mapping from library issues to JSON Schema keywords. */
  keyFor?: IssueKeyMapper;
}

export interface StandardSchemaForm {
  /** The JSON Schema JSON Forms renders the form from. */
  jsonSchema: JsonSchema;
  /**
   * The Form Validator validating with the library; pass it as JSON Forms'
   * `validator`. It is bound to the given schema, so derive a new one when the
   * schema changes.
   */
  validator: FormValidator;
}

const isStandardJsonSchema = (
  candidate: unknown
): candidate is StandardJSONSchemaV1 =>
  typeof candidate === 'object' &&
  candidate !== null &&
  typeof (candidate as StandardJSONSchemaV1)['~standard']?.jsonSchema?.input ===
    'function';

const vendorOf = (schema: StandardSchemaV1): string =>
  schema['~standard'].vendor ?? 'unknown';

/**
 * Derives the JSON Schema JSON Forms renders from, through Standard JSON
 * Schema: from `options.jsonSchema` when given, otherwise from the schema
 * itself (Zod 4.2+, ArkType 2.1.28+ implement it directly; Valibot needs
 * `toStandardJsonSchema(schema)` passed as `options.jsonSchema`).
 */
export const deriveJsonSchema = (
  schema: StandardSchemaV1,
  options: StandardSchemaFormOptions = {}
): JsonSchema => {
  const source = options.jsonSchema ?? schema;
  if (isStandardJsonSchema(source)) {
    const converter = source['~standard'].jsonSchema;
    const convert =
      options.io === 'output' ? converter.output : converter.input;
    return convert({ target: options.target ?? 'draft-07' }) as JsonSchema;
  }
  if (options.jsonSchema !== undefined) {
    return options.jsonSchema as JsonSchema;
  }
  throw new Error(
    `The ${vendorOf(schema)} schema does not implement Standard JSON Schema. ` +
      'Pass options.jsonSchema: a Standard JSON Schema object ' +
      '(for Valibot: toStandardJsonSchema(schema)) or a JSON Schema.'
  );
};

const encodeSegment = (segment: string): string =>
  segment.replace(/~/g, '~0').replace(/\//g, '~1');

/** Turns a Standard Schema issue path into a JSON Pointer. */
export const pathToPointer = (path: StandardSchemaV1.Issue['path']): string =>
  (path ?? [])
    .map((segment) => {
      const key =
        typeof segment === 'object' && segment !== null && 'key' in segment
          ? segment.key
          : segment;
      return '/' + encodeSegment(String(key));
    })
    .join('');

type LibraryIssue = StandardSchemaV1.Issue & {
  // Valibot
  kind?: string;
  type?: string;
  received?: unknown;
  // Zod
  code?: string;
  origin?: string;
  format?: string;
  input?: unknown;
};

const valibotKeys: Record<string, string> = {
  min_length: 'minLength',
  max_length: 'maxLength',
  length: 'minLength',
  non_empty: 'minLength',
  min_value: 'minimum',
  max_value: 'maximum',
  gt_value: 'exclusiveMinimum',
  lt_value: 'exclusiveMaximum',
  multiple_of: 'multipleOf',
  regex: 'pattern',
  min_entries: 'minProperties',
  max_entries: 'maxProperties',
  picklist: 'enum',
  enum: 'enum',
  literal: 'const',
  strict_object: 'additionalProperties',
};

const valibotFormats = new Set([
  'email',
  'url',
  'uuid',
  'ipv4',
  'ipv6',
  'ip',
  'iso_date',
  'iso_date_time',
  'iso_time',
  'iso_timestamp',
  'iso_week',
  'hex_color',
  'credit_card',
  'imei',
  'isbn',
  'mac',
  'emoji',
]);

const zodKeys: Record<string, string> = {
  invalid_type: 'type',
  invalid_value: 'enum',
  invalid_enum_value: 'enum',
  invalid_literal: 'const',
  invalid_union: 'anyOf',
  unrecognized_keys: 'additionalProperties',
  not_multiple_of: 'multipleOf',
  custom: 'custom',
};

const zodSizeKeys = (
  code: string,
  origin: string | undefined
): string | undefined => {
  const small = code === 'too_small';
  switch (origin) {
    case 'string':
      return small ? 'minLength' : 'maxLength';
    case 'number':
    case 'int':
    case 'bigint':
    case 'date':
      return small ? 'minimum' : 'maximum';
    case 'array':
    case 'set':
      return small ? 'minItems' : 'maxItems';
    case 'object':
    case 'map':
    case 'record':
      return small ? 'minProperties' : 'maxProperties';
    default:
      return small ? 'minimum' : 'maximum';
  }
};

const arktypeKeys: Record<string, string> = {
  missing: 'required',
  domain: 'type',
  proto: 'type',
  unit: 'const',
  pattern: 'pattern',
  min: 'minimum',
  max: 'maximum',
  minLength: 'minLength',
  maxLength: 'maxLength',
  exactLength: 'minLength',
  divisor: 'multipleOf',
  extraneous: 'additionalProperties',
  union: 'anyOf',
  predicate: 'custom',
};

/**
 * Maps a library issue to the JSON Schema keyword JSON Forms uses for error
 * translation (`error.<keyword>`). Knows Valibot, Zod and ArkType issue
 * shapes; anything else becomes `custom`. A missing property always maps to
 * `required`, with the issue path pointing at the missing property itself,
 * which JSON Forms normalizes.
 */
export const keyForIssue = (
  issue: StandardSchemaV1.Issue,
  vendor: string
): string => {
  const i = issue as LibraryIssue;
  switch (vendor) {
    case 'valibot': {
      if (i.kind === 'schema' && i.received === 'undefined') {
        return 'required';
      }
      if (i.type !== undefined) {
        if (valibotFormats.has(i.type)) {
          return 'format';
        }
        if (valibotKeys[i.type] !== undefined) {
          return valibotKeys[i.type];
        }
      }
      return i.kind === 'schema' ? 'type' : 'custom';
    }
    case 'zod': {
      if (
        i.code === 'invalid_type' &&
        (i.received === 'undefined' ||
          (i.received === undefined && i.input === undefined))
      ) {
        return 'required';
      }
      if (i.code === 'too_small' || i.code === 'too_big') {
        return zodSizeKeys(i.code, i.origin) ?? 'custom';
      }
      if (i.code === 'invalid_format' || i.code === 'invalid_string') {
        return i.format === 'regex' ? 'pattern' : 'format';
      }
      return (i.code !== undefined && zodKeys[i.code]) || 'custom';
    }
    case 'arktype': {
      return (i.code !== undefined && arktypeKeys[i.code]) || 'custom';
    }
    default:
      return 'custom';
  }
};

const isPromise = (value: unknown): value is Promise<unknown> =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Promise<unknown>).then === 'function';

/**
 * Wraps a Standard Schema as a JSON Forms Form Validator. Validation runs in
 * the library itself: no JSON Schema compilation, no code generation, so it
 * works under a Content Security Policy without `unsafe-eval`.
 *
 * Only synchronous schemas are supported, as JSON Forms 3.x validates
 * synchronously; a schema returning a Promise throws on the first validation.
 */
export const standardSchemaValidator = (
  schema: StandardSchemaV1,
  options: Pick<StandardSchemaFormOptions, 'keyFor'> = {}
): FormValidator => {
  const vendor = vendorOf(schema);
  return {
    validate: (data) => {
      const result = schema['~standard'].validate(data);
      if (isPromise(result)) {
        throw new Error(
          `The ${vendor} schema validates asynchronously. JSON Forms 3.x ` +
            'supports synchronous validation only; run asynchronous validation ' +
            'in a middleware and dispatch updateErrors.'
        );
      }
      if (!result.issues) {
        return [];
      }
      return result.issues.map(
        (issue): ValidationIssue => ({
          path: pathToPointer(issue.path),
          key: options.keyFor?.(issue, vendor) ?? keyForIssue(issue, vendor),
          message: issue.message,
          severity: 'error',
        })
      );
    },
  };
};

/**
 * Everything JSON Forms needs from a Standard Schema: the JSON Schema to
 * render the form from and the Form Validator to validate with.
 *
 * @example
 * ```ts
 * import * as v from 'valibot';
 * import { toStandardJsonSchema } from '@valibot/to-json-schema';
 *
 * const person = v.object({ name: v.pipe(v.string(), v.minLength(2)) });
 * const { jsonSchema, validator } = fromStandardSchema(person, {
 *   jsonSchema: toStandardJsonSchema(person),
 * });
 * // <JsonForms schema={jsonSchema} validator={validator} ... />
 * ```
 */
export const fromStandardSchema = (
  schema: StandardSchemaV1,
  options: StandardSchemaFormOptions = {}
): StandardSchemaForm => ({
  jsonSchema: deriveJsonSchema(schema, options),
  validator: standardSchemaValidator(schema, options),
});
