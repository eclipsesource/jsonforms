import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds } from '@jsonforms/core';
import TimeControlRenderer from '../../../src/controls/TimeControlRenderer.vue';
import { entry as timeControlRendererEntry } from '../../../src/controls/TimeControlRenderer.entry';
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
  let wrapper: ReturnType<typeof mountJsonForms>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema);
  });

  it('check if child TimeControlRenderer exists', () => {
    expect(wrapper.getComponent(TimeControlRenderer));
  });

  it('renders a text input', () => {
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My Time');
  });

  it('emits a data change', async () => {
    const input = wrapper.find('input[type="text"]');
    await input.setValue('01:51:10');
    expect(wrapper.vm.$data.event.data).toEqual('01:51:10');
  });

  it('should have a placeholder', async () => {
    const input = wrapper.find('input[type="text"]');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).toEqual('time placeholder');
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
