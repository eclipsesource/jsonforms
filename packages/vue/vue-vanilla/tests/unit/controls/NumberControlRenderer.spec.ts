import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'number',
  title: 'My Number',
};
const uischema = {
  type: 'Control',
  scope: '#',
  options: {
    placeholder: 'number placeholder',
  },
};

describe('NumberControlRenderer.vue', () => {
  it('renders a number input', () => {
    const wrapper = mountJsonForms(1, schema, uischema);
    expect(wrapper.find('input[type="number"]').exists()).to.be.true;
  });

  it('renders title as label', () => {
    const wrapper = mountJsonForms(1, schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My Number');
  });

  it('emits a data change', async () => {
    const wrapper = mountJsonForms(1, schema, uischema);
    const input = wrapper.find('input');
    await input.setValue(2);
    expect(wrapper.vm.data).to.equal(2);
  });

  it('should have a placeholder', async () => {
    const wrapper = mountJsonForms(1, schema, uischema);
    const input = wrapper.find('input');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).to.equal('number placeholder');
  });
});
