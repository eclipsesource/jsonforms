import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schemaWithVariousTypes = {
  type: 'object',
  properties: {
    oneOfProp: {
      title: 'Boolean or Array',
      oneOf: [
        {
          title: 'Boolean',
          type: 'boolean',
        },
        {
          title: 'Array',
          type: 'array',
          items: {
            type: 'string',
          },
        },
        {
          title: 'Object',
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      ],
    },
  },
};

const uischemaWithVariousTypes = {
  type: 'Control',
  scope: '#/properties/oneOfProp',
};

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
  it('shows confirmation dialog when switching from boolean true to array', async () => {
    const wrapper = mountJsonForms(
      { oneOfProp: true },
      schemaWithVariousTypes,
      uischemaWithVariousTypes
    );
    const oneOfSelect = wrapper.find('select');
    const dialog = wrapper.find('dialog');

    expect(oneOfSelect.element.value).to.equal('0');
    expect(dialog.element.open).to.be.false;

    await oneOfSelect.setValue('1');

    expect(dialog.element.open).to.be.true;
  });

  it('shows confirmation dialog when switching from boolean false to array', async () => {
    const wrapper = mountJsonForms(
      { oneOfProp: false },
      schemaWithVariousTypes,
      uischemaWithVariousTypes
    );
    const oneOfSelect = wrapper.find('select');
    const dialog = wrapper.find('dialog');

    expect(oneOfSelect.element.value).to.equal('0');
    expect(dialog.element.open).to.be.false;

    await oneOfSelect.setValue('1');

    expect(dialog.element.open).to.be.true;
  });

  it('allows adding items after switching from boolean to array', async () => {
    const wrapper = mountJsonForms(
      { oneOfProp: true },
      schemaWithVariousTypes,
      uischemaWithVariousTypes
    );
    const oneOfSelect = wrapper.find('select');

    await oneOfSelect.setValue('1');

    const confirmButton = wrapper.find('dialog button:last-child');
    await confirmButton.trigger('click');

    const addButton = wrapper.find('.array-list-add');
    await addButton.trigger('click');

    expect(wrapper.vm.data).to.deep.equal({ oneOfProp: [''] });
  });

  it('does not show confirmation dialog when switching from undefined to array', async () => {
    const wrapper = mountJsonForms(
      {},
      schemaWithVariousTypes,
      uischemaWithVariousTypes
    );
    const oneOfSelect = wrapper.find('select');
    const dialog = wrapper.find('dialog');

    await oneOfSelect.setValue('1');

    expect(dialog.element.open).to.be.false;
    expect(wrapper.vm.data).to.deep.equal({});
  });

  it('allows adding items after switching from object to array', async () => {
    const wrapper = mountJsonForms(
      { oneOfProp: { name: 'test' } },
      schemaWithVariousTypes,
      uischemaWithVariousTypes
    );
    const oneOfSelect = wrapper.find('select');

    expect(oneOfSelect.element.value).to.equal('2');

    await oneOfSelect.setValue('1');

    const confirmButton = wrapper.find('dialog button:last-child');
    await confirmButton.trigger('click');

    const addButton = wrapper.find('.array-list-add');
    await addButton.trigger('click');

    expect(wrapper.vm.data).to.deep.equal({ oneOfProp: [''] });
  });

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
