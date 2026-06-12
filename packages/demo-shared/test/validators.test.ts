import { describe, expect, test } from 'vitest';
import {
  ajvValidatorFor,
  asAsyncValidator,
  createValidator,
  handwrittenValidator,
} from '../src';

const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', minLength: 2 },
    age: { type: 'integer', minimum: 0, maximum: 130 },
  },
};

const schema2020 = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  properties: {
    cardNumber: { type: 'string' },
    billingAddress: { type: 'string' },
  },
  dependentRequired: { cardNumber: ['billingAddress'] },
};

describe('ajvValidatorFor', () => {
  test('every selectable version validates a dialect-free schema', () => {
    for (const version of ['default', '2019-09', '2020-12'] as const) {
      const validator = ajvValidatorFor(schema, version);
      expect(validator.validate({ name: 'Ada' })).toEqual([]);
      expect(validator.validate({})).toHaveLength(1);
    }
  });

  test('the 2020-12 build validates 2020-12 keywords', () => {
    const validator = ajvValidatorFor(schema2020, '2020-12');
    expect(validator.validate({ cardNumber: '4242' })).toMatchObject([
      { path: '/billingAddress', key: 'dependentRequired' },
    ]);
  });

  test('the default build fails to compile a 2020-12 schema', () => {
    expect(() => ajvValidatorFor(schema2020, 'default')).toThrow(/2020-12/);
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

describe('asAsyncValidator', () => {
  test('delivers the wrapped result as a promise', async () => {
    const validator = asAsyncValidator(handwrittenValidator(schema));
    const result = validator.validate({});
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toMatchObject([
      { path: '/name', key: 'required' },
    ]);
  });
});

describe('createValidator', () => {
  test("the 'none' choice never reports issues", () => {
    expect(createValidator({ choice: 'none' }, schema).validate({})).toEqual(
      [],
    );
  });

  test('ajv with async mode delivers a promise', async () => {
    const validator = createValidator(
      { choice: 'ajv', ajvAsync: true },
      schema,
    );
    await expect(validator.validate({})).resolves.toMatchObject([
      { path: '/name' },
    ]);
  });

  test('an explicit ajv version is honored', () => {
    const validator = createValidator(
      { choice: 'ajv', ajvVersion: '2019-09' },
      schema,
    );
    expect(validator.validate({ name: 'Ada' })).toEqual([]);
  });
});
