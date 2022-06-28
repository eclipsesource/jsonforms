import { clearAllIds } from '@jsonforms/core';
import { Wrapper } from '@vue/test-utils';
import TimeControlRenderer, {
  entry as timeControlRendererEntry,
} from '../../../src/controls/TimeControlRenderer.vue';
import { wait } from '../../../tests';
import { mountJsonForms } from '../util';

describe('TimeControlRenderer.vue', () => {
  const renderers = [timeControlRendererEntry];
  const data = '00:20:00';
  const schema = {
    type: 'string',
    title: 'My Time',
    format: 'time',
  };
  const uischema = {
    type: 'Control',
    scope: '#',
    options: {
      placeholder: 'time placeholder',
      timeFormat: 'HH:mm:ss',
      timeSaveFormat: 'HH:mm:ss',
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

  it('check if child TimeControlRenderer exists', () => {
    expect(wrapper.getComponent(TimeControlRenderer));
  });

  it('renders a time input', () => {
    expect(wrapper.find('input[type="time"]').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My Time');
  });

  it('emits a data change', async () => {
    const input = wrapper.find('input');
    await input.setValue('01:51:10');
    // 300 ms debounceWait
    await wait(300);
    expect(wrapper.vm.$data.data).toEqual('01:51:10');
  });

  it('should have a placeholder', async () => {
    const input = wrapper.find('input');
    await input.trigger('focus');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).toEqual('time placeholder');
  });
  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
