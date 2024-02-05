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

const uischemaStepper = {
  ...uischema,
  options: {
    variant: 'stepper',
  },
};
const uischemaStepperNav = {
  ...uischema,
  options: {
    variant: 'stepper',
    showNavButtons: true,
  },
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

  it('renders categorization as stepper', () => {
    const wrapper = mountJsonForms('', schema, uischemaStepper);
    expect(wrapper.find('.categorization-stepper').exists()).to.be.true;
  });

  it('renders 2 stepper items and one line', () => {
    const wrapper = mountJsonForms('', schema, uischemaStepper);
    const inputs = wrapper.findAll('.categorization-stepper > div');
    expect(inputs.length).to.equal(2);
    const lines = wrapper.findAll('.categorization-stepper > hr');
    expect(lines.length).to.equal(1);
  });

  it('renders a next button at stepper nav bar', () => {
    const wrapper = mountJsonForms('', schema, uischemaStepperNav);
    expect(
      wrapper
        .find(
          '.categorization footer.categorization-stepper-footer > div.categorization-stepper-button-next'
        )
        .exists()
    ).to.be.true;
  });
});
