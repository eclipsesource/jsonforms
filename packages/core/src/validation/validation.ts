import type { DataPath, IssueSeverity } from '../model/nodes';

/** A single validation result, addressed to a data location. */
export interface ValidationIssue {
  /** JSON Pointer of the value this issue belongs to. */
  path: DataPath;
  severity: IssueSeverity;
  /** Stable key identifying the kind of issue, e.g. the validation keyword. */
  key?: string;
  message: string;
}

/**
 * Abstracts validation away from the engine. Implementations may be synchronous
 * (e.g. AJV, see `@jsonforms/validator-ajv`) or asynchronous (e.g. server-side
 * validation) — asynchronous results are applied as a follow-up model update.
 */
export interface FormValidator {
  validate(
    data: unknown,
  ): readonly ValidationIssue[] | Promise<readonly ValidationIssue[]>;
}

/** Validator that never reports issues — the default when none is configured. */
export const noValidation: FormValidator = {
  validate: () => [],
};
