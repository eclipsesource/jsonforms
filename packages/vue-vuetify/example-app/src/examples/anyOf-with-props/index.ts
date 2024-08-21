import schema from './schema.json';
import data from './data.json';
import { UISchemaElement, JsonSchema } from '@jsonforms/core';

export const input: {
  schema: JsonSchema;
  uischema?: UISchemaElement;
  data: any;
} = { schema, uischema: undefined, data };
