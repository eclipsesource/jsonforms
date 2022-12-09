import { Options } from 'ajv';
import { createAjv as createDefaultAjv } from '@jsonforms/vue2-vuetify';
import { ajvKeywords } from './keywords';

export const createAjv = () => {
  const options: Options = {
    useDefaults: true,
    $data: true,
    discriminator: true,
  };

  const ajv = createDefaultAjv(options);
  ajvKeywords(ajv);

  return ajv;
};
