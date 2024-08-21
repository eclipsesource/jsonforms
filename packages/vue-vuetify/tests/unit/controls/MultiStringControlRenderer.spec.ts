import { clearAllIds } from '@jsonforms/core';
import { Wrapper } from '@vue/test-utils';
import MultiStringControlRenderer, {
  entry as multiStringControlRendererEntry,
} from '../../../src/controls/MultiStringControlRenderer.vue';
import { wait } from '../../../tests';
import { mountJsonForms } from '../util';

describe('MultiStringControlRenderer.vue', () => {
  const renderers = [multiStringControlRendererEntry];

  const data = 'a';
  const schema = {
    type: 'string',
    title: 'My Multi String',
  };
  const uischema = {
    type: 'Control',
    scope: '#',
    options: {
      multi: true,
      placeholder: 'multi placeholder',
    },
  };
  let wrapper: Wrapper<any, Element>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('check if child MultiStringControlRenderer exists', () => {
    expect(wrapper.getComponent(MultiStringControlRenderer));
  });

  it('renders a text area', () => {
    expect(wrapper.find('textarea').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My Multi String');
  });

  it('emits a data change', async () => {
    const select = wrapper.find('textarea');
    await select.setValue('b');
    // 300 ms debounceWait
    await wait(300);
    expect(wrapper.vm.$data.data).toEqual('b');
  });

  it('should have a placeholder', async () => {
    const input = wrapper.find('textarea');
    await input.trigger('focus');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).toEqual('multi placeholder');
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
