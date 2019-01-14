import * as AJV from 'ajv';
import { Options } from 'ajv';
import { Draft4 } from '../models/draft4';

export const createAjv = (options?: Options) => {
  const ajv = new AJV({
    schemaId: 'auto',
    allErrors: true,
    jsonPointers: true,
    errorDataPath: 'property',
    ...options
  });
  ajv.addFormat('time', '^([0-1][0-9]|2[0-3]):[0-5][0-9]$');
  ajv.addMetaSchema(Draft4);
  return ajv;
};
