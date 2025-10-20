import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds } from '@jsonforms/core';
import DateControlRenderer from '../../../src/controls/DateControlRenderer.vue';
import { entry as dateControlRendererEntry } from '../../../src/controls/DateControlRenderer.entry';
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
      dateFormat: 'MM/DD/YYYY',
      dateSaveFormat: 'YYYY-MM-DD',
    },
  };

  let wrapper: ReturnType<typeof mountJsonForms>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema);
  });

  it('check if child DateControlRenderer exists', () => {
    expect(wrapper.getComponent(DateControlRenderer));
  });

  it('renders a date input', () => {
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My Date');
  });

  it('emits a data change', async () => {
    const input = wrapper.find('input[type="text"]');
    await input.setValue('03/10/2021');
    expect(wrapper.vm.$data.event.data).toEqual('2021-03-10');
  });

  it('should have a placeholder', async () => {
    const input = wrapper.find('input[type="text"]');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).toEqual('date placeholder');
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
