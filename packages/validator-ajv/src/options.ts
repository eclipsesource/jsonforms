import type { Options } from 'ajv/dist/core';

/**
 * Recommended AJV options for form validation: collect all errors (forms show
 * issues per field, not fail-fast) and tolerate vendor keywords in schemas.
 */
export const formAjvOptions: Options = {
  allErrors: true,
  strict: false,
};
