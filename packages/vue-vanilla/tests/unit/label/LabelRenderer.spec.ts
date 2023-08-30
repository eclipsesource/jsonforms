import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
};
const uischema = {
  type: 'Label',
  text: 'My Label',
};

describe('LabelRenderer.vue', () => {
  it('renders a label', () => {
    const wrapper = mountJsonForms('', schema, uischema);
    expect(wrapper.find('label').exists()).to.be.true;
  });

  it('renders label text', () => {
    const wrapper = mountJsonForms('', schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My Label');
  });
});
