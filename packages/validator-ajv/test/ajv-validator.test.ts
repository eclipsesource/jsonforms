import { describe, expect, test } from 'vitest';
import { ajvValidator } from '../src';

const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', minLength: 2 },
    age: { type: 'integer', minimum: 0 },
  },
};

describe('ajvValidator', () => {
  const validator = ajvValidator(schema);

  test('returns no issues for valid data', () => {
    expect(validator.validate({ name: 'Ada', age: 36 })).toEqual([]);
  });

  test('maps required errors onto the missing property', () => {
    const issues = validator.validate({}) as readonly {
      path: string;
      key?: string;
    }[];
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      path: '/name',
      key: 'required',
      severity: 'error',
    });
  });

  test('maps keyword errors to the instance path', () => {
    const issues = validator.validate({ name: 'A', age: -1 }) as readonly {
      path: string;
      key?: string;
      message: string;
    }[];
    expect(issues).toHaveLength(2);
    expect(issues.map((issue) => [issue.path, issue.key])).toEqual([
      ['/name', 'minLength'],
      ['/age', 'minimum'],
    ]);
    expect(issues[0]?.message).toContain('fewer than 2 characters');
  });
});
