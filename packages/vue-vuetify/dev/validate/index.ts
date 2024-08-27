import type { Options } from 'ajv';
import { markRaw } from 'vue';
import { createAjv as createDefaultAjv } from '../../src';
import { ajvKeywords } from './keywords';

export const createAjv = () => {
  const options: Options = {
    useDefaults: true,
    $data: true,
    discriminator: true,
  };

  const ajv = createDefaultAjv(options);
  ajvKeywords(ajv);

  // when ajv is used in component properties do not make it reactive
  return markRaw(ajv);
};
