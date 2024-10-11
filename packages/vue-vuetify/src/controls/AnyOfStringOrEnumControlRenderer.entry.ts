import {
  and,
  rankWith,
  schemaMatches,
  uiTypeIs,
  type JsonFormsRendererRegistryEntry,
  type JsonSchema,
} from '@jsonforms/core';
import controlRenderer from './AnyOfStringOrEnumControlRenderer.vue';

const findEnumSchema = (schemas: JsonSchema[]) =>
  schemas.find(
    (s) =>
      s.enum !== undefined && (s.type === 'string' || s.type === undefined),
  );
const findTextSchema = (schemas: JsonSchema[]) =>
  schemas.find((s) => s.type === 'string' && s.enum === undefined);

const hasEnumAndText = (schemas: JsonSchema[]): boolean => {
  // idea: map to type,enum and check that all types are string and at least one item is of type enum,
  const enumSchema = findEnumSchema(schemas);
  const stringSchema = findTextSchema(schemas);
  const remainingSchemas = schemas.filter(
    (s) => s !== enumSchema || s !== stringSchema,
  );
  const wrongType = remainingSchemas.find((s) => s.type && s.type !== 'string');
  return !!enumSchema && !!stringSchema && !wrongType;
};

const simpleAnyOf = and(
  uiTypeIs('Control'),
  schemaMatches(
    (schema) => Array.isArray(schema.anyOf) && hasEnumAndText(schema.anyOf),
  ),
);

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(5, simpleAnyOf),
};
