import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
};
const uischema = {
  type: 'Group',
  label: 'My Group',
  elements: [
    {
      type: 'Control',
      scope: '#',
    },
    {
      type: 'Control',
      scope: '#',
    },
  ],
};

describe('GroupRenderer.vue', () => {
  it('renders a fieldset', () => {
    const wrapper = mountJsonForms('', schema, uischema);
    expect(wrapper.find('fieldset').exists()).to.be.true;
  });

  it('renders group label', () => {
    const wrapper = mountJsonForms('', schema, uischema);
    expect(wrapper.find('legend').text()).to.equal('My Group');
  });

  it('renders children', async () => {
    const wrapper = mountJsonForms('', schema, uischema);
    const inputs = wrapper.findAll('input');
    expect(inputs.length).to.equal(2);
  });
});
