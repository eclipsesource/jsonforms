import Ajv, { type ErrorObject, type Options } from 'ajv';
import addFormats from 'ajv-formats';
import type { FormValidator, ValidationIssue } from '@jsonforms/core';
import { escapePointerSegment } from '@jsonforms/core';

/** Creates an AJV instance configured for form validation. */
export const createAjv = (options?: Options): Ajv => {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    ...options,
  });
  addFormats(ajv);
  return ajv;
};

export interface AjvValidatorOptions {
  /** Custom AJV instance; a default one is created when omitted. */
  ajv?: Ajv;
}

/**
 * Creates a {@link FormValidator} that validates against `schema` using AJV.
 * AJV errors are mapped to {@link ValidationIssue}s addressed by JSON Pointer;
 * `required` errors are mapped onto the missing property itself.
 */
export const ajvValidator = (
  schema: object,
  options: AjvValidatorOptions = {},
): FormValidator => {
  const ajv = options.ajv ?? createAjv();
  const validateFn = ajv.compile(schema);
  return {
    validate: (data) => {
      validateFn(data);
      return (validateFn.errors ?? []).map(toIssue);
    },
  };
};

const toIssue = (error: ErrorObject): ValidationIssue => ({
  path: issuePath(error),
  severity: 'error',
  key: error.keyword,
  message: issueMessage(error),
});

const issuePath = (error: ErrorObject): string =>
  error.keyword === 'required'
    ? `${error.instancePath}/${escapePointerSegment(
        (error.params as { missingProperty: string }).missingProperty,
      )}`
    : error.instancePath;

const issueMessage = (error: ErrorObject): string =>
  error.keyword === 'required'
    ? 'is required'
    : (error.message ?? 'is invalid');
