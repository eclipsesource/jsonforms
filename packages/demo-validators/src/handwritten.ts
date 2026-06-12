import type {
  DataPath,
  FormValidator,
  JsonSchema,
  ValidationIssue,
} from '@jsonforms/core';
import { appendPointer } from '@jsonforms/core';

/**
 * A handwritten, dependency-free validator interpreting a small subset of
 * JSON Schema constraints (required, string lengths, pattern, numeric ranges).
 * Intentionally naive — it exists to demonstrate that the engine's
 * `FormValidator` seam needs no validation framework at all.
 */
export const handwrittenValidator = (schema: JsonSchema): FormValidator => ({
  validate: (data) => validateObject(schema, data, ''),
});

const validateObject = (
  schema: JsonSchema,
  data: unknown,
  path: DataPath,
): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const record = (
    typeof data === 'object' && data !== null ? data : {}
  ) as Record<string, unknown>;
  for (const name of schema.required ?? []) {
    if (record[name] === undefined) {
      issues.push(issue(appendPointer(path, name), 'required', 'is required'));
    }
  }
  for (const [name, property] of Object.entries(schema.properties ?? {})) {
    const value = record[name];
    if (value !== undefined) {
      issues.push(...validateValue(property, value, appendPointer(path, name)));
    }
  }
  return issues;
};

const validateValue = (
  schema: JsonSchema,
  value: unknown,
  path: DataPath,
): ValidationIssue[] => {
  if (schema.type === 'object') {
    return validateObject(schema, value, path);
  }
  const issues: ValidationIssue[] = [];
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      issues.push(
        issue(
          path,
          'minLength',
          `must be at least ${schema.minLength} characters long`,
        ),
      );
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      issues.push(
        issue(
          path,
          'maxLength',
          `must be at most ${schema.maxLength} characters long`,
        ),
      );
    }
    if (
      schema.pattern !== undefined &&
      !new RegExp(schema.pattern).test(value)
    ) {
      issues.push(issue(path, 'pattern', `must match ${schema.pattern}`));
    }
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      issues.push(issue(path, 'minimum', `must be at least ${schema.minimum}`));
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      issues.push(issue(path, 'maximum', `must be at most ${schema.maximum}`));
    }
  }
  return issues;
};

const issue = (
  path: DataPath,
  key: string,
  message: string,
): ValidationIssue => ({ path, severity: 'error', key, message });
