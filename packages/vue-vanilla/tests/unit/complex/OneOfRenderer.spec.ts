import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  title: 'My Object',
  oneOf: [
    {
      title: 'Variant A',
      properties: {
        variant: {
          const: 'a',
        },
        a: {
          type: 'string',
        },
      },
    },
    {
      title: 'Variant B',
      properties: {
        variant: {
          const: 'b',
        },
        b: {
          type: 'string',
        },
      },
    },
  ],
};
const uischema = {
  type: 'Control',
  scope: '#',
};

describe('OneOfRenderer.vue', () => {
  it('render has a class', () => {
    const wrapper = mountJsonForms({ variant: 'b', b: 'b' }, schema, uischema);
    expect(wrapper.find('div.one-of').exists()).to.be.true;
  });

  it('renders select label', () => {
    const wrapper = mountJsonForms({ variant: 'b', b: 'b' }, schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My Object');
  });

  it('renders select', () => {
    const wrapper = mountJsonForms({ variant: 'b', b: 'b' }, schema, uischema);
    const select = wrapper.find('select');
    expect(select.element.value).to.equal('1');
    expect(
      select.findAll('option').map((option) => option.element.label)
    ).to.eql(['Variant A', 'Variant B']);
  });

  it('renders variant-specific children only', () => {
    const wrapper = mountJsonForms({ variant: 'b', b: 'b' }, schema, uischema);
    const inputs = wrapper.findAll('input');
    expect(inputs.length).to.equal(1);
    expect(inputs[0].element.value).to.equal('b');
  });
});
