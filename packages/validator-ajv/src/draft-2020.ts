import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import type { Options } from 'ajv/dist/core';
import type { FormValidator } from '@jsonforms/core';
import { ajvValidator as withInstance } from './index';
import { formAjvOptions } from './options';

/**
 * Preconfigured **draft 2020-12** AJV instance for form validation:
 * {@link formAjvOptions} plus the `ajv-formats` formats.
 */
export const createAjv = (options?: Options): Ajv2020 => {
  const ajv = new Ajv2020({ ...formAjvOptions, ...options });
  addFormats(ajv);
  return ajv;
};

/**
 * Batteries-included **draft 2020-12** validator. Only the 2020-12 AJV build
 * is bundled. To bring your own AJV instance, use `ajvValidator(schema, ajv)`
 * from `@jsonforms/validator-ajv` instead.
 */
export const ajvValidator = (
  schema: object,
  options?: Options,
): FormValidator => withInstance(schema, createAjv(options));
