import type { FormValidator } from '@jsonforms/core';

/**
 * Wraps a validator so its results are delivered asynchronously
 * (promise-based) without any added delay — exercises the engine's async
 * validation path, where issues arrive as a follow-up model update.
 */
export const asAsyncValidator = (validator: FormValidator): FormValidator => ({
  validate: async (data) => validator.validate(data),
});
