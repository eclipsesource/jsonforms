import { expect, it } from 'vitest';
import {
  encodeMixedSegment,
  decodeMixedSegment,
  mixedValueAt,
  mixedHasUnsafeDeclaredScopes,
  replaceMixedValue,
} from '../../../src/util/mixedLiteral';
it.each(['', 'a.b', 'a[0]', '\0', '\ud800.', '__proto__', '  spaced  '])(
  'round-trips exact tree key %j without a path separator',
  (key) => {
    const id = encodeMixedSegment(key);
    expect(id).not.toContain('.');
    expect(decodeMixedSegment(id)).toBe(key);
  },
);
it('separates dotted and nested keys and updates through arrays without mutation', () => {
  const data = { 'a.b': [{ '': 1 }], a: { b: 2 } };
  const updated = replaceMixedValue(data, ['a.b', '0', ''], 3);
  expect(updated).toEqual({ 'a.b': [{ '': 3 }], a: { b: 2 } });
  expect(mixedValueAt(data, ['a.b', '0', ''])).toBe(1);
  expect(mixedValueAt(data, ['toString'])).toBeUndefined();
  expect(replaceMixedValue(data, ['missing', 'child'], 4)).toBe(data);
});
it('updates prototype-named own keys safely', () => {
  const data = JSON.parse('{"__proto__":{"x":1}}');
  const updated = replaceMixedValue(data, ['__proto__', 'x'], 2);
  expect(Object.getPrototypeOf(updated)).toBe(Object.prototype);
  expect(updated.__proto__).toEqual({ x: 2 });
  expect(Object.prototype).not.toHaveProperty('x');
});

it('protects ordinary declared-property scopes while allowing dynamic literal editors', () => {
  const root = {
    definitions: {
      child: { type: 'object', properties: { 'a.b': { type: 'string' } } },
    },
  };
  expect(
    mixedHasUnsafeDeclaredScopes({ additionalProperties: true }, root),
  ).toBe(false);
  expect(
    mixedHasUnsafeDeclaredScopes({ $ref: '#/definitions/child' }, root),
  ).toBe(true);
  expect(
    mixedHasUnsafeDeclaredScopes(
      { additionalProperties: { $ref: '#/definitions/child' } },
      root,
    ),
  ).toBe(true);
});
