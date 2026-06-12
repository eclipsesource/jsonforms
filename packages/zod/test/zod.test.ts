import { describe, expect, test } from 'vitest';
import { z } from 'zod';
import { zodSchemaSource, zodValidator } from '../src';

const schema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .meta({ title: 'User Name', description: 'Between 3 and 20 characters' }),
  email: z.email().describe('Your e-mail address'),
  age: z.int().min(18).max(100).optional(),
  newsletter: z.boolean().default(false),
  height: z.number().optional(),
  address: z.object({
    city: z.string(),
  }),
});

const source = zodSchemaSource(schema);

describe('zodSchemaSource', () => {
  test('describes string facets with constraints and metadata', () => {
    const facets = source.describe('/username');
    expect(facets).toMatchObject({
      valueType: 'string',
      title: 'User Name',
      description: 'Between 3 and 20 characters',
      constraints: { minLength: 3, maxLength: 20 },
    });
  });

  test('describes integer and number facets', () => {
    expect(source.describe('/age')).toMatchObject({
      valueType: 'integer',
      constraints: { minimum: 18, maximum: 100 },
    });
    expect(source.describe('/height')?.valueType).toBe('number');
  });

  test('describes booleans with defaults', () => {
    const facets = source.describe('/newsletter');
    expect(facets?.valueType).toBe('boolean');
    expect(facets?.defaultValue).toBe(false);
  });

  test('carries descriptions from describe()', () => {
    expect(source.describe('/email')?.description).toBe('Your e-mail address');
  });

  test('string format types like z.email() are strings', () => {
    const facets = source.describe('/email');
    expect(facets?.valueType).toBe('string');
    expect(facets?.constraints?.format).toBe('email');
  });

  test('unbounded integers carry no implicit safe-integer bounds', () => {
    const unbounded = zodSchemaSource(z.object({ count: z.int() }));
    expect(unbounded.describe('/count')?.valueType).toBe('integer');
    expect(unbounded.describe('/count')?.constraints).toBeUndefined();
  });

  test('resolves nested objects', () => {
    expect(source.describe('/address/city')?.valueType).toBe('string');
    expect(source.describe('/address')?.valueType).toBe('object');
  });

  test('returns undefined for unknown scopes', () => {
    expect(source.describe('/missing')).toBeUndefined();
  });

  test('scope and data path coincide', () => {
    expect(source.dataPathFor('/username')).toBe('/username');
    expect(source.dataPathFor('')).toBe('');
  });

  test('required follows optionality', () => {
    expect(source.isRequired('/username')).toBe(true);
    expect(source.isRequired('/age')).toBe(false);
    expect(source.isRequired('/newsletter')).toBe(false);
    expect(source.isRequired('/address/city')).toBe(true);
  });

  test('createDefault returns the declared default', () => {
    expect(source.createDefault('/newsletter')).toBe(false);
    expect(source.createDefault('/username')).toBeUndefined();
  });

  test('generates a vertical layout over the object shape', () => {
    const uischema = source.generateUISchema();
    expect(uischema).toMatchObject({ type: 'VerticalLayout' });
    expect(
      (uischema as { elements: readonly { scope: string }[] }).elements.map(
        (element) => element.scope,
      ),
    ).toEqual([
      '/username',
      '/email',
      '/age',
      '/newsletter',
      '/height',
      '/address',
    ]);
  });
});

describe('zodValidator', () => {
  const validator = zodValidator(schema);

  test('accepts valid data', () => {
    expect(
      validator.validate({
        username: 'ada',
        email: 'ada@example.org',
        newsletter: true,
        address: { city: 'Munich' },
      }),
    ).toEqual([]);
  });

  test('reports missing and invalid values on the affected paths', () => {
    const issues = validator.validate({
      username: 'a',
      email: 'not-an-email',
      address: { city: 'Munich' },
    }) as readonly { path: string; key?: string }[];
    expect(issues.map((issue) => issue.path).sort()).toEqual([
      '/email',
      '/username',
    ]);
  });

  test('cross-field refinements land on the referenced control', () => {
    const trip = z
      .object({
        startDate: z.string(),
        endDate: z.string(),
      })
      .refine((value) => value.endDate >= value.startDate, {
        path: ['endDate'],
        message: 'must not be before the start date',
      });
    const issues = zodValidator(trip).validate({
      startDate: '2026-07-10',
      endDate: '2026-07-03',
    });
    expect(issues).toMatchObject([
      { path: '/endDate', message: 'must not be before the start date' },
    ]);
  });
});
