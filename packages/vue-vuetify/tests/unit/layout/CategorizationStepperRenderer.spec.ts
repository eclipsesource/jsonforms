import { clearAllIds, RuleEffect } from '@jsonforms/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import CategorizationStepperRenderer from '../../../src/layouts/CategorizationStepperRenderer.vue';
import { layoutRenderers } from '../../../src/layouts';
import { mountJsonForms } from '../util';

describe('CategorizationStepperRenderer.vue', () => {
  const schema = {
    type: 'object',
    properties: {
      showFirst: {
        type: 'boolean',
      },
    },
  };
  const uischema = {
    type: 'Categorization',
    options: {
      variant: 'stepper',
    },
    elements: [
      {
        type: 'Category',
        label: 'First',
        rule: {
          effect: RuleEffect.SHOW,
          condition: {
            scope: '#/properties/showFirst',
            schema: {
              const: true,
            },
          },
        },
        elements: [],
      },
      {
        type: 'Category',
        label: 'Second',
        elements: [],
      },
      {
        type: 'Category',
        label: 'Third',
        elements: [],
      },
    ],
  };

  beforeEach(() => {
    clearAllIds();
  });

  it('selects the first visible category when earlier categories are hidden initially', () => {
    const wrapper = mountJsonForms(
      { showFirst: false },
      schema,
      layoutRenderers,
      uischema
    );

    const stepper = wrapper.getComponent(CategorizationStepperRenderer);

    expect(
      (stepper.vm as unknown as { activeCategory: number }).activeCategory
    ).toBe(2);
  });

  it('uses sequential visible step badges while keeping original category values', () => {
    const wrapper = mountJsonForms(
      { showFirst: false },
      schema,
      layoutRenderers,
      uischema
    );

    const stepper = wrapper.getComponent(CategorizationStepperRenderer);

    const items = stepper.findAllComponents(VStepperItem);

    // 1. Verify it keeps original category values
    expect(items.map((item) => item.props('value'))).toEqual([2, 3]);

    // 2. Verify sequential visible step badges and labels via rendered text
    expect(items[0].text()).toContain('1');
    expect(items[0].text()).toContain('Second');

    expect(items[1].text()).toContain('2');
    expect(items[1].text()).toContain('Third');
  });

  it('keeps the same active category when a previous category becomes visible', async () => {
    const wrapper = mountJsonForms(
      { showFirst: false },
      schema,
      layoutRenderers,
      uischema
    );
    const stepper = wrapper.getComponent(CategorizationStepperRenderer);

    await wrapper.setProps({ data: { showFirst: true } });
    await nextTick();

    expect(
      (stepper.vm as unknown as { activeCategory: number }).activeCategory
    ).toBe(2);
  });
});
