import { describe, expect, test } from 'vitest';
import {
  appendPointer,
  escapePointerSegment,
  getAtPointer,
  parsePointer,
  setAtPointer,
} from '../src/util/pointer';

describe('parsePointer', () => {
  test('parses the empty pointer', () => {
    expect(parsePointer('')).toEqual([]);
  });

  test('parses nested segments', () => {
    expect(parsePointer('/address/street')).toEqual(['address', 'street']);
  });

  test('unescapes special characters', () => {
    expect(parsePointer('/a~1b/c~0d')).toEqual(['a/b', 'c~d']);
  });
});

describe('appendPointer', () => {
  test('appends and escapes segments', () => {
    expect(appendPointer('', 'name')).toBe('/name');
    expect(appendPointer('/items', 0)).toBe('/items/0');
    expect(appendPointer('', 'odd/key')).toBe('/odd~1key');
  });
});

describe('escapePointerSegment', () => {
  test('escapes ~ before /', () => {
    expect(escapePointerSegment('~/')).toBe('~0~1');
  });
});

describe('getAtPointer', () => {
  const data = { person: { name: 'Ada', pets: [{ name: 'Lovelace' }] } };

  test('resolves the root', () => {
    expect(getAtPointer(data, '')).toBe(data);
  });

  test('resolves nested values', () => {
    expect(getAtPointer(data, '/person/name')).toBe('Ada');
    expect(getAtPointer(data, '/person/pets/0/name')).toBe('Lovelace');
  });

  test('returns undefined for missing paths', () => {
    expect(getAtPointer(data, '/person/age')).toBeUndefined();
    expect(getAtPointer(data, '/missing/deep')).toBeUndefined();
    expect(getAtPointer(undefined, '/person')).toBeUndefined();
  });
});

describe('setAtPointer', () => {
  test('replaces the root for the empty pointer', () => {
    expect(setAtPointer({ a: 1 }, '', { b: 2 })).toEqual({ b: 2 });
  });

  test('sets nested values immutably and shares untouched containers', () => {
    const data = { person: { name: 'Ada' }, other: { value: 1 } };
    const result = setAtPointer(data, '/person/name', 'Grace') as typeof data;
    expect(result.person.name).toBe('Grace');
    expect(data.person.name).toBe('Ada');
    expect(result.other).toBe(data.other);
  });

  test('creates intermediate objects', () => {
    expect(setAtPointer(undefined, '/a/b', 1)).toEqual({ a: { b: 1 } });
  });

  test('copies arrays', () => {
    const data = { items: [1, 2, 3] };
    const result = setAtPointer(data, '/items/1', 9) as typeof data;
    expect(result.items).toEqual([1, 9, 3]);
    expect(data.items).toEqual([1, 2, 3]);
  });

  test('removes properties when setting undefined', () => {
    const result = setAtPointer({ a: 1, b: 2 }, '/a', undefined) as Record<
      string,
      unknown
    >;
    expect('a' in result).toBe(false);
    expect(result['b']).toBe(2);
  });
});
