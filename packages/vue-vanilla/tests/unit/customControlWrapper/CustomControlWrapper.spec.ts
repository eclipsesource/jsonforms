import { expect } from 'chai';
import { mountJsonFormsWithCustomControlWrapper } from '../util';

const schema = {
  type: 'string',
};
const uischema = {
  type: 'Control',
  scope: '#',
};

describe('CustomControlWrapper.vue', () => {
  it('renders a custom control wrapper', () => {
    const wrapper = mountJsonFormsWithCustomControlWrapper(
      '',
      schema,
      uischema
    );
    expect(wrapper.find('.customWrapper').exists()).to.be.true;
  });
});
