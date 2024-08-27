import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schemaOneOfMultiEnum = {
  properties: {
    oneOfMultiEnum: {
      type: 'array',
      uniqueItems: true,
      items: {
        oneOf: [
          {
            const: 'foo',
            title: 'Foo',
          },
          {
            const: 'bar',
            title: 'Bar',
          },
          {
            const: 'foobar',
            title: 'FooBar',
          },
        ],
      },
    },
  },
};

const schemaMultiEnum = {
  properties: {
    multiEnum: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['foo', 'bar', 'foobar'],
      },
    },
  },
};

const uischema = {
  type: 'Control',
  scope: '#',
};

describe('EnumArrayRenderer.vue oneOfMultiEnum', () => {
  it('renders checkboxes', () => {
    const wrapper = mountJsonForms(
      { oneOfMultiEnum: ['foo', 'bar'] },
      schemaOneOfMultiEnum,
      uischema
    );
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes.length).to.equal(3);
  });

  it('emits a data remove change', async () => {
    const wrapper = mountJsonForms(
      { oneOfMultiEnum: ['foo', 'bar'] },
      schemaOneOfMultiEnum,
      uischema
    );
    const input = wrapper.find('input[value="foo"]');
    await input.trigger('click');
    expect(wrapper.vm.data).to.eql({ oneOfMultiEnum: ['bar'] });
  });

  it('emits a data add change', async () => {
    const wrapper = mountJsonForms(
      { oneOfMultiEnum: ['foo', 'bar'] },
      schemaOneOfMultiEnum,
      uischema
    );
    const input = wrapper.find('input[value="foobar"]');
    await input.trigger('click');
    expect(wrapper.vm.data).to.eql({
      oneOfMultiEnum: ['foo', 'bar', 'foobar'],
    });
  });
});

describe('EnumArrayRenderer.vue multiEnum', () => {
  it('renders checkboxes', () => {
    const wrapper = mountJsonForms(
      { multiEnum: ['foo', 'bar'] },
      schemaMultiEnum,
      uischema
    );
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes.length).to.equal(3);
  });

  it('emits a data remove change', async () => {
    const wrapper = mountJsonForms(
      { multiEnum: ['foo', 'bar'] },
      schemaMultiEnum,
      uischema
    );
    const input = wrapper.find('input[value="foo"]');
    await input.trigger('click');
    expect(wrapper.vm.data).to.eql({ multiEnum: ['bar'] });
  });

  it('emits a data add change', async () => {
    const wrapper = mountJsonForms(
      { multiEnum: ['foo', 'bar'] },
      schemaMultiEnum,
      uischema
    );
    const input = wrapper.find('input[value="foobar"]');
    await input.trigger('click');
    expect(wrapper.vm.data).to.eql({
      multiEnum: ['foo', 'bar', 'foobar'],
    });
  });
});
