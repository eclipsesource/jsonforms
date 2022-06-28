import { clearAllIds } from '@jsonforms/core';
import { Wrapper } from '@vue/test-utils';
import DateTimeControlRenderer, {
  entry as dateTimeControlRendererEntry,
} from '../../../src/controls/DateTimeControlRenderer.vue';
import { wait } from '../../../tests';
import { mountJsonForms } from '../util';

describe('DateTimeControlRenderer.vue', () => {
  const renderers = [dateTimeControlRendererEntry];

  const data = '2021-03-09T21:54:00.000Z';
  const schema = {
    type: 'string',
    title: 'My Date Time',
    format: 'date-time',
  };
  const uischema = {
    type: 'Control',
    scope: '#',
    options: {
      placeholder: 'date-time placeholder',
      dateTimeSaveFormat: 'YYYY-MM-DDTHH:mm:ss',
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

  it('check if child DateTimeControlRenderer exists', () => {
    expect(wrapper.getComponent(DateTimeControlRenderer));
  });

  it('renders a date time input', () => {
    expect(wrapper.find('input[type="datetime-local"]').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My Date Time');
  });

  it('emits a data change', async () => {
    const input = wrapper.find('input[type="datetime-local"]');
    await input.setValue('2021-03-10T21:10');
    await input.trigger('blur');
    // 300 ms debounceWait
    await wait(300);
    expect(wrapper.vm.$data.data).toEqual('2021-03-10T21:10:00');
  });

  it('should have a placeholder', async () => {
    const input = wrapper.find('input[type="datetime-local"]');
    await input.trigger('focus');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).toEqual('date-time placeholder');
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
