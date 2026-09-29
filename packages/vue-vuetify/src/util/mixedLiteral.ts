import { Resolve, type JsonSchema } from '@jsonforms/core';
/** Tree-only segment encoding. These IDs must never be dispatched as core paths. */
export const encodeMixedSegment = (key: string): string =>
  key === '' || key.includes('.') || key.includes('\0')
    ? '\0' +
      key
        .split('')
        .map((c) => c.charCodeAt(0).toString(16).padStart(4, '0'))
        .join('')
    : key;
export const decodeMixedSegment = (key: string): string =>
  key.startsWith('\0')
    ? (key.slice(1).match(/.{4}/g) ?? [])
        .map((c) => String.fromCharCode(parseInt(c, 16)))
        .join('')
    : key;
export function mixedValueAt(data: any, segments: string[]): any {
  return segments.reduce(
    (value, key) =>
      value != null && Object.prototype.hasOwnProperty.call(value, key)
        ? value[key]
        : undefined,
    data,
  );
}
/** Copy only existing ancestors. An obsolete editor must not recreate removed nodes. */
export function replaceMixedValue(
  data: any,
  segments: string[],
  value: any,
): any {
  if (!segments.length) return value;
  const [key, ...rest] = segments;
  if (
    data === null ||
    typeof data !== 'object' ||
    !Object.prototype.hasOwnProperty.call(data, key)
  )
    return data;
  const next = replaceMixedValue(data[key], rest, value);
  const copy = Array.isArray(data) ? [...data] : { ...data };
  Object.defineProperty(copy, key, {
    value: next,
    enumerable: true,
    configurable: true,
    writable: true,
  });
  return copy;
}

/** Ordinary object Controls still cannot address declared dotted/empty scopes.
 * Keep aggregate forms view-only; the tree edits each selected key in isolation. */
export function mixedHasUnsafeDeclaredScopes(
  schema: JsonSchema,
  root: JsonSchema,
  seen = new Set<JsonSchema>(),
): boolean {
  if (!schema || typeof schema !== 'object' || seen.has(schema)) return false;
  seen.add(schema);
  if (schema.$ref) {
    const resolved = Resolve.schema(root, schema.$ref, root);
    if (resolved && mixedHasUnsafeDeclaredScopes(resolved, root, seen))
      return true;
  }
  for (const [key, child] of Object.entries(schema.properties ?? {})) {
    if (
      key === '' ||
      key.includes('.') ||
      key.includes('\0') ||
      mixedHasUnsafeDeclaredScopes(child, root, seen)
    )
      return true;
  }
  const items = Array.isArray(schema.items)
    ? schema.items
    : schema.items
      ? [schema.items]
      : [];
  return [
    ...items,
    ...(typeof schema.additionalProperties === 'object'
      ? [schema.additionalProperties]
      : []),
    ...Object.values(schema.patternProperties ?? {}),
    ...(schema.allOf ?? []),
    ...(schema.anyOf ?? []),
    ...(schema.oneOf ?? []),
  ].some((child) => mixedHasUnsafeDeclaredScopes(child, root, seen));
}
