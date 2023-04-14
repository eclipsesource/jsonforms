import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
};
const vertical = {
  type: 'VerticalLayout',
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
const horizontal = {
  ...vertical,
  type: 'HorizontalLayout',
};

describe('LayoutRenderer.vue', () => {
  it('renders a vertical container div', () => {
    const wrapper = mountJsonForms('', schema, vertical);
    expect(wrapper.find('.vertical-layout').exists()).to.be.true;
  });

  it('renders an horizontal container div', () => {
    const wrapper = mountJsonForms('', schema, horizontal);
    expect(wrapper.find('.horizontal-layout').exists()).to.be.true;
  });

  it('renders children', async () => {
    const wrapper = mountJsonForms('', schema, vertical);
    const inputs = wrapper.findAll('input');
    expect(inputs.length).to.equal(2);
  });
});
