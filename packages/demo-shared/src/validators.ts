import type { FormValidator } from '@jsonforms/core';
import { noValidation } from '@jsonforms/core';
import type { Example } from '@jsonforms/examples';
import { zodValidator } from '@jsonforms/zod';
import type { AjvVersion } from './ajv';
import { ajvValidatorFor } from './ajv';
import { handwrittenValidator } from './handwritten';
import { asAsyncValidator } from './async';

/**
 * The validation choices offered by the demo apps, demonstrating the
 * pluggable `FormValidator` seam.
 */
export type ValidationChoice = 'ajv' | 'handwritten' | 'zod' | 'none';

export interface ValidationChoiceInfo {
  id: ValidationChoice;
  label: string;
}

const jsonSchemaChoices: readonly ValidationChoiceInfo[] = [
  { id: 'ajv', label: 'AJV' },
  { id: 'handwritten', label: 'Handwritten (no AJV)' },
  { id: 'none', label: 'None' },
];

const zodChoices: readonly ValidationChoiceInfo[] = [
  { id: 'zod', label: 'Zod' },
  { id: 'none', label: 'None' },
];

/**
 * The validation choices applicable to an example — a validator must
 * understand the example's schema format, so the available options depend on
 * it.
 */
export const validationChoicesFor = (
  example: Example,
): readonly ValidationChoiceInfo[] =>
  example.format === 'zod' ? zodChoices : jsonSchemaChoices;

/** Serializable validation settings selected in the demo apps. */
export interface ValidationSettings {
  choice: ValidationChoice;
  /** AJV build; `'default'` is AJV's default build (draft-07). */
  ajvVersion?: AjvVersion;
  /** Deliver AJV results asynchronously (promise-based, no added delay). */
  ajvAsync?: boolean;
}

export const createValidator = (
  settings: ValidationSettings,
  example: Example,
): FormValidator => {
  switch (settings.choice) {
    case 'ajv': {
      if (example.format !== 'json-schema') {
        throw new Error('AJV validation requires a JSON Schema example.');
      }
      const validator = ajvValidatorFor(
        example.schema,
        settings.ajvVersion ?? 'default',
      );
      return settings.ajvAsync === true
        ? asAsyncValidator(validator)
        : validator;
    }
    case 'zod': {
      if (example.format !== 'zod') {
        throw new Error('Zod validation requires a zod example.');
      }
      return zodValidator(example.schema);
    }
    case 'handwritten': {
      if (example.format !== 'json-schema') {
        throw new Error(
          'The handwritten validator interprets JSON Schema constraints.',
        );
      }
      return handwrittenValidator(example.schema);
    }
    case 'none':
      return noValidation;
  }
};
