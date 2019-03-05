import { JsonSchema } from '@jsonforms/core';

export type SchemaLabelProvider = (
  schema: JsonSchema,
  schemaPath?: string
) => string;

export type InstanceLabelProvider = (
  schema: JsonSchema,
  data: any,
  instancePath: string
) => string;
