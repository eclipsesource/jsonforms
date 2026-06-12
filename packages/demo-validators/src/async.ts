import type { FormValidator } from '@jsonforms/core';

/**
 * Wraps any validator with artificial latency, simulating server-side
 * validation. The engine applies data changes immediately and delivers the
 * issues as a follow-up model update once the promise resolves; outdated runs
 * are discarded automatically.
 */
export const withSimulatedLatency = (
  validator: FormValidator,
  milliseconds = 400,
): FormValidator => ({
  validate: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
    return validator.validate(data);
  },
});
