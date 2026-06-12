import type { FormValidator, JsonSchema } from '@jsonforms/core';
import { noValidation } from '@jsonforms/core';
import type { AjvVersion } from './ajv';
import { ajvValidatorFor } from './ajv';
import { handwrittenValidator } from './handwritten';
import { asAsyncValidator } from './async';

/**
 * The validation choices offered by the demo apps — an axis orthogonal to the
 * example data, demonstrating the pluggable `FormValidator` seam.
 */
export type ValidationChoice = 'ajv' | 'handwritten' | 'none';

export interface ValidationChoiceInfo {
  id: ValidationChoice;
  label: string;
}

export const validationChoices: readonly ValidationChoiceInfo[] = [
  { id: 'ajv', label: 'AJV' },
  { id: 'handwritten', label: 'Handwritten (no AJV)' },
  { id: 'none', label: 'None' },
];

/** Serializable validation settings selected in the demo apps. */
export interface ValidationSettings {
  choice: ValidationChoice;
  /** AJV build; `'default'` picks the build from the schema's declared `$schema`. */
  ajvVersion?: AjvVersion;
  /** Deliver AJV results asynchronously (promise-based, no added delay). */
  ajvAsync?: boolean;
}

export const createValidator = (
  settings: ValidationSettings,
  schema: JsonSchema,
): FormValidator => {
  switch (settings.choice) {
    case 'ajv': {
      const validator = ajvValidatorFor(
        schema,
        settings.ajvVersion ?? 'default',
      );
      return settings.ajvAsync === true
        ? asAsyncValidator(validator)
        : validator;
    }
    case 'handwritten':
      return handwrittenValidator(schema);
    case 'none':
      return noValidation;
  }
};
