import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { Options } from 'ajv/dist/core';
import type { FormValidator } from '@jsonforms/core';
import { ajvValidator as withInstance } from './index';
import { formAjvOptions } from './options';

/**
 * Preconfigured **draft-07** AJV instance for form validation:
 * {@link formAjvOptions} plus the `ajv-formats` formats.
 */
export const createAjv = (options?: Options): Ajv => {
  const ajv = new Ajv({ ...formAjvOptions, ...options });
  addFormats(ajv);
  return ajv;
};

/**
 * Batteries-included **draft-07** validator. Only the draft-07 AJV build is
 * bundled. To bring your own AJV instance, use `ajvValidator(schema, ajv)`
 * from `@jsonforms/validator-ajv` instead.
 */
export const ajvValidator = (
  schema: object,
  options?: Options,
): FormValidator => withInstance(schema, createAjv(options));
