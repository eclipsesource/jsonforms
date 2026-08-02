import { createAjv, type JsonSchema } from '@jsonforms/core';
import { describe, expect, it } from 'vitest';
import {
  composePropertyPath,
  findPropertySchema,
  getDynamicPropertyNameErrorMessage,
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
        pattern: '^[A-Z][A-Za-z0-9]*$',
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
      ).toEqual({ type: 'string', pattern: '^allowed' });

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
