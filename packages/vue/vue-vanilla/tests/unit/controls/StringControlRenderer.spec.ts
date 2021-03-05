import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My String'
};
const uischema = {
  type: 'Control',
  scope: '#'
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
    const select = wrapper.find('input');
    await select.setValue('b');
    expect(wrapper.vm.data).to.equal('b');
  });
});
