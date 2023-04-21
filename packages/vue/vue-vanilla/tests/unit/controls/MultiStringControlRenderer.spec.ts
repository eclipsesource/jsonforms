import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My Multi String',
};
const uischema = {
  type: 'Control',
  scope: '#',
  options: {
    multi: true,
  },
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
    const select = wrapper.find('textarea');
    await select.setValue('b');
    expect(wrapper.vm.data).to.equal('b');
  });
});
