import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds } from '@jsonforms/core';
import { extendedVuetifyRenderers } from '../../../src';
import { mountJsonForms } from '../util';

// Test use of `$ref` in additional-properties `propertyNames`
describe('AdditionalProperties nested $ref propertyNames', () => {
  const schema = {
    type: 'object' as const,
    $defs: {
      attrName: {
        type: 'string' as const,
        pattern: '^[A-Za-z_][A-Za-z0-9_]*$',
      },
    },
    properties: {
      secretFiles: {
        type: 'object' as const,
        additionalProperties: { type: 'string' as const },
        propertyNames: { $ref: '#/$defs/attrName' },
      },
    },
  };
  const uischema = { type: 'Control' as const, scope: '#' };

  beforeEach(() => {
    clearAllIds();
  });

  it('mounts a map whose key type is a `$ref` into the root `$defs`', () => {
    expect(() =>
      mountJsonForms({ secretFiles: {} }, schema, extendedVuetifyRenderers, uischema),
    ).not.toThrow();
  });
});
