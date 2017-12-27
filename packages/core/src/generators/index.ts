import { JsonSchema, UISchemaElement } from '../';

export * from './schema-gen';
export * from './ui-schema-gen';

import { generateJsonSchema } from './schema-gen';
import { generateDefaultUISchema } from './ui-schema-gen';

const Generate: {
  jsonSchema(instance: Object, options?: any): JsonSchema;
  uiSchema(jsonSchema: JsonSchema, layoutType?: string, prefix?: string): UISchemaElement
} = {
  jsonSchema: generateJsonSchema,
  uiSchema: generateDefaultUISchema,
};

export { Generate };
export default Generate;
