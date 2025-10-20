import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds } from '@jsonforms/core';
import IntegerControlRenderer from '../../../src/controls/IntegerControlRenderer.vue';
import { entry as integerControlRendererEntry } from '../../../src/controls/IntegerControlRenderer.entry';
import { wait } from '../../../tests';
import { mountJsonForms } from '../util';

describe('IntegerControlRenderer.vue', () => {
  const renderers = [integerControlRendererEntry];

  const data = 1;
  const schema = {
    type: 'integer',
    title: 'My Integer',
  };
  const uischema = {
    type: 'Control',
    scope: '#',
    options: {
      placeholder: 'integer placeholder',
    },
  };
  let wrapper: ReturnType<typeof mountJsonForms>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema);
  });

  it('check if child IntegerControlRenderer exists', () => {
    expect(wrapper.getComponent(IntegerControlRenderer));
  });

  it('renders a number input', () => {
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My Integer');
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
    expect(placeholder).toEqual('integer placeholder');
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
