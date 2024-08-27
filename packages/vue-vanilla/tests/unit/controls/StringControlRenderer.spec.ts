import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My String',
};
const uischema = {
  type: 'Control',
  scope: '#',
  options: {
    placeholder: 'string placeholder',
  },
};

const schemaRequired = {
  type: 'object',
  properties: {
    a: {
      type: 'string',
    },
  },
  required: ['a'],
};
const uischemaRequired = {
  type: 'Control',
  scope: '#/properties/a',
  options: {
    hideRequiredAsterisk: true,
  },
};

describe('StringControlRenderer.vue', () => {
  it('renders a string input', () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    expect(wrapper.find('input').exists()).to.be.true;
  });

  it('renders title as label', () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My String');
  });

  it('emits a data change', async () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    const input = wrapper.find('input');
    await input.setValue('b');
    expect(wrapper.vm.data).to.equal('b');
  });

  it('should have a placeholder', async () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    const input = wrapper.find('input');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).to.equal('string placeholder');
  });

  it('should have a lable with required class and asterisk symbol', () => {
    const wrapper = mountJsonForms('a', schemaRequired, uischema);
    expect(wrapper.find('label.required span.asterisk').exists()).to.be.true;
  });

  it('should have a lable with required class but asterisk symbol is hidden', () => {
    const wrapper = mountJsonForms('a', schemaRequired, uischemaRequired);
    expect(wrapper.find('label.required span.asterisk').exists()).to.be.false;
  });
});
