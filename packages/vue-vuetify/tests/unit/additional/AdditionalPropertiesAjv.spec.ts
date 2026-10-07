import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds, createAjv } from '@jsonforms/core';
import { markRaw } from 'vue';
import { extendedVuetifyRenderers } from '../../../src';
import { mountJsonForms } from '../util/util';

// Check that `additionalProperties` reuses the parent form's AJV
describe('AdditionalProperties nested AJV', () => {
  // A map whose key `pattern` is legal only without the `u` flag
  const schema = {
    type: 'object' as const,
    properties: {
      secretFiles: {
        type: 'object' as const,
        additionalProperties: { type: 'string' as const },
        propertyNames: {
          pattern: '^"([^"$\\\\]|\\$(?!{)|\\\\.)*"$',
        },
      },
    },
  };
  const uischema = { type: 'Control' as const, scope: '#' };

  beforeEach(() => {
    clearAllIds();
  });

  it('mounts a map whose key pattern is only valid without the `u` flag', () => {
    // A parent form configured with `unicodeRegExp: false`
    const ajv = markRaw(createAjv({ unicodeRegExp: false }));
    expect(() =>
      mountJsonForms(
        { secretFiles: {} },
        schema,
        extendedVuetifyRenderers,
        uischema,
        undefined,
        undefined,
        ajv,
      ),
    ).not.toThrow();
  });
});
