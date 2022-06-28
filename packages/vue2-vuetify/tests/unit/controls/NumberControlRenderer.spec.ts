import { clearAllIds } from '@jsonforms/core';
import { Wrapper } from '@vue/test-utils';
import NumberControlRenderer, {
  entry as numberControlRendererEntry,
} from '../../../src/controls/NumberControlRenderer.vue';
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
  let wrapper: Wrapper<any, Element>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('check if child NumberControlRenderer exists', () => {
    expect(wrapper.getComponent(NumberControlRenderer));
  });

  it('renders a number input', () => {
    expect(wrapper.find('input[type="number"]').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My Number');
  });

  it('emits a data change', async () => {
    const input = wrapper.find('input');
    await input.setValue(2);
    // 300 ms debounceWait
    await wait(300);
    expect(wrapper.vm.$data.data).toEqual(2);
  });

  it('should have a placeholder', async () => {
    const input = wrapper.find('input[type="number"]');
    await input.trigger('focus');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).toEqual('number placeholder');
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
