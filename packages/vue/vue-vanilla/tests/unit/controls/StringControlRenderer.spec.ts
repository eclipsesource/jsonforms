import { expect } from 'chai';
import { merge } from 'lodash';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My String'
};
const uischema = {
  type: 'Control',
  scope: '#',
  options: {
    placeholder: 'string placeholder'
  }
};

describe('StringControlRenderer.vue', () => {
  it('renders a string input', () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    expect(wrapper.find('input').exists()).to.be.true;
  });

  it('renders title as label', () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My String');
  });

  it('emits a data change', async () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    const input = wrapper.find('input');
    await input.setValue('b');
    expect(wrapper.vm.data).to.equal('b');
  });

  it('should have a placeholder', async () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    const input = wrapper.find('input');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).to.equal('string placeholder');
  });

  describe('removeWhenEmpty: true', () => {
    const rweUischema = merge(uischema, { options: { removeWhenEmpty: true } });

    it('data should be undefined', async () => {
      const wrapper = mountJsonForms('a', schema, rweUischema);
      const input = wrapper.find('input');
      await input.setValue('b');
      await input.setValue('');
      expect(wrapper.vm.data).to.equal(undefined);
    });
  });
});
