import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My OneOf Enum',
  oneOf: [
    { const: 'a', title: 'Foo' },
    { const: 'b', title: 'Bar' },
  ],
};
const uischema = {
  type: 'Control',
  scope: '#',
};

describe('EnumOneOfControlRenderer.vue', () => {
  it('renders a select input', () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    expect(wrapper.find('select').exists()).to.be.true;
  });

  it('renders title as label', () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My OneOf Enum');
  });

  it('emits a data change', async () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    const select = wrapper.find('select');
    await select.setValue('b');
    expect(wrapper.vm.data).to.equal('b');
  });
});
