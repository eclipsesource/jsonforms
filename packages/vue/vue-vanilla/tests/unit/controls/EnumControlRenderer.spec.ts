import { expect } from 'chai';
import { addRemoveWhenEmptyOption, mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My Enum',
  enum: ['a', 'b']
};
const uischema = {
  type: 'Control',
  scope: '#'
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

  describe('removeWhenEmpty: true', () => {
    const rweUischema = addRemoveWhenEmptyOption(uischema);

    it('data should be undefined', async () => {
      const wrapper = mountJsonForms('a', schema, rweUischema);
      const select = wrapper.find('select');
      await select.setValue('b');
      await select.setValue('');
      expect(wrapper.vm.data).to.equal(undefined);
    });
  });
});
