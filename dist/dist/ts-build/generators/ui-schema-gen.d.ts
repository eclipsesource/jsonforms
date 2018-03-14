import { JsonSchema } from '../models/jsonSchema';
import { UISchemaElement } from '../models/uischema';
/**
 * Generate a default UI schema.
 * @param {JsonSchema} jsonSchema the JSON schema to generated a UI schema for
 * @param {string} layoutType the desired layout type for the root layout
 *        of the generated UI schema
 */
export declare const generateDefaultUISchema: (jsonSchema: JsonSchema, layoutType?: string, prefix?: string) => UISchemaElement;
