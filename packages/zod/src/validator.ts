import type { z } from 'zod';
import type { FormValidator, ValidationIssue } from '@jsonforms/core';
import { escapePointerSegment } from '@jsonforms/core';

interface RawZodIssue {
  path: ReadonlyArray<PropertyKey>;
  message: string;
  code?: string;
}

/**
 * Creates a {@link FormValidator} from a zod schema — the schema itself is
 * the validator, no further validation library involved. Cross-field rules
 * expressed with `.refine(..., { path })` land on the referenced control.
 */
export const zodValidator = (schema: z.ZodType): FormValidator => ({
  validate: (data) => {
    const result = schema.safeParse(data);
    if (result.success) {
      return [];
    }
    return (result.error.issues as readonly RawZodIssue[]).map(toIssue);
  },
});

const toIssue = (issue: RawZodIssue): ValidationIssue => ({
  path: issue.path.reduce<string>(
    (pointer, segment) => `${pointer}/${escapePointerSegment(String(segment))}`,
    '',
  ),
  severity: 'error',
  key: issue.code,
  message: issue.message,
});
