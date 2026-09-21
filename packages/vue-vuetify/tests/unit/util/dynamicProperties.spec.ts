import { createAjv } from '@jsonforms/core';
import type { JsonSchema7 as JsonSchema } from '@jsonforms/core';
import { describe, expect, it } from 'vitest';
import {
  canRenameDynamicProperty,
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
    definitions: {
      propertyName: {
        type: 'string',
        pattern: '^[A-Z][A-Za-z0-9]*$',
      },
      patternValue: {
        type: 'number',
      },
    },
  };

  describe('rename eligibility', () => {
    it.each([
      ['editable dynamic', {}, true],
      ['readonly', { readonly: true }, false],
      ['disabled', { enabled: false }, false],
      [
        'required and restricted',
        { schema: { required: ['key'] }, restrict: true },
        false,
      ],
      ['required and unrestricted', { schema: { required: ['key'] } }, true],
      [
        'declared false schema',
        { schema: { properties: { key: false } } },
        false,
      ],
      ['missing property', { data: {} }, false],
      ['array index', { data: [1], propertyName: '0' }, false],
    ])('%s', (_, overrides, expected) => {
      expect(
        canRenameDynamicProperty({
          schema: {},
          data: { key: 1 },
          propertyName: 'key',
          enabled: true,
          readonly: false,
          ...overrides,
        } as Parameters<typeof canRenameDynamicProperty>[0]),
      ).toBe(expected);
    });
  });

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
          '^count': { $ref: '#/definitions/patternValue' },
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
        propertyNames: { $ref: '#/definitions/propertyName' },
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
      ['referenced', { $ref: '#/definitions/name' }],
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
        const referencedRoot: JsonSchema = {
          definitions: { name: { minLength: 5 } },
        };
        const propertyNameSchema = getPropertyNameSchema(
          schema,
          referencedRoot,
        );
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
    it.each([undefined, {}, { other: 1 }])(
      'reserves declared names independently of data: %j',
      (data) => {
        expect(
          validateDynamicPropertyName({
            propertyName: 'fixed',
            reservedPropertyNames: ['fixed'],
            data,
          }),
        ).toEqual({ reason: 'alreadyDefined' });
      },
    );

    it('does not reserve inherited Object prototype names', () => {
      expect(
        validateDynamicPropertyName({
          propertyName: 'toString',
          reservedPropertyNames: Object.keys({ fixed: false }),
          data: {},
        }),
      ).toBeNull();
    });

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
          propertyNames: { $ref: '#/definitions/propertyName' },
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
