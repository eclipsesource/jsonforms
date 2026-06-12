import type Ajv from 'ajv/dist/core';
import type { ValidateFunction } from 'ajv/dist/core';
import type { FormValidator } from '@jsonforms/core';
import { ajvErrorsToIssues } from './issues';

export * from './issues';
export * from './options';

/**
 * Creates a {@link FormValidator} validating against `schema` with the given
 * AJV instance — any AJV build (draft-07, 2019-09, 2020-12, …) and any custom
 * configuration.
 *
 * This entry point imports AJV **types only**: nothing of AJV ends up in your
 * bundle beyond the instance you pass in. For batteries-included setups, use
 * the per-draft subpath entries (`@jsonforms/validator-ajv/draft-07`,
 * `…/draft-2019`, `…/draft-2020`) — each bundles exactly one AJV build.
 */
export const ajvValidator = (schema: object, ajv: Ajv): FormValidator =>
  compiledAjvValidator(ajv.compile(schema));

/**
 * Wraps an already compiled AJV validate function as a {@link FormValidator} —
 * e.g. one precompiled with AJV's standalone code generation for CSP
 * environments without `unsafe-eval`. Involves no runtime AJV import at all.
 */
export const compiledAjvValidator = (
  validateFn: ValidateFunction,
): FormValidator => ({
  validate: (data) => {
    validateFn(data);
    return ajvErrorsToIssues(validateFn.errors ?? []);
  },
});
