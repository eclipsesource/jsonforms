import type { DataPath } from '../model/nodes';

export const escapePointerSegment = (segment: string): string =>
  segment.replace(/~/g, '~0').replace(/\//g, '~1');

export const unescapePointerSegment = (segment: string): string =>
  segment.replace(/~1/g, '/').replace(/~0/g, '~');

/** Splits a JSON Pointer into its unescaped segments. The empty pointer yields `[]`. */
export const parsePointer = (pointer: DataPath): string[] =>
  pointer === '' ? [] : pointer.slice(1).split('/').map(unescapePointerSegment);

export const appendPointer = (
  pointer: DataPath,
  segment: string | number,
): DataPath => `${pointer}/${escapePointerSegment(String(segment))}`;

const isObjectLike = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/** Resolves a JSON Pointer against `data`; returns `undefined` if the path does not exist. */
export const getAtPointer = (data: unknown, pointer: DataPath): unknown => {
  let current: unknown = data;
  for (const segment of parsePointer(pointer)) {
    if (!isObjectLike(current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
};

/**
 * Immutably sets `value` at `pointer`, creating intermediate objects as needed and
 * sharing all untouched containers. Setting `undefined` removes the property.
 */
export const setAtPointer = (
  data: unknown,
  pointer: DataPath,
  value: unknown,
): unknown => setAtSegments(data, parsePointer(pointer), value);

const setAtSegments = (
  data: unknown,
  segments: readonly string[],
  value: unknown,
): unknown => {
  const segment = segments[0];
  if (segment === undefined) {
    return value;
  }
  const rest = segments.slice(1);
  if (Array.isArray(data)) {
    const copy: unknown[] = data.slice();
    const index = Number(segment);
    copy[index] = setAtSegments(copy[index], rest, value);
    return copy;
  }
  const copy: Record<string, unknown> = isObjectLike(data) ? { ...data } : {};
  if (rest.length === 0 && value === undefined) {
    delete copy[segment];
    return copy;
  }
  copy[segment] = setAtSegments(copy[segment], rest, value);
  return copy;
};
