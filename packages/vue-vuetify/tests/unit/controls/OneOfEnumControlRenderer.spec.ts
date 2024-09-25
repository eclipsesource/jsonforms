import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds } from '@jsonforms/core';
import OneOfEnumControlRenderer from '../../../src/controls/OneOfEnumControlRenderer.vue';
import { entry as oneOfEnumControlRendererEntry } from '../../../src/controls/OneOfEnumControlRenderer.entry';
import { wait } from '../../../tests';
import { mountJsonForms } from '../util';

describe('OneOfEnumControlRenderer.vue', () => {
  const renderers = [oneOfEnumControlRendererEntry];
  const data = 'a';

  const schema = {
    type: 'string',
    title: 'My OneOf Enum',
    oneOf: [
      { const: 'a', title: 'Foo' },
      { const: 'b', title: 'Bar' },
    ],
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

  it('check if child OneOfEnumControlRenderer exists', () => {
    expect(wrapper.getComponent(OneOfEnumControlRenderer));
  });

  it('renders a input', () => {
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My OneOf Enum');
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
