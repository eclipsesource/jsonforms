import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My Time',
  format: 'time'
};
const uischema = {
  type: 'Control',
  scope: '#'
};

describe('TimeControlRenderer.vue', () => {
  it('renders a time input', () => {
    const wrapper = mountJsonForms('00:20', schema, uischema);
    expect(wrapper.find('input[type="time"]').exists()).to.be.true;
  });

  it('renders title as label', () => {
    const wrapper = mountJsonForms('00:20', schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My Time');
  });

  it('emits a data change', async () => {
    const wrapper = mountJsonForms('00:20', schema, uischema);
    const select = wrapper.find('input');
    await select.setValue('01:51');
    expect(wrapper.vm.data).to.equal('01:51');
  });
});
