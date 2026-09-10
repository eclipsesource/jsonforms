import { createAjv, type JsonSchema } from '@jsonforms/core';
import { describe, expect, it } from 'vitest';
import {
  composePropertyPath,
  findPropertySchema,
  getDynamicPropertyNameErrorMessage,
  getPathAncestorPaths,
  getPropertyNameSchema,
  haveAdditionalPropertyNamesChanged,
  validateDynamicPropertyName,
} from '../../../src/util/dynamicProperties';

describe('dynamic property utilities', () => {
  const rootSchema: JsonSchema = {
    type: 'object',
    $defs: {
      propertyName: {
        type: 'string',
        pattern: '^[A-Z][A-Za-z0-9]*$',
      },
      patternValue: {
        type: 'number',
      },
    },
  };

  describe('getPathAncestorPaths', () => {
    it('derives ancestors from an absolute nested control path', () => {
      expect(getPathAncestorPaths('dynamic', 'dynamic.a.b')).toEqual([
        'dynamic',
        'dynamic.a',
      ]);
    });

    it('supports root-scoped controls and selecting the root itself', () => {
      expect(getPathAncestorPaths('', 'a.b')).toEqual(['', 'a']);
      expect(getPathAncestorPaths('dynamic', 'dynamic')).toEqual(['dynamic']);
    });
  });

  describe('findPropertySchema', () => {
    it('prefers a matching pattern over additionalProperties: true', () => {
      const schema: JsonSchema = {
        type: 'object',
        patternProperties: {
          '^count': { $ref: '#/$defs/patternValue' },
        },
        additionalProperties: true,
      };

      expect(findPropertySchema(schema, 'countItems', rootSchema)).toEqual({
        type: 'number',
      });
    });

    it('falls back to the additional-properties schema', () => {
      const schema: JsonSchema = {
        type: 'object',
        patternProperties: {
          '^count': { type: 'number' },
        },
        additionalProperties: { type: 'string' },
      };

      expect(findPropertySchema(schema, 'description', rootSchema)).toEqual({
        type: 'string',
      });
    });
  });

  describe('getPropertyNameSchema', () => {
    it('resolves a propertyNames $ref against the root schema', () => {
      const schema = {
        type: 'object',
        propertyNames: { $ref: '#/$defs/propertyName' },
      } as JsonSchema;

      expect(getPropertyNameSchema(schema, rootSchema)).toEqual({
        type: 'string',
        allOf: [{ type: 'string', pattern: '^[A-Z][A-Za-z0-9]*$' }],
      });
    });

    it('uses patternProperties as a name constraint only when additional properties are forbidden', () => {
      const patternProperties = { '^allowed': { type: 'string' } };

      expect(
        getPropertyNameSchema(
          {
            type: 'object',
            patternProperties,
            additionalProperties: false,
          },
          rootSchema,
        ),
      ).toEqual({
        type: 'string',
        allOf: [{ anyOf: [{ pattern: '^allowed' }] }],
      });

      expect(
        getPropertyNameSchema(
          {
            type: 'object',
            patternProperties,
            additionalProperties: true,
          },
          rootSchema,
        ),
      ).toEqual({ type: 'string' });
    });
  });

  describe('property name schema validation', () => {
    it.each([
      ['inline', { minLength: 5 }],
      ['referenced', { $ref: '#/$defs/name' }],
    ])(
      'combines %s propertyNames with allowed patterns',
      (_, propertyNames) => {
        const schema = {
          type: 'object',
          propertyNames,
          additionalProperties: false,
          patternProperties: {
            '^foo_': { type: 'string' },
            '^bar_': { type: 'number' },
          },
        } as JsonSchema;
        const propertyNameSchema = getPropertyNameSchema(schema, {
          $defs: { name: { minLength: 5 } },
        });
        const ajv = createAjv();

        for (const propertyName of ['foo_title', 'bar_count']) {
          expect(
            validateDynamicPropertyName({
              propertyName,
              data: {},
              propertyNameSchema,
              ajv,
            }),
          ).toBeNull();
        }
        // Each name satisfies one constraint but violates the other.
        for (const propertyName of ['wrong_name', 'foo_']) {
          expect(
            validateDynamicPropertyName({
              propertyName,
              data: {},
              propertyNameSchema,
              ajv,
            }),
          ).toMatchObject({ reason: 'schema' });
        }
      },
    );

    it.each([
      ['propertyNames false', { propertyNames: false }],
      ['closed object without patterns', { additionalProperties: false }],
      [
        'closed object with empty patterns',
        {
          additionalProperties: false,
          patternProperties: {},
        },
      ],
      [
        'incompatible propertyNames type',
        { propertyNames: { type: 'number' } },
      ],
    ])('rejects dynamic names for %s', (_, schema) => {
      const propertyNameSchema = getPropertyNameSchema(
        schema as unknown as JsonSchema,
        rootSchema,
      );
      expect(
        validateDynamicPropertyName({
          propertyName: 'anything',
          data: {},
          propertyNameSchema,
          ajv: createAjv(),
        }),
      ).toMatchObject({ reason: 'schema' });
    });

    it('keeps capture groups and backreferences local to each pattern', () => {
      const propertyNameSchema = getPropertyNameSchema(
        {
          additionalProperties: false,
          patternProperties: {
            '^(a)\\1$': { type: 'string' },
            '^(b)\\1$': { type: 'string' },
          },
        },
        rootSchema,
      );
      const ajv = createAjv();
      for (const name of ['aa', 'bb']) {
        expect(ajv.validate(propertyNameSchema, name)).toBe(true);
      }
      for (const name of ['a', 'b', 'ab']) {
        expect(ajv.validate(propertyNameSchema, name)).toBe(false);
      }
    });

    it('allows unrestricted names when propertyNames is true', () => {
      const propertyNameSchema = getPropertyNameSchema(
        {
          propertyNames: true,
          additionalProperties: true,
        } as unknown as JsonSchema,
        rootSchema,
      );
      expect(createAjv().validate(propertyNameSchema, 'anything')).toBe(true);
    });
  });

  describe('validateDynamicPropertyName', () => {
    const ajv = createAjv();

    it('rejects another existing property but allows the current name', () => {
      const data = { first: 1, second: 2 };

      expect(
        validateDynamicPropertyName({ propertyName: 'second', data }),
      ).toEqual({ reason: 'alreadyDefined' });
      expect(
        validateDynamicPropertyName({
          propertyName: 'first',
          currentPropertyName: 'first',
          data,
        }),
      ).toBeNull();
    });

    it('rejects dots but permits bracket characters supported by core paths', () => {
      expect(
        validateDynamicPropertyName({ propertyName: 'nested.value', data: {} }),
      ).toEqual({ reason: 'invalid' });
      expect(
        validateDynamicPropertyName({ propertyName: 'property[0]', data: {} }),
      ).toBeNull();
      expect(composePropertyPath('parent', '[property]')).toBe(
        'parent.[property]',
      );
    });

    it('uses the same JSON Schema validation for both rename entry points', () => {
      const propertyNameSchema = getPropertyNameSchema(
        {
          type: 'object',
          propertyNames: { $ref: '#/$defs/propertyName' },
        } as JsonSchema,
        rootSchema,
      );

      expect(
        validateDynamicPropertyName({
          propertyName: 'invalid',
          data: {},
          propertyNameSchema,
          ajv,
        }),
      ).toMatchObject({ reason: 'schema' });
      expect(
        validateDynamicPropertyName({
          propertyName: 'ValidName',
          data: {},
          propertyNameSchema,
          ajv,
        }),
      ).toBeNull();
    });

    it('allows JSON Schema errors to be translated by the caller', () => {
      const validationError = validateDynamicPropertyName({
        propertyName: 'invalid',
        data: {},
        propertyNameSchema: { type: 'string', pattern: '^[A-Z]' },
        ajv,
      });

      expect(
        getDynamicPropertyNameErrorMessage(validationError, {
          alreadyDefined: 'Already defined',
          invalid: 'Invalid',
          schema: (error) => `Translated ${error.keyword} error`,
        }),
      ).toBe('Translated pattern error');
    });
  });

  describe('haveAdditionalPropertyNamesChanged', () => {
    it('does not rebuild property descriptors when only a value or its type changes', () => {
      expect(
        haveAdditionalPropertyNamesChanged(
          { declared: 'same', dynamic: { nested: true } },
          { declared: 'same', dynamic: 'text' },
          ['declared'],
        ),
      ).toBe(false);
    });

    it('detects additional-property additions, removals, and order changes', () => {
      expect(
        haveAdditionalPropertyNamesChanged(
          { first: 1, second: 2 },
          { first: 1 },
          [],
        ),
      ).toBe(true);
      expect(
        haveAdditionalPropertyNamesChanged(
          { second: 2, first: 1 },
          { first: 1, second: 2 },
          [],
        ),
      ).toBe(true);
    });
  });
});
