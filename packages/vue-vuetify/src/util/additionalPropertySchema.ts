import { Resolve, type JsonSchema } from '@jsonforms/core';
import isEqual from 'lodash/isEqual';

const patternCache = new WeakMap<
  object,
  { signatures: string[]; patterns: RegExp[] }
>();
const lowerBounds = new Set([
  'minimum',
  'exclusiveMinimum',
  'minLength',
  'minItems',
  'minProperties',
]);
const upperBounds = new Set([
  'maximum',
  'exclusiveMaximum',
  'maxLength',
  'maxItems',
  'maxProperties',
]);
const scalarKeywords = new Set([
  'type',
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'minLength',
  'maxLength',
  'multipleOf',
  'pattern',
  'format',
  'enum',
  'const',
  'title',
  'description',
  'default',
  'readOnly',
  'writeOnly',
  'i18n',
]);

/** Select the value schema for a dynamic key. Never changes the validation schema. */
export function additionalPropertySchema(
  name: string,
  parent: JsonSchema,
  root: JsonSchema,
): JsonSchema {
  const entries = parent.patternProperties ?? {};
  const signatures = Object.keys(entries).sort();
  let cached = patternCache.get(entries);
  if (!cached || !isEqual(cached.signatures, signatures)) {
    cached = {
      signatures,
      patterns: signatures.map((pattern) => new RegExp(pattern)),
    };
    patternCache.set(entries, cached);
  }
  const matches = cached.patterns.flatMap((pattern, index) =>
    pattern.test(name) ? [entries[signatures[index]]] : [],
  );
  const normalize = (schema: JsonSchema | boolean): JsonSchema =>
    schema === true ? {} : schema === false ? { not: {} } : schema;
  const resolve = (
    schema: JsonSchema,
    seen = new Set<JsonSchema>(),
  ): JsonSchema => {
    if (!schema.$ref || seen.has(schema) || Object.keys(schema).length !== 1)
      return schema;
    const target = Resolve.schema(root, schema.$ref, root);
    return target ? resolve(target, new Set(seen).add(schema)) : schema;
  };
  if (!matches.length) {
    const fallback = parent.additionalProperties;
    return resolve(
      normalize(
        fallback === undefined || fallback === true
          ? { additionalProperties: true }
          : fallback,
      ),
    );
  }
  const schemas = matches.map((schema) => resolve(normalize(schema)));
  if (schemas.length === 1) return schemas[0];

  // Structural schemas, unknown keywords, or conflicting assertions stay conjunctive.
  const conjunction = { allOf: schemas } as JsonSchema;
  const merged: Record<string, unknown> = {};
  for (const schema of schemas) {
    for (const [key, value] of Object.entries(schema)) {
      if (!scalarKeywords.has(key)) return conjunction;
      // Draft-04 boolean exclusivity is coupled to that branch's bound.
      if (
        (key === 'exclusiveMinimum' || key === 'exclusiveMaximum') &&
        typeof value === 'boolean'
      )
        return conjunction;
      if (!(key in merged) || isEqual(merged[key], value)) {
        merged[key] = value;
      } else if (
        typeof value === 'number' &&
        typeof merged[key] === 'number' &&
        (lowerBounds.has(key) || upperBounds.has(key))
      ) {
        merged[key] = lowerBounds.has(key)
          ? Math.max(merged[key], value)
          : Math.min(merged[key], value);
      } else if (
        key === 'type' &&
        [merged[key], value].every(
          (type) => type === 'integer' || type === 'number',
        )
      ) {
        merged[key] = 'integer';
      } else if (key === 'readOnly' || key === 'writeOnly') {
        merged[key] = merged[key] || value;
      } else {
        return conjunction;
      }
    }
  }
  if (
    merged.type !== undefined &&
    !['string', 'number', 'integer', 'boolean', 'null'].includes(
      merged.type as string,
    )
  ) {
    return conjunction;
  }
  return merged as JsonSchema;
}
