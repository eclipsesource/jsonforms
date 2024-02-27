import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
};
const uischema = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'A',
      elements: [
        {
          type: 'Control',
          scope: '#',
        },
      ],
    },
    {
      type: 'Category',
      label: 'B',
      elements: [],
    },
  ],
};

describe('CategorizationRenderer.vue', () => {
  it('renders categorization', () => {
    const wrapper = mountJsonForms('', schema, uischema);
    expect(wrapper.find('.categorization').exists()).to.be.true;
  });

  it('renders 2 category items', async () => {
    const wrapper = mountJsonForms('', schema, uischema);
    const inputs = wrapper.findAll('.categorization-category > *');
    expect(inputs.length).to.equal(2);
  });

  it('renders 1 panel item', async () => {
    const wrapper = mountJsonForms('', schema, uischema);
    const inputs = wrapper.findAll('.categorization-panel > *');
    expect(inputs.length).to.equal(1);
  });
});
