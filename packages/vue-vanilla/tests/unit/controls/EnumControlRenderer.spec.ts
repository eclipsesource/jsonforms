import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My Enum',
  enum: ['a', 'b'],
};
const uischema = {
  type: 'Control',
  scope: '#',
};

describe('EnumControlRenderer.vue', () => {
  it('renders a select input', () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    expect(wrapper.find('select').exists()).to.be.true;
  });

  it('renders title as label', () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My Enum');
  });

  it('emits a data change', async () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    const select = wrapper.find('select');
    await select.setValue('b');
    expect(wrapper.vm.data).to.equal('b');
  });

  it('emits undefined when empty option is selected', async () => {
    const wrapper = mountJsonForms('a', schema, uischema);
    const select = wrapper.find('select');
    await select.setValue('');
    expect(wrapper.vm.data).to.be.undefined;
  });
});

const numberSchema = {
  type: 'integer',
  title: 'My Integer Enum',
  enum: [1, 2],
};

describe('EnumControlRenderer.vue (integer)', () => {
  it('emits a data change with number type', async () => {
    const wrapper = mountJsonForms(1, numberSchema, uischema);
    const select = wrapper.find('select');
    await select.setValue('2');
    expect(wrapper.vm.data).to.be.a('number');
    expect(wrapper.vm.data).to.equal(2);
  });
});
