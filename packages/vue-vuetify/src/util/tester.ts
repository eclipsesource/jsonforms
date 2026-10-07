import {
  and,
  hasType,
  isEnumSchema,
  isOneOfEnumSchema,
  schemaMatches,
  schemaSubPathMatches,
  type JsonSchema,
} from '@jsonforms/core';

export const isMultiEnumControl = and(
  schemaMatches(
    (schema) =>
      hasType(schema, 'array') &&
      !Array.isArray(schema.items) &&
      schema.uniqueItems === true
  ),
  schemaSubPathMatches('items', (schema) => {
    return (
      (isOneOfEnumSchema(schema) &&
        schema.oneOf !== undefined &&
        (schema.oneOf as JsonSchema[]).length > 0) ||
      (schema.type === 'string' && isEnumSchema(schema))
    );
  })
);
