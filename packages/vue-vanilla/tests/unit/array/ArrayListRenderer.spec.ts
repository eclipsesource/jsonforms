import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'array',
  title: 'My Array',
  maxItems: 3,
  minItems: 1,
  items: {
    type: 'string',
  },
};
const uischema = {
  type: 'Control',
  scope: '#',
  options: {
    restrict: true,
  },
};

const schemaWithNameAndRate = {
  type: 'array',
  title: 'My Array',
  maxItems: 3,
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      rate: {
        type: 'number',
      },
    },
  },
};

const schemaWithCountAndName = {
  type: 'array',
  title: 'My Array',
  maxItems: 3,
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      count: {
        type: 'number',
      },
      name: {
        type: 'string',
      },
    },
  },
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

  it('add button disabled if maxItems is reached', async () => {
    const wrapper = mountJsonForms(['a', 'b'], schema, uischema);
    const addButton = wrapper.find('.array-list-add');
    expect(addButton.attributes().disabled).to.not.exist;
    await addButton.trigger('click');
    expect(addButton.attributes().disabled).to.exist;
  });

  it('remove element from array', async () => {
    const wrapper = mountJsonForms(['a', 'b', 'c'], schema, uischema);
    const deleteButtons = wrapper.findAll('.array-list-item-delete');
    await deleteButtons[1].trigger('click');
    expect(wrapper.vm.data).to.deep.equal(['a', 'c']);
  });

  it('remove button disabled if minItems is reached', async () => {
    const wrapper = mountJsonForms(['a', 'b'], schema, uischema);
    const deleteButtons = wrapper.findAll('.array-list-item-delete');
    expect(deleteButtons[0].attributes().disabled).to.not.exist;
    expect(deleteButtons[1].attributes().disabled).to.not.exist;
    await deleteButtons[0].trigger('click');
    expect(deleteButtons[0].attributes().disabled).to.exist;
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

  it('compute default label', async () => {
    const wrapper = mountJsonForms(
      [{ name: 'name1', rate: 5 }],
      schemaWithNameAndRate,
      uischema
    );
    const labels = wrapper.findAll('.array-list-item-label');
    const labelText = labels[0].text();
    expect(labelText).to.equal('name1');
  });

  it('compute default label with undefined', async () => {
    const wrapper = mountJsonForms([{}], schemaWithNameAndRate, uischema);
    const labels = wrapper.findAll('.array-list-item-label');
    const labelText = labels[0].text();
    expect(labelText).to.equal('');
  });

  it('compute default label with number', async () => {
    const wrapper = mountJsonForms(
      [{ count: 1, name: 'name1' }],
      schemaWithCountAndName,
      uischema
    );
    const labels = wrapper.findAll('.array-list-item-label');
    const labelText = labels[0].text();
    expect(labelText).to.equal('1');
  });

  it('compute default label with NaN', async () => {
    const wrapper = mountJsonForms(
      [{ count: Number(undefined), name: 'name1' }],
      schemaWithCountAndName,
      uischema
    );
    const labels = wrapper.findAll('.array-list-item-label');
    const labelText = labels[0].text();
    expect(labelText).to.equal('');
  });
});
