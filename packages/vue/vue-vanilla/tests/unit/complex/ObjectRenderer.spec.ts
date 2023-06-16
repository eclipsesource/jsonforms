import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  properties: {
    nested: {
      title: 'My Object',
      properties: {
        a: {
          type: 'string',
        },
        b: {
          type: 'boolean',
        },
      },
    },
  },
};
const uischema = {
  type: 'Control',
  scope: '#',
};

describe('ObjectRenderer.vue', () => {
  it('renders a fieldset', () => {
    const wrapper = mountJsonForms(
      { nested: { a: 'a', b: true } },
      schema,
      uischema
    );
    expect(wrapper.find('fieldset').exists()).to.be.true;
  });

  it('renders group label', () => {
    const wrapper = mountJsonForms(
      { nested: { a: 'a', b: true } },
      schema,
      uischema
    );
    expect(wrapper.find('legend').text()).to.equal('My Object');
  });

  it('renders children', () => {
    const wrapper = mountJsonForms(
      { nested: { a: 'a', b: true } },
      schema,
      uischema
    );
    const inputs = wrapper.findAll('input');
    expect(inputs.length).to.equal(2);
  });
});
