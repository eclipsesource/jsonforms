import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds } from '@jsonforms/core';
import LabelRenderer from '../../../src/additional/LabelRenderer.vue';
import { entry as labelRendererEntry } from '../../../src/additional/LabelRenderer.entry';
import { mountJsonForms } from '../util';

describe('LabelRenderer.vue', () => {
  const renderers = [labelRendererEntry];

  const data = '';
  const schema = {
    type: 'string',
  };
  const uischema = {
    type: 'Label',
    text: 'My Label',
  };

  let wrapper: ReturnType<typeof mountJsonForms>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema);
  });

  it('check if child LabelRenderer exists', () => {
    expect(wrapper.getComponent(LabelRenderer));
  });

  it('renders a label', () => {
    expect(wrapper.find('label').exists()).toBe(true);
  });

  it('renders label text', () => {
    expect(wrapper.find('label').text()).toEqual('My Label');
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
