import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'array',
  title: 'My Array',
  items: {
    type: 'string',
  },
};
const uischema = {
  type: 'Control',
  scope: '#',
};

describe('ArrayListRenderer.vue', () => {
  it('renders a fieldset', () => {
    const wrapper = mountJsonForms(['a'], schema, uischema);
    expect(wrapper.find('fieldset').exists()).to.be.true;
  });

  it('renders group label', () => {
    const wrapper = mountJsonForms(['a'], schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My Array');
  });

  it('renders children', () => {
    const wrapper = mountJsonForms(['a', 'b'], schema, uischema);
    const inputs = wrapper.findAll('input');
    expect(inputs.length).to.equal(2);
  });

  it('add element to array', async () => {
    const wrapper = mountJsonForms(['a', 'b'], schema, uischema);
    const addButton = wrapper.find('.array-list-add');
    await addButton.trigger('click');
    expect(wrapper.vm.data).to.deep.equal(['a', 'b', '']);
  });

  it('remove element from array', async () => {
    const wrapper = mountJsonForms(['a', 'b', 'c'], schema, uischema);
    const deleteButtons = wrapper.findAll('.array-list-item-delete');
    await deleteButtons[1].trigger('click');
    expect(wrapper.vm.data).to.deep.equal(['a', 'c']);
  });

  it('move element up', async () => {
    const wrapper = mountJsonForms(['a', 'b', 'c'], schema, uischema);
    const moveUpButtons = wrapper.findAll('.array-list-item-move-up');
    await moveUpButtons[1].trigger('click');
    expect(wrapper.vm.data).to.deep.equal(['b', 'a', 'c']);
  });

  it('move element up', async () => {
    const wrapper = mountJsonForms(['a', 'b', 'c'], schema, uischema);
    const moveDownButtons = wrapper.findAll('.array-list-item-move-down');
    await moveDownButtons[1].trigger('click');
    expect(wrapper.vm.data).to.deep.equal(['a', 'c', 'b']);
  });

  it('all buttons have type button', async () => {
    const wrapper = mountJsonForms(['a'], schema, uischema);
    const buttons = wrapper.findAll('button');
    for (const button of buttons) {
      const type = button.attributes('type');
      expect(type).to.equal('button');
    }
  });
});
