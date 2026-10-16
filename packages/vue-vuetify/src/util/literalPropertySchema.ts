import type { JsonSchema, JsonSchema7 } from '@jsonforms/core';

/** Keep local references rooted in the original document when editing a value
 * in an isolated form. Only visit schema keywords: defaults and enums are data. */
export const literalPropertySchema = (
  schema: JsonSchema,
  rootSchema: JsonSchema,
): JsonSchema => {
  const prefix = '#/definitions/__jsonforms_root';
  const maps = new Set([
    'properties',
    'patternProperties',
    'definitions',
    '$defs',
    'dependentSchemas',
  ]);
  const singles = new Set([
    'additionalProperties',
    'additionalItems',
    'contains',
    'propertyNames',
    'not',
    'if',
    'then',
    'else',
    'unevaluatedProperties',
    'unevaluatedItems',
  ]);
  const arrays = new Set(['allOf', 'anyOf', 'oneOf', 'prefixItems']);
  const rewrite = (input: unknown): unknown => {
    if (!input || typeof input !== 'object' || Array.isArray(input))
      return input;
    const source = input as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(source).map(([key, value]) => {
        if (
          key === '$ref' &&
          typeof value === 'string' &&
          (value === '#' || value.startsWith('#/'))
        ) {
          return [key, `${prefix}${value.slice(1)}`];
        }
        if (maps.has(key) || key === 'dependencies') {
          return [
            key,
            Object.fromEntries(
              Object.entries(value as Record<string, unknown>).map(
                ([name, child]) => [name, rewrite(child)],
              ),
            ),
          ];
        }
        if (singles.has(key)) return [key, rewrite(value)];
        if (arrays.has(key) || key === 'items') {
          return [
            key,
            Array.isArray(value) ? value.map(rewrite) : rewrite(value),
          ];
        }
        return [key, value];
      }),
    );
  };
  const root = rewrite(rootSchema) as JsonSchema7;
  // The bundled root is part of this document, not a new reference scope.
  delete root.$id;
  const value = rewrite(schema) as JsonSchema7;
  delete value.$id;
  return {
    ...value,
    definitions: { ...value.definitions, __jsonforms_root: root },
  };
};
