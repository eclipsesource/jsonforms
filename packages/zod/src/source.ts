import { z } from 'zod';
import type {
  ControlConstraints,
  DataPath,
  SchemaFacets,
  SchemaSource,
  UISchemaElement,
  ValueType,
} from '@jsonforms/core';
import { escapePointerSegment, parsePointer } from '@jsonforms/core';

/**
 * A zod-backed {@link SchemaSource}. Scopes are plain JSON Pointers into the
 * data (e.g. `/name`, `/address/city`) — zod has no schema-tree indirection,
 * so scope and data path coincide.
 */
export const zodSchemaSource = (root: z.ZodType): SchemaSource => ({
  describe: (scope) => {
    const resolved = resolveScope(root, scope);
    if (resolved === undefined) {
      return undefined;
    }
    const { type, defaultValue, readonly } = resolved;
    const facets: SchemaFacets = { valueType: valueTypeOf(type) };
    const meta = metadataOf(type);
    if (typeof meta.title === 'string') {
      facets.title = meta.title;
    }
    const description = descriptionOf(type) ?? meta.description;
    if (typeof description === 'string') {
      facets.description = description;
    }
    if (readonly) {
      facets.readOnly = true;
    }
    if (defaultValue !== undefined) {
      facets.defaultValue = defaultValue;
    }
    const constraints = constraintsOf(type);
    if (constraints !== undefined) {
      facets.constraints = constraints;
    }
    return facets;
  },

  dataPathFor: (scope) => scope as DataPath,

  isRequired: (scope) => {
    const segments = parsePointer(scope);
    const property = segments[segments.length - 1];
    if (property === undefined) {
      return false;
    }
    const parent = resolveScope(root, pointerOf(segments.slice(0, -1)));
    if (parent === undefined || !(parent.type instanceof z.ZodObject)) {
      return false;
    }
    const child = shapeOf(parent.type)[property];
    return child !== undefined && !unwrap(child).optional;
  },

  createDefault: (scope) => resolveScope(root, scope)?.defaultValue,

  generateUISchema: (): UISchemaElement => {
    const { type } = unwrap(root);
    const keys = type instanceof z.ZodObject ? Object.keys(shapeOf(type)) : [];
    return {
      type: 'VerticalLayout',
      elements: keys.map((key) => ({
        type: 'Control',
        scope: `/${escapePointerSegment(key)}`,
      })),
    };
  },
});

interface ResolvedType {
  type: z.ZodType;
  optional: boolean;
  readonly: boolean;
  defaultValue?: unknown;
}

/** Strips optional/default/nullable/readonly wrappers off a zod type. */
const unwrap = (wrapped: z.ZodType): ResolvedType => {
  let type = wrapped;
  let optional = false;
  let readonly = false;
  let defaultValue: unknown;
  for (;;) {
    if (type instanceof z.ZodOptional) {
      optional = true;
      type = type.unwrap() as z.ZodType;
      continue;
    }
    if (type instanceof z.ZodDefault) {
      // A default makes the property optional to enter.
      optional = true;
      const raw = (type.def as { defaultValue?: unknown }).defaultValue;
      defaultValue = typeof raw === 'function' ? (raw as () => unknown)() : raw;
      type = innerTypeOf(type);
      continue;
    }
    if (type instanceof z.ZodNullable) {
      type = type.unwrap() as z.ZodType;
      continue;
    }
    if (type instanceof z.ZodReadonly) {
      readonly = true;
      type = innerTypeOf(type);
      continue;
    }
    return { type, optional, readonly, defaultValue };
  }
};

const innerTypeOf = (type: z.ZodType): z.ZodType => {
  const candidate = type as {
    unwrap?: () => z.ZodType;
    def?: { innerType?: z.ZodType };
  };
  return candidate.unwrap?.() ?? (candidate.def?.innerType as z.ZodType);
};

const shapeOf = (type: z.ZodObject): Readonly<Record<string, z.ZodType>> =>
  type.shape as Readonly<Record<string, z.ZodType>>;

const resolveScope = (
  root: z.ZodType,
  scope: string,
): ResolvedType | undefined => {
  let current = unwrap(root);
  for (const segment of parsePointer(scope)) {
    if (!(current.type instanceof z.ZodObject)) {
      return undefined;
    }
    const child = shapeOf(current.type)[segment];
    if (child === undefined) {
      return undefined;
    }
    current = unwrap(child);
  }
  return current;
};

const pointerOf = (segments: readonly string[]): string =>
  segments.map((segment) => `/${escapePointerSegment(segment)}`).join('');

/**
 * The stable zod type discriminator. Class hierarchy is not reliable here:
 * e.g. `z.email()` is a `ZodStringFormat` that does not extend `ZodString`,
 * but its `def.type` is `'string'`.
 */
const defTypeOf = (type: z.ZodType): string | undefined =>
  (type as { def?: { type?: string } }).def?.type;

const valueTypeOf = (type: z.ZodType): ValueType => {
  switch (defTypeOf(type)) {
    case 'string':
      return 'string';
    case 'number':
      return isIntegerType(type) ? 'integer' : 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      return 'object';
    case 'array':
      return 'array';
    default:
      return 'unknown';
  }
};

const isIntegerType = (type: z.ZodType): boolean => {
  const candidate = type as { isInt?: boolean; format?: string | null };
  return candidate.isInt === true || candidate.format === 'safeint';
};

const constraintsOf = (type: z.ZodType): ControlConstraints | undefined => {
  const constraints: ControlConstraints = {};
  const defType = defTypeOf(type);
  if (defType === 'string') {
    const { minLength, maxLength, format } = type as {
      minLength?: number | null;
      maxLength?: number | null;
      format?: string | null;
    };
    if (typeof minLength === 'number') constraints.minLength = minLength;
    if (typeof maxLength === 'number') constraints.maxLength = maxLength;
    if (typeof format === 'string') constraints.format = format;
  }
  if (defType === 'number') {
    const { minValue, maxValue } = type as {
      minValue?: number | null;
      maxValue?: number | null;
    };
    if (typeof minValue === 'number' && isMeaningfulBound(minValue)) {
      constraints.minimum = minValue;
    }
    if (typeof maxValue === 'number' && isMeaningfulBound(maxValue)) {
      constraints.maximum = maxValue;
    }
  }
  return Object.keys(constraints).length > 0 ? constraints : undefined;
};

/** Filters the implicit ±2^53 bounds of `z.int()` and non-finite values. */
const isMeaningfulBound = (value: number): boolean =>
  Number.isFinite(value) && Math.abs(value) < Number.MAX_SAFE_INTEGER;

const metadataOf = (
  type: z.ZodType,
): { title?: unknown; description?: unknown } => {
  const candidate = type as {
    meta?: () => { title?: unknown; description?: unknown } | undefined;
  };
  return candidate.meta?.() ?? {};
};

const descriptionOf = (type: z.ZodType): unknown =>
  (type as { description?: unknown }).description;
