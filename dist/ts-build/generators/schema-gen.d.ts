import { JsonSchema } from '../models/jsonSchema';
/**
 * Generate a JSON schema based on the given data and any additional options.
 * @param {Object} instance the data to create a JSON schema for
 * @param {any} options any additional options that may alter the generated JSON schema
 * @returns {JsonSchema} the generated schema
 */
export declare const generateJsonSchema: (instance: Object, options?: any) => JsonSchema;
