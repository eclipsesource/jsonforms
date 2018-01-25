import { JsonSchema, UISchemaElement } from '../';

import { generateJsonSchema } from './schema';
import { generateDefaultUISchema } from './uischema';

const Generate: {
  jsonSchema(instance: Object, options?: any): JsonSchema;
  uiSchema(jsonSchema: JsonSchema, layoutType?: string, prefix?: string): UISchemaElement
} = {
  jsonSchema: generateJsonSchema,
  uiSchema: generateDefaultUISchema,
};

export { Generate };
export default Generate;
export { generateJsonSchema };
export { generateDefaultUISchema };
