import { describe, expect, test } from 'vitest';
import { ajvValidator, compiledAjvValidator } from '../src';
import {
  ajvValidator as draft07Validator,
  createAjv as createDraft07Ajv,
} from '../src/draft-07';
import { ajvValidator as draft2020Validator } from '../src/draft-2020';

const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', minLength: 2 },
    age: { type: 'integer', minimum: 0 },
  },
};

describe('draft-07 preset', () => {
  const validator = draft07Validator(schema);

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

describe('base entry with a caller-supplied AJV instance', () => {
  test('uses the given instance', () => {
    const validator = ajvValidator(schema, createDraft07Ajv({ verbose: true }));
    expect(validator.validate({ name: 'Ada' })).toEqual([]);
    expect(validator.validate({})).toHaveLength(1);
  });
});

describe('draft-2020 preset', () => {
  const schema2020 = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    properties: {
      pair: {
        type: 'array',
        prefixItems: [{ type: 'number' }, { type: 'string' }],
        items: false,
      },
    },
  };

  test('validates draft 2020-12 keywords', () => {
    const validator = draft2020Validator(schema2020);
    expect(validator.validate({ pair: [1, 'two'] })).toEqual([]);
    const issues = validator.validate({ pair: [1, 2] }) as readonly {
      path: string;
    }[];
    expect(issues.map((issue) => issue.path)).toEqual(['/pair/1']);
  });

  test('maps dependentRequired errors onto the missing property', () => {
    const validator = draft2020Validator({
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: {
        cardNumber: { type: 'string' },
        billingAddress: { type: 'string' },
      },
      dependentRequired: { cardNumber: ['billingAddress'] },
    });
    expect(validator.validate({ cardNumber: '4242' })).toMatchObject([
      {
        path: '/billingAddress',
        key: 'dependentRequired',
        message: 'is required',
      },
    ]);
  });
});

describe('compiledAjvValidator', () => {
  test('wraps a precompiled validate function without compiling', () => {
    const validateFn = createDraft07Ajv().compile(schema);
    const validator = compiledAjvValidator(validateFn);
    expect(validator.validate({ name: 'Ada' })).toEqual([]);
    expect(validator.validate({})).toMatchObject([{ path: '/name' }]);
  });
});
