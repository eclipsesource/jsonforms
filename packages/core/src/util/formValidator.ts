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
import type Ajv from 'ajv';
import type { ErrorObject, ValidateFunction } from 'ajv';
import type { JsonSchema } from '../models';
import { createAjv } from './validator';
import { resolveSchema } from './resolvers';
import { decode } from './path';

/**
 * One finding reported by a {@link FormValidator}, addressed to a data
 * location by JSON Pointer.
 *
 * The required fields mirror the `ValidationIssue` of JSON Forms 4.x so a
 * Form Validator written for either version works with both. The optional
 * `params` and `parentSchema` carry the extra information JSON Forms 3.x
 * uses for error placement and translation; core fills them in as far as it
 * can when an adapter leaves them out.
 */
export interface ValidationIssue {
  /** JSON Pointer of the value this issue belongs to, e.g. `/address/street`. */
  path: string;
  /**
   * Stable key identifying the kind of issue, usually the JSON Schema keyword
   * (`required`, `minLength`, ...). It drives the `error.<key>` translation
   * lookups. Defaults to `custom` when left out.
   */
  key?: string;
  /** Human readable message, used when no translation is registered. */
  message: string;
  /**
   * JSON Forms 3.x stores errors only; issues with any other severity are
   * dropped.
   */
  severity?: 'error';
  /**
   * Keyword parameters in AJV's shape, e.g. `{ missingProperty: 'name' }` for
   * `required` or `{ additionalProperty: 'x' }` for `additionalProperties`.
   */
  params?: Record<string, unknown>;
  /**
   * The schema the issue was raised against. Resolved from the form schema by
   * `path` when left out.
   */
  parentSchema?: JsonSchema;
}

/**
 * Validates form data against one schema. This is the pluggable seam between
 * JSON Forms and a validation library; AJV is the built-in implementation,
 * see {@link createAjvValidator}.
 *
 * The shape mirrors the `FormValidator` of JSON Forms 4.x, restricted to
 * synchronous results. Asynchronous validation stays with middleware and
 * `updateErrors`.
 */
export interface FormValidator {
  /** Validates `data` and returns every issue found, or an empty array. */
  validate: (data: unknown) => readonly ValidationIssue[];
  /**
   * Optional fast path for rule conditions: whether `data` satisfies the
   * (usually small) `schema`. When absent, core creates a Form Validator for
   * the condition schema through the factory instead.
   */
  matches?: (schema: JsonSchema, data: unknown) => boolean;
}

/**
 * Produces the {@link FormValidator} for one schema. Core calls it whenever
 * the form schema changes and caches the result in its state.
 */
export type FormValidatorFactory = (schema: JsonSchema) => FormValidator;

/**
 * What adopters pass as the `validator` option: a {@link FormValidatorFactory},
 * or a {@link FormValidator} already bound to the form schema. A bound
 * validator is reused for every schema, so the adopter owns swapping it when
 * the schema changes.
 */
export type ValidatorOption = FormValidatorFactory | FormValidator;

/** Whether `candidate` is a {@link FormValidator} object. */
export const isFormValidator = (
  candidate: unknown
): candidate is FormValidator =>
  typeof candidate === 'object' &&
  candidate !== null &&
  typeof (candidate as FormValidator).validate === 'function';

/** Whether `candidate` is a {@link FormValidatorFactory}. */
export const isFormValidatorFactory = (
  candidate: unknown
): candidate is FormValidatorFactory => typeof candidate === 'function';

/** Normalizes a {@link ValidatorOption} to a factory. */
export const toFormValidatorFactory = (
  option: ValidatorOption
): FormValidatorFactory =>
  isFormValidatorFactory(option) ? option : () => option;

/**
 * Issue produced by the built-in AJV adapter. It carries every field of the
 * original AJV error so that converting it back with {@link issuesToErrors}
 * loses nothing.
 */
export interface AjvValidationIssue extends ValidationIssue {
  schemaPath: string;
  schema?: unknown;
  data?: unknown;
  propertyName?: string;
}

/** Maps AJV errors to {@link AjvValidationIssue}s. */
export const ajvErrorsToIssues = (
  errors: readonly ErrorObject[] | null | undefined
): AjvValidationIssue[] =>
  (errors ?? []).map((error) => {
    const { instancePath, keyword, message, params, parentSchema, ...rest } =
      error;
    return {
      ...rest,
      path: instancePath,
      key: keyword,
      message: message ?? '',
      severity: 'error',
      params,
      parentSchema: parentSchema as JsonSchema | undefined,
    };
  });

/** A {@link FormValidator} backed by an AJV compiled validate function. */
export interface AjvFormValidator extends FormValidator {
  /** The compiled AJV validate function this Form Validator wraps. */
  readonly validateFn: ValidateFunction;
}

