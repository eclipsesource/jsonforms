import type { FormValidator, JsonSchema } from '@jsonforms/core';
import { noValidation } from '@jsonforms/core';
import { ajvForSchema } from './ajv';
import { handwrittenValidator } from './handwritten';
import { withSimulatedLatency } from './async';

/**
 * The validation choices offered by the demo apps — an axis orthogonal to the
 * example data, demonstrating the pluggable `FormValidator` seam.
 */
export type ValidationChoice = 'ajv' | 'ajv-async' | 'handwritten' | 'none';

export interface ValidationChoiceInfo {
  id: ValidationChoice;
  label: string;
}

export const validationChoices: readonly ValidationChoiceInfo[] = [
  { id: 'ajv', label: 'AJV' },
  { id: 'ajv-async', label: 'AJV (async, simulated server)' },
  { id: 'handwritten', label: 'Handwritten (no AJV)' },
  { id: 'none', label: 'None' },
];

export const createValidator = (
  choice: ValidationChoice,
  schema: JsonSchema,
): FormValidator => {
  switch (choice) {
    case 'ajv':
      return ajvForSchema(schema);
    case 'ajv-async':
      return withSimulatedLatency(ajvForSchema(schema));
    case 'handwritten':
      return handwrittenValidator(schema);
    case 'none':
      return noValidation;
  }
};
