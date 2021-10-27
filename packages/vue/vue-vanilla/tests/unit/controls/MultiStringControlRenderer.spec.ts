import { expect } from 'chai';
import { merge } from 'lodash';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My Multi String'
};
const uischema = {
  type: 'Control',
  scope: '#',
  options: {
    multi: true
  }
};

describe('MultiStringControlRenderer.vue', () => {
  it('renders a text area', () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    expect(wrapper.find('textarea').exists()).to.be.true;
  });

  it('renders title as label', () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My Multi String');
  });

  it('emits a data change', async () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    const textarea = wrapper.find('textarea');
    await textarea.setValue('b');
    expect(wrapper.vm.data).to.equal('b');
  });

  describe('removeWhenEmpty: true', () => {
    const rweUischema = merge(uischema, { options: { removeWhenEmpty: true } });

    it('data should be undefined', async () => {
      const wrapper = mountJsonForms('a', schema, rweUischema);
      const textarea = wrapper.find('textarea');
      await textarea.setValue('b');
      await textarea.setValue('');
      expect(wrapper.vm.data).to.equal(undefined);
    });
  });
});
