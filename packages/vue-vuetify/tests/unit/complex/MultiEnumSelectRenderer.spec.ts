import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds } from '@jsonforms/core';
import MultiEnumSelectRenderer from '../../../src/complex/MultiEnumSelectRenderer.vue';
import { entry as multiEnumSelectRendererEntry } from '../../../src/complex/MultiEnumSelectRenderer.entry';
import { mountJsonForms } from '../util';

describe('MultiEnumSelectRenderer.vue', () => {
  const renderers = [multiEnumSelectRendererEntry];

  describe('with enum schema', () => {
    const schema = {
      type: 'array',
      title: 'My Multi Select',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['a', 'b', 'c'],
      },
    };
    const uischema = {
      type: 'Control',
      scope: '#',
      options: {
        format: 'multiselect',
      },
    };

    let wrapper: ReturnType<typeof mountJsonForms>;

    beforeEach(() => {
      clearAllIds();
      wrapper = mountJsonForms(['a'], schema, renderers, uischema);
    });

    it('check if child MultiEnumSelectRenderer exists', () => {
      expect(wrapper.getComponent(MultiEnumSelectRenderer)).toBeTruthy();
    });

    it('renders a select input', () => {
      expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    });

    it('renders title as label', () => {
      expect(wrapper.find('label').text()).toEqual('My Multi Select');
    });

    it('emits change when an item is selected', async () => {
      const select = wrapper.findComponent({ name: 'VSelect' });
      await select.vm.$emit('update:modelValue', ['a', 'b']);

      const component = wrapper.getComponent(MultiEnumSelectRenderer);
      expect(component.vm.control.data).toEqual(['a', 'b']);
    });

    it('emits change when an item is deselected', async () => {
      const select = wrapper.findComponent({ name: 'VSelect' });
      await select.vm.$emit('update:modelValue', ['a']);

      const component = wrapper.getComponent(MultiEnumSelectRenderer);
      expect(component.vm.control.data).toEqual(['a']);
    });

    it('emits change when cleared via empty array', async () => {
      const select = wrapper.findComponent({ name: 'VSelect' });
      await select.vm.$emit('update:modelValue', []);

      const component = wrapper.getComponent(MultiEnumSelectRenderer);
      expect(component.vm.control.data).toBeUndefined();
    });

    it('emits change when cleared', async () => {
      const select = wrapper.findComponent({ name: 'VSelect' });
      await select.vm.$emit('update:modelValue', null);

      const component = wrapper.getComponent(MultiEnumSelectRenderer);
      expect(component.vm.control.data).toEqual(undefined);
    });

    it('should render component and match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('with oneOf schema', () => {
    const schema = {
      type: 'array',
      title: 'My OneOf Multi Select',
      uniqueItems: true,
      items: {
        oneOf: [
          { const: 'a', title: 'Option A' },
          { const: 'b', title: 'Option B' },
          { const: 'c', title: 'Option C' },
        ],
      },
    };
    const uischema = {
      type: 'Control',
      scope: '#',
      options: {
        format: 'multiselect',
      },
    };

    let wrapper: ReturnType<typeof mountJsonForms>;

    beforeEach(() => {
      clearAllIds();
      wrapper = mountJsonForms(['b'], schema, renderers, uischema);
    });

    it('check if child MultiEnumSelectRenderer exists', () => {
      expect(wrapper.getComponent(MultiEnumSelectRenderer)).toBeTruthy();
    });

    it('should render component and match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
