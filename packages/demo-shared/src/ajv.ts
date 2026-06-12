import type { FormValidator, JsonSchema } from '@jsonforms/core';
import { ajvValidator as draft07Validator } from '@jsonforms/validator-ajv/draft-07';
import { ajvValidator as draft2020Validator } from '@jsonforms/validator-ajv/draft-2020';

/** The JSON Schema dialect a schema declares via `$schema`; draft-07 by default. */
export const declaredDialect = (schema: JsonSchema): 'draft-07' | '2020-12' =>
  typeof schema.$schema === 'string' && schema.$schema.includes('2020-12')
    ? '2020-12'
    : 'draft-07';

/**
 * AJV validation with the build matching the schema's declared dialect.
 * Thanks to the per-draft subpath entries of `@jsonforms/validator-ajv`,
 * exactly the builds imported here end up in the demo bundles.
 */
export const ajvForSchema = (schema: JsonSchema): FormValidator =>
  declaredDialect(schema) === '2020-12'
    ? draft2020Validator(schema)
    : draft07Validator(schema);