/** Whether `validator` is an {@link AjvFormValidator}. */
export const isAjvFormValidator = (
  validator: FormValidator | undefined
): validator is AjvFormValidator =>
  validator !== undefined &&
  typeof (validator as AjvFormValidator).validateFn === 'function';

/**
 * Wraps an already compiled AJV validate function as a {@link FormValidator},
 * for example one generated ahead of time with AJV's standalone code
 * generation for Content Security Policy setups without `unsafe-eval`.
 * No AJV instance is involved at runtime.
 *
 * Standalone code generated without the `verbose` option carries no
 * `parentSchema`; core then resolves it from the form schema.
 */
export const compiledAjvValidator = (
  validateFn: ValidateFunction,
  matches?: FormValidator['matches']
): AjvFormValidator => ({
  validateFn,
  matches,
  validate: (data) => {
    validateFn(data);
    return ajvErrorsToIssues(validateFn.errors);
  },
});

/**
 * The built-in adapter: a {@link FormValidatorFactory} that compiles each
 * schema with the given AJV instance, or with {@link createAjv} when none is
 * given. This is what core uses when no `validator` option is configured.
 */
export const createAjvValidator = (
  ajv: Ajv = createAjv()
): FormValidatorFactory => {
  const matches = (schema: JsonSchema, data: unknown): boolean =>
    ajv.validate(schema, data) as boolean;
  return (schema) => compiledAjvValidator(ajv.compile(schema), matches);
};

const decodePointer = (pointer: string): string[] =>
  pointer === '' ? [] : pointer.split('/').slice(1).map(decode);

const dereference = (
  schema: JsonSchema | undefined,
  rootSchema: JsonSchema
): JsonSchema | undefined =>
  schema !== undefined && typeof schema.$ref === 'string'
    ? resolveSchema(rootSchema, schema.$ref, rootSchema)
    : schema;

/**
 * Best-effort lookup of the schema that describes the value at
 * `instancePath`, walking `properties`, `items` and `additionalProperties`
 * and following `$ref`s. Returns `undefined` when the path cannot be
 * followed.
 */
export const resolveParentSchema = (
  rootSchema: JsonSchema | undefined,
  instancePath: string
): JsonSchema | undefined => {
  if (rootSchema === undefined) {
    return undefined;
  }
  let current = dereference(rootSchema, rootSchema);
  for (const segment of decodePointer(instancePath)) {
    if (current === undefined) {
      return undefined;
    }
    let next: JsonSchema | undefined;
    if (current.properties && segment in current.properties) {
      next = current.properties[segment];
    } else if (/^\d+$/.test(segment) && current.items !== undefined) {
      next = Array.isArray(current.items)
        ? current.items[Number(segment)]
        : current.items;
    } else if (typeof current.additionalProperties === 'object') {
      next = current.additionalProperties;
    }
    current = dereference(next, rootSchema);
  }
  return current;
};

/**
 * Converts {@link ValidationIssue}s to the AJV-shaped error objects JSON
 * Forms 3.x stores in its state and hands to renderers, so that error
 * placement, translation and every existing consumer keep working with any
 * Form Validator.
 *
 * Normalization: issues whose severity is not `error` are dropped; a missing
 * `key` becomes `custom`; a `required` issue addressed to the missing property
 * itself is split into the parent's `instancePath` plus
 * `params.missingProperty`; a missing `parentSchema` is resolved from
 * `rootSchema` by path. Fields beyond the issue type (e.g. AJV's
 * `schemaPath`) are passed through untouched.
 *
 * @param issues the issues reported by a Form Validator
 * @param rootSchema the form schema, used to resolve a missing `parentSchema`
 */
export const issuesToErrors = (
  issues: readonly ValidationIssue[] | null | undefined,
  rootSchema?: JsonSchema
): ErrorObject[] =>
  (issues ?? [])
    .filter(
      (issue) => issue.severity === undefined || issue.severity === 'error'
    )
    .map((issue) => {
      const {
        path,
        key,
        severity: _severity,
        message,
        params,
        parentSchema,
        ...rest
      } = issue as ValidationIssue & Record<string, unknown>;
      let instancePath = path ?? '';
      const keyword = key ?? 'custom';
      const errorParams: Record<string, unknown> = { ...(params ?? {}) };
      if (
        keyword === 'required' &&
        errorParams.missingProperty === undefined &&
        instancePath.length > 0
      ) {
        const cut = instancePath.lastIndexOf('/');
        errorParams.missingProperty = decode(instancePath.slice(cut + 1));
        instancePath = instancePath.slice(0, cut);
      }
      return {
        schemaPath: '',
        ...rest,
        instancePath,
        keyword,
        params: errorParams,
        message,
        parentSchema:
          parentSchema ?? resolveParentSchema(rootSchema, instancePath),
      } as ErrorObject;
    });
