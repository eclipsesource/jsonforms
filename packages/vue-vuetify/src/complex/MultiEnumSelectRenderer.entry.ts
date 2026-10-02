import {
  and,
  hasType,
  optionIs,
  rankWith,
  schemaMatches,
  schemaSubPathMatches,
  uiTypeIs,
  type JsonFormsRendererRegistryEntry,
  type JsonSchema,
} from '@jsonforms/core';
import controlRenderer from './MultiEnumSelectRenderer.vue';

const hasOneOfItems = (schema: JsonSchema): boolean =>
  schema.oneOf !== undefined &&
  schema.oneOf.length > 0 &&
  (schema.oneOf as JsonSchema[]).every((entry: JsonSchema) => {
    return entry.const !== undefined;
  });

const hasEnumItems = (schema: JsonSchema): boolean =>
  schema.type === 'string' && schema.enum !== undefined;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(
    10,
    and(
      uiTypeIs('Control'),
      optionIs('format', 'multiselect'),
      and(
        schemaMatches(
          (schema) =>
            hasType(schema, 'array') &&
            !Array.isArray(schema.items) &&
            schema.uniqueItems === true,
        ),
        schemaSubPathMatches('items', (schema) => {
          return hasOneOfItems(schema) || hasEnumItems(schema);
        }),
      ),
    ),
  ),
};
