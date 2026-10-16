import { describe, it, expect } from 'vitest';
import { isMultiEnumControl } from '../../../src/util/tester';
import type { ControlElement } from '@jsonforms/core';

describe('tester', () => {
  describe('isMultiEnumControl', () => {
    it('should return false for const-only string array schemas', () => {
      const uischema: ControlElement = {
        type: 'Control',
        scope: '#/properties/myArray',
      };

      const schema = {
        type: 'object',
        properties: {
          myArray: {
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'string',
              const: 'x',
            },
          },
        },
      };

      const result = isMultiEnumControl(uischema, schema, {
        rootSchema: schema,
        config: {},
      });

      expect(result).toBe(false); // isMultiEnumControl returns false when it doesn't match
    });

    it('should return true for enum string array schemas', () => {
      const uischema: ControlElement = {
        type: 'Control',
        scope: '#/properties/myArray',
      };

      const schema = {
        type: 'object',
        properties: {
          myArray: {
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'string',
              enum: ['x', 'y'],
            },
          },
        },
      };

      const result = isMultiEnumControl(uischema, schema, {
        rootSchema: schema,
        config: {},
      });

      expect(result).toBe(true);
    });
  });
});
