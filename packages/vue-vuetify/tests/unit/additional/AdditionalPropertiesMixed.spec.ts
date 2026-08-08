import { clearAllIds } from '@jsonforms/core';
import { nextTick } from 'vue';
import { beforeEach, describe, expect, it } from 'vitest';
import { extendedVuetifyRenderers } from '../../../src';
import { mountJsonForms } from '../util';

describe('AdditionalProperties mixed values', () => {
  const schema = {
    type: 'object' as const,
    additionalProperties: {},
  };
  const uischema = { type: 'Control' as const, scope: '#' };

  beforeEach(() => {
    clearAllIds();
  });

  it('updates the mixed renderer when an existing property changes type', async () => {
    const wrapper = mountJsonForms(
      { dynamic: 'text' },
      schema,
      extendedVuetifyRenderers,
      uischema,
    );

    expect(wrapper.find('.mixed-primitive').exists()).toBe(true);

    await wrapper.setProps({ data: { dynamic: { nested: true } } });
    await nextTick();

    expect(wrapper.find('.mixed-tree-container').exists()).toBe(true);
  });
});
