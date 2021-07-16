import { expect } from 'chai';
import { merge } from 'lodash';
import { mountJsonForms } from '../util';

const schema = {
  type: 'boolean',
  title: 'My Boolean'
};
const uischema = {
  type: 'Control',
  scope: '#',
  options: {
    placeholder: 'boolean placeholder'
  }
};

describe('BooleanControlRenderer.vue', () => {
  it('renders a checkbox', () => {
    const wrapper = mountJsonForms(true, schema, uischema);
    expect(wrapper.find('input[type="checkbox"]').exists()).to.be.true;
  });

  it('renders title as label', () => {
    const wrapper = mountJsonForms(true, schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My Boolean');
  });

  it('emits a data change', async () => {
    const wrapper = mountJsonForms(true, schema, uischema);
    const input = wrapper.find('input');
    await input.trigger('click');
    expect(wrapper.vm.data).to.equal(false);
  });

  it('should have a placeholder', async () => {
    const wrapper = mountJsonForms(true, schema, uischema);
    const input = wrapper.find('input');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).to.equal('boolean placeholder');
  });

  describe('removeWhenEmpty: true', () => {
    const rweUischema = merge(uischema, { options: { removeWhenEmpty: true } });

    it('data should be false', async () => {
      const wrapper = mountJsonForms(true, schema, rweUischema);
      const input = wrapper.find('input');
      await input.trigger('click');
      expect(wrapper.vm.data).to.equal(false);
    });
  });
});
