import schema from './schema.json';
import data from './data.json';
import { UISchemaElement, JsonSchema } from '@jsonforms/core';

const uischema = undefined;

export const input: {
  schema: JsonSchema;
  uischema?: UISchemaElement;
  data: any;
} = { schema, uischema, data };
