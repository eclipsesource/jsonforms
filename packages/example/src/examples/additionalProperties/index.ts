import schema from './schema.json';
import uischema from './uischema.json';
import data from './data.json';
import i18n from './i18n.json';
import { UISchemaElement, JsonSchema } from '@jsonforms/core';

export const input: {
  schema: JsonSchema;
  uischema: UISchemaElement;
  data: any;
  i18n: any;
} = { schema, uischema, data, i18n };
