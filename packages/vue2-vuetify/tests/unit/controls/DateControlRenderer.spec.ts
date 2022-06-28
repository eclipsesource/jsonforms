import { clearAllIds } from '@jsonforms/core';
import { Wrapper } from '@vue/test-utils';
import DateControlRenderer, {
  entry as dateControlRendererEntry,
} from '../../../src/controls/DateControlRenderer.vue';
import { wait } from '../../../tests';
import { mountJsonForms } from '../util';

describe('DateControlRenderer.vue', () => {
  const renderers = [dateControlRendererEntry];

  const data = '2021-03-09';
  const schema = {
    type: 'string',
    title: 'My Date',
    format: 'date',
  };
  const uischema = {
    type: 'Control',
    scope: '#',
    options: {
      placeholder: 'date placeholder',
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

  it('check if child DateControlRenderer exists', () => {
    expect(wrapper.getComponent(DateControlRenderer));
  });

  it('renders a date input', () => {
    expect(wrapper.find('input[type="date"]').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My Date');
  });

  it('emits a data change', async () => {
    const input = wrapper.find('input[type="date"]');
    await input.setValue('2021-03-10');
    await input.trigger('blur');
    // 300 ms debounceWait
    await wait(300);
    expect(wrapper.vm.$data.data).toEqual('2021-03-10');
  });

  it('should have a placeholder', async () => {
    const input = wrapper.find('input[type="date"]');
    await input.trigger('focus');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).toEqual('date placeholder');
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
