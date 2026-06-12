import { describe, expect, test } from 'vitest';
import {
  ajvForSchema,
  createValidator,
  declaredDialect,
  handwrittenValidator,
  withSimulatedLatency,
} from '../src';

const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', minLength: 2 },
    age: { type: 'integer', minimum: 0, maximum: 130 },
  },
};

describe('declaredDialect', () => {
  test('defaults to draft-07', () => {
    expect(declaredDialect(schema)).toBe('draft-07');
  });

  test('detects 2020-12', () => {
    expect(
      declaredDialect({
        $schema: 'https://json-schema.org/draft/2020-12/schema',
      }),
    ).toBe('2020-12');
  });
});

describe('ajvForSchema', () => {
  test('validates 2020-12 keywords with the matching build', () => {
    const validator = ajvForSchema({
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: {
        cardNumber: { type: 'string' },
        billingAddress: { type: 'string' },
      },
      dependentRequired: { cardNumber: ['billingAddress'] },
    });
    expect(validator.validate({ cardNumber: '4242' })).toMatchObject([
      { path: '/billingAddress', key: 'dependentRequired' },
    ]);
  });
});

describe('handwrittenValidator', () => {
  const validator = handwrittenValidator(schema);

  test('reports missing required properties', () => {
    expect(validator.validate({})).toMatchObject([
      { path: '/name', key: 'required' },
    ]);
  });

  test('reports constraint violations', () => {
    expect(validator.validate({ name: 'A', age: 200 })).toMatchObject([
      { path: '/name', key: 'minLength' },
      { path: '/age', key: 'maximum' },
    ]);
  });

  test('accepts valid data', () => {
    expect(validator.validate({ name: 'Ada', age: 36 })).toEqual([]);
  });
});

describe('withSimulatedLatency', () => {
  test('delivers the wrapped result asynchronously', async () => {
    const validator = withSimulatedLatency(handwrittenValidator(schema), 5);
    await expect(validator.validate({})).resolves.toMatchObject([
      { path: '/name', key: 'required' },
    ]);
  });
});

describe('createValidator', () => {
  test("the 'none' choice never reports issues", () => {
    expect(createValidator('none', schema).validate({})).toEqual([]);
  });
});
