import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds } from '@jsonforms/core';
import DateTimeControlRenderer from '../../../src/controls/DateTimeControlRenderer.vue';
import { entry as dateTimeControlRendererEntry } from '../../../src/controls/DateTimeControlRenderer.entry';
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
      dateTimeFormat: 'YYYY-MM-DDTHH:mm',
      dateTimeSaveFormat: 'YYYY-MM-DDTHH:mm:ss',
    },
  };
  let wrapper: ReturnType<typeof mountJsonForms>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema);
  });

  it('check if child DateTimeControlRenderer exists', () => {
    expect(wrapper.getComponent(DateTimeControlRenderer));
  });

  it('renders a date time input', () => {
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My Date Time');
  });

  it('emits a data change', async () => {
    const input = wrapper.find('input[type="text"]');
    await input.setValue('2021-03-10T21:10');
    expect(wrapper.vm.$data.event.data).toEqual('2021-03-10T21:10:00');
  });

  it('should have a placeholder', async () => {
    const input = wrapper.find('input[type="text"]');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).toEqual('date-time placeholder');
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
