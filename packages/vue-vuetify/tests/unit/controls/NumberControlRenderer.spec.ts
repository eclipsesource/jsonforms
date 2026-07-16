import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds } from '@jsonforms/core';
import NumberControlRenderer from '../../../src/controls/NumberControlRenderer.vue';
import { entry as numberControlRendererEntry } from '../../../src/controls/NumberControlRenderer.entry';
import { wait } from '../../../tests';
import { mountJsonForms } from '../util';

describe('NumberControlRenderer.vue', () => {
  const renderers = [numberControlRendererEntry];
  const data = 1;
  const schema = {
    type: 'number',
    title: 'My Number',
  };
  const uischema = {
    type: 'Control',
    scope: '#',
    options: {
      placeholder: 'number placeholder',
    },
  };
  let wrapper: ReturnType<typeof mountJsonForms>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema);
  });

  it('check if child NumberControlRenderer exists', () => {
    expect(wrapper.getComponent(NumberControlRenderer));
  });

  it('renders a number input', () => {
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My Number');
  });

  it('emits a data change', async () => {
    const input = wrapper.find('input');
    await input.setValue(2);
    // 300 ms debounceWait
    await wait(300);
    expect(wrapper.vm.$data.event.data).toEqual(2);
  });

  it('should have a placeholder', async () => {
    const input = wrapper.find('input[type="text"]');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).toEqual('number placeholder');
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});

import { VNumberInput } from 'vuetify/components';

describe('NumberControlRenderer precision logic', () => {
  const renderers = [numberControlRendererEntry];
  const schema = { type: 'number' };

  beforeEach(() => {
    clearAllIds();
  });

  it('allows unlimited precision by default (passes null to v-number-input)', () => {
    const uischema = { type: 'Control', scope: '#' };
    const wrapper = mountJsonForms(1.23456, schema, renderers, uischema);

    const numberInput = wrapper.findComponent(VNumberInput);
    // Vuetify requires null to remove precision limits
    expect(numberInput.props('precision')).toBeNull();
  });

  it('respects explicitly configured precision via UI schema options', () => {
    const uischema = {
      type: 'Control',
      scope: '#',
      options: { precision: 3 }
    };
    const wrapper = mountJsonForms(1.23456, schema, renderers, uischema);

    const numberInput = wrapper.findComponent(VNumberInput);
    expect(numberInput.props('precision')).toBe(3);
  });
});
