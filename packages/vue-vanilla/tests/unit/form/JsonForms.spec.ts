import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
};
const uischema = {
  type: 'HorizontalLayout',
  elements: [
    {
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
    },
    {
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
    },
  ],
};
const reducedUiSchema = {
  type: 'HorizontalLayout',
  elements: [
    {
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
    },
  ],
};

describe('JsonForms.vue', () => {
  it('renders all inputs', () => {
    const wrapper = mountJsonForms('', schema, uischema);
    expect(wrapper.findAll('input').length).to.equal(4);
  });

  it('reacts to uischema changes', async () => {
    const wrapper = mountJsonForms('', schema, uischema);
    await wrapper.setProps({
      uischema: reducedUiSchema,
    });
    expect(wrapper.findAll('input').length).to.equal(2);
  });
});
