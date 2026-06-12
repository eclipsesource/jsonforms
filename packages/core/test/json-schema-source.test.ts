import { describe, expect, test } from 'vitest';
import { jsonSchemaSource, type JsonSchema } from '../src/schema/json-schema';

const schema: JsonSchema = {
  type: 'object',
  title: 'Person',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'Name',
      description: 'Full name',
      minLength: 2,
      maxLength: 100,
    },
    age: { type: 'integer', minimum: 0, maximum: 130, default: 18 },
    locked: { type: 'string', readOnly: true },
    address: {
      type: 'object',
      required: ['city'],
      properties: {
        city: { type: 'string', title: 'City' },
      },
    },
  },
};

const source = jsonSchemaSource(schema);

describe('describe', () => {
  test('returns facets for a primitive property', () => {
    const facets = source.describe('#/properties/name');
    expect(facets).toEqual({
      valueType: 'string',
      title: 'Name',
      description: 'Full name',
      constraints: { minLength: 2, maxLength: 100 },
    });
  });

  test('returns numeric constraints and defaults', () => {
    const facets = source.describe('#/properties/age');
    expect(facets?.valueType).toBe('integer');
    expect(facets?.constraints).toEqual({ minimum: 0, maximum: 130 });
    expect(facets?.defaultValue).toBe(18);
  });

  test('reports readOnly', () => {
    expect(source.describe('#/properties/locked')?.readOnly).toBe(true);
  });

  test('describes the root scope', () => {
    expect(source.describe('#')?.valueType).toBe('object');
  });

  test('returns undefined for unknown scopes', () => {
    expect(source.describe('#/properties/missing')).toBeUndefined();
    expect(source.describe('not-a-scope')).toBeUndefined();
  });
});

describe('dataPathFor', () => {
  test('maps scopes to JSON Pointers', () => {
    expect(source.dataPathFor('#/properties/name')).toBe('/name');
    expect(source.dataPathFor('#/properties/address/properties/city')).toBe(
      '/address/city',
    );
    expect(source.dataPathFor('#')).toBe('');
  });
});

describe('isRequired', () => {
  test('honors the parent required list', () => {
    expect(source.isRequired('#/properties/name')).toBe(true);
    expect(source.isRequired('#/properties/age')).toBe(false);
    expect(source.isRequired('#/properties/address/properties/city')).toBe(
      true,
    );
  });
});

describe('createDefault', () => {
  test('returns the schema default', () => {
    expect(source.createDefault('#/properties/age')).toBe(18);
    expect(source.createDefault('#/properties/name')).toBeUndefined();
  });
});

describe('generateUISchema', () => {
  test('generates a vertical layout with one control per property', () => {
    const uischema = source.generateUISchema();
    expect(uischema).toEqual({
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/name' },
        { type: 'Control', scope: '#/properties/age' },
        { type: 'Control', scope: '#/properties/locked' },
        { type: 'Control', scope: '#/properties/address' },
      ],
    });
  });
});
