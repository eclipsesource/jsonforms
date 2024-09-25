import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds } from '@jsonforms/core';
import EnumControlRenderer from '../../../src/controls/EnumControlRenderer.vue';
import { entry as enumControlRendererEntry } from '../../../src/controls/EnumControlRenderer.entry';
import { wait } from '../../../tests';
import { mountJsonForms } from '../util';

describe('EnumControlRenderer.vue', () => {
  const renderers = [enumControlRendererEntry];

  const data = 'a';

  const schema = {
    type: 'string',
    title: 'My Enum',
    enum: ['a', 'b'],
  };
  const uischema = {
    type: 'Control',
    scope: '#',
  };

  let wrapper: ReturnType<typeof mountJsonForms>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema);
  });

  it('check if child EnumControlRenderer exists', () => {
    expect(wrapper.getComponent(EnumControlRenderer));
  });

  it('renders a input', () => {
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My Enum');
  });

  it.todo('emits a data change', async () => {
    const select = wrapper.find('input[type="text"]');
    // select the input so menu is shown
    await select.trigger('click');

    // select 2nd element which is b and click it to select it
    wrapper.find('div[role="listbox"] div:nth-child(2)').trigger('click');
    // 300 ms debounceWait
    await wait(300);
    expect(wrapper.vm.$data.event.data).toEqual('b');
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render component and match snapshot when clicked', async () => {
    const input = wrapper.find('input[type="text"]');
    await input.trigger('click');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
