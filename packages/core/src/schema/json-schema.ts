import type { ControlConstraints, DataPath, ValueType } from '../model/nodes';
import type { ControlElement, UISchemaElement } from '../model/uischema';
import type { SchemaFacets, SchemaSource } from './source';
import {
  appendPointer,
  escapePointerSegment,
  parsePointer,
} from '../util/pointer';

/**
 * Minimal JSON Schema shape understood by the MVP `jsonSchemaSource`:
 * object schemas with primitive properties. `$ref`, combinators, arrays and
 * nested generation arrive in later milestones.
 */
export interface JsonSchema {
  type?: string;
  title?: string;
  description?: string;
  properties?: Readonly<Record<string, JsonSchema>>;
  required?: readonly string[];
  default?: unknown;
  readOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
  [vendorKeyword: string]: unknown;
}

const VALUE_TYPES: readonly ValueType[] = [
  'string',
  'number',
  'integer',
  'boolean',
  'object',
  'array',
];

const toValueType = (type: unknown): ValueType =>
  VALUE_TYPES.includes(type as ValueType) ? (type as ValueType) : 'unknown';

const scopeSegments = (scope: string): string[] | undefined =>
  scope.startsWith('#') ? parsePointer(scope.slice(1)) : undefined;

const resolveSegments = (
  root: JsonSchema,
  segments: readonly string[],
): JsonSchema | undefined => {
  let current: unknown = root;
  for (const segment of segments) {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return typeof current === 'object' && current !== null
    ? (current as JsonSchema)
    : undefined;
};

const toConstraints = (schema: JsonSchema): ControlConstraints | undefined => {
  const constraints: ControlConstraints = {};
  if (typeof schema.minLength === 'number')
    constraints.minLength = schema.minLength;
  if (typeof schema.maxLength === 'number')
    constraints.maxLength = schema.maxLength;
  if (typeof schema.pattern === 'string') constraints.pattern = schema.pattern;
  if (typeof schema.format === 'string') constraints.format = schema.format;
  if (typeof schema.minimum === 'number') constraints.minimum = schema.minimum;
  if (typeof schema.maximum === 'number') constraints.maximum = schema.maximum;
  if (typeof schema.multipleOf === 'number')
    constraints.multipleOf = schema.multipleOf;
  return Object.keys(constraints).length > 0 ? constraints : undefined;
};

/** Creates a {@link SchemaSource} backed by a JSON Schema. */
export const jsonSchemaSource = (root: JsonSchema): SchemaSource => ({
  describe: (scope) => {
    const segments = scopeSegments(scope);
    const schema =
      segments === undefined ? undefined : resolveSegments(root, segments);
    if (schema === undefined) {
      return undefined;
    }
    const facets: SchemaFacets = { valueType: toValueType(schema.type) };
    if (typeof schema.title === 'string') facets.title = schema.title;
    if (typeof schema.description === 'string')
      facets.description = schema.description;
    if (schema.readOnly === true) facets.readOnly = true;
    if (schema.default !== undefined) facets.defaultValue = schema.default;
    const constraints = toConstraints(schema);
    if (constraints !== undefined) facets.constraints = constraints;
    return facets;
  },

  dataPathFor: (scope) => {
    const segments = scopeSegments(scope) ?? [];
    let path: DataPath = '';
    for (let i = 0; i < segments.length - 1; i++) {
      if (segments[i] === 'properties') {
        path = appendPointer(path, segments[i + 1] as string);
        i++;
      }
    }
    return path;
  },

  isRequired: (scope) => {
    const segments = scopeSegments(scope);
    if (
      segments === undefined ||
      segments.length < 2 ||
      segments[segments.length - 2] !== 'properties'
    ) {
      return false;
    }
    const property = segments[segments.length - 1] as string;
    const parent = resolveSegments(root, segments.slice(0, -2));
    return parent?.required?.includes(property) ?? false;
  },

  createDefault: (scope) => {
    const segments = scopeSegments(scope);
    return segments === undefined
      ? undefined
      : resolveSegments(root, segments)?.default;
  },

  generateUISchema: (): UISchemaElement => {
    const elements: ControlElement[] = Object.keys(root.properties ?? {}).map(
      (name) => ({
        type: 'Control',
        scope: `#/properties/${escapePointerSegment(name)}`,
      }),
    );
    return { type: 'VerticalLayout', elements };
  },
});
