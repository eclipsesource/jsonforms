import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'integer',
  title: 'My Integer',
};
const uischema = {
  type: 'Control',
  scope: '#',
};

describe('IntegerControlRenderer.vue', () => {
  it('renders a number input', () => {
    const wrapper = mountJsonForms(1, schema, uischema);
    expect(wrapper.find('input[type="number"]').exists()).to.be.true;
  });

  it('renders title as label', () => {
    const wrapper = mountJsonForms(1, schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My Integer');
  });

  it('emits a data change', async () => {
    const wrapper = mountJsonForms(1, schema, uischema);
    const input = wrapper.find('input');
    await input.setValue(2);
    expect(wrapper.vm.data).to.equal(2);
  });
});
