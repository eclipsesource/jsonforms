import type { FormValidator, JsonSchema } from '@jsonforms/core';
import { ajvValidator as draft07Validator } from '@jsonforms/validator-ajv/draft-07';
import { ajvValidator as draft2019Validator } from '@jsonforms/validator-ajv/draft-2019';
import { ajvValidator as draft2020Validator } from '@jsonforms/validator-ajv/draft-2020';

/**
 * Selectable AJV builds. `'default'` is AJV's default build (draft-07) —
 * schemas declaring another dialect via `$schema` fail to compile with it,
 * exactly as they would in an application using the wrong build.
 */
export type AjvVersion = 'default' | '2019-09' | '2020-12';

export interface AjvVersionInfo {
  id: AjvVersion;
  label: string;
}

export const ajvVersionChoices: readonly AjvVersionInfo[] = [
  { id: 'default', label: 'draft-07 (default)' },
  { id: '2019-09', label: '2019-09' },
  { id: '2020-12', label: '2020-12' },
];

/**
 * AJV validation with the selected build. Thanks to the per-draft subpath
 * entries of `@jsonforms/validator-ajv`, exactly the builds imported here end
 * up in the demo bundles. Throws if the schema cannot be compiled by the
 * selected build (e.g. a 2020-12 schema with the draft-07 build).
 */
export const ajvValidatorFor = (
  schema: JsonSchema,
  version: AjvVersion,
): FormValidator => {
  switch (version) {
    case '2019-09':
      return draft2019Validator(schema);
    case '2020-12':
      return draft2020Validator(schema);
    case 'default':
      return draft07Validator(schema);
  }
};
