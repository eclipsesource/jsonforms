import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My Date',
  format: 'date',
};
const uischema = {
  type: 'Control',
  scope: '#',
  options: {
    placeholder: 'date placeholder',
  },
};

describe('DateControlRenderer.vue', () => {
  it('renders a date input', () => {
    const wrapper = mountJsonForms('2021-03-09', schema, uischema);
    expect(wrapper.find('input[type="date"]').exists()).to.be.true;
  });

  it('renders title as label', () => {
    const wrapper = mountJsonForms('2021-03-09', schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My Date');
  });

  it('emits a data change', async () => {
    const wrapper = mountJsonForms('2021-03-09', schema, uischema);
    const input = wrapper.find('input');
    await input.setValue('2021-03-10');
    await input.trigger('blur');
    expect(wrapper.vm.data).to.equal('2021-03-10');
  });

  it('should have a placeholder', async () => {
    const wrapper = mountJsonForms('2021-03-09', schema, uischema);
    const input = wrapper.find('input');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).to.equal('date placeholder');
  });
});
