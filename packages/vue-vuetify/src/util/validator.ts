import { createAjv as createAjvCore } from '@jsonforms/core';
import Ajv, { type Options } from 'ajv';

export const createAjv = (options?: Options): Ajv => {
  const ajv = createAjvCore(options);
  ajv.addFormat('password', () => true);
  return ajv;
};
