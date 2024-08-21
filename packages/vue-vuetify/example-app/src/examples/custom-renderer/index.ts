import schema from './schema.json';
import uischema from './uischema.json';
import data from './data.json';
import { entry as customArrayRendererEntry } from './CustomArrayRenderer.vue';
import {
  UISchemaElement,
  JsonSchema,
  JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';

export const input: {
  schema: JsonSchema;
  uischema: UISchemaElement;
  data: any;
  renderers: JsonFormsRendererRegistryEntry[];
} = { schema, uischema, data, renderers: [customArrayRendererEntry] };
