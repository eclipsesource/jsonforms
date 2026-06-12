import type { ErrorObject } from 'ajv/dist/core';
import type { ValidationIssue } from '@jsonforms/core';
import { escapePointerSegment } from '@jsonforms/core';

/**
 * Maps AJV errors to {@link ValidationIssue}s addressed by JSON Pointer.
 * Errors reporting a missing property (`required`, `dependentRequired`, …)
 * are mapped onto the missing property itself.
 */
export const ajvErrorsToIssues = (
  errors: readonly ErrorObject[],
): ValidationIssue[] => errors.map(toIssue);

const toIssue = (error: ErrorObject): ValidationIssue => {
  const missingProperty = (error.params as { missingProperty?: string })
    .missingProperty;
  if (missingProperty !== undefined) {
    return {
      path: `${error.instancePath}/${escapePointerSegment(missingProperty)}`,
      severity: 'error',
      key: error.keyword,
      message: 'is required',
    };
  }
  return {
    path: error.instancePath,
    severity: 'error',
    key: error.keyword,
    message: error.message ?? 'is invalid',
  };
};
