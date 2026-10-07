import { JsonFormsUISchemaRegistryEntry, Generate } from '@jsonforms/core';
import { shallowMount } from '@vue/test-utils';
import { JsonForms } from '../../src';
import { bindings } from '../testHelper';

describe('JsonForms.vue', () => {
  it('uses undefined as schema prop when not given', () => {
    const data = { number: 5 };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data, renderers },
      })
    );
    expect((wrapper as any).props('schema')).toBe(undefined);
  });

  it('generates schema when not given via prop', () => {
    const data = { number: 5.5 };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data, renderers },
      })
    );
    expect((wrapper.vm as any).jsonforms.core.schema).toEqual(
      Generate.jsonSchema(data)
    );
  });

  it('passes the validator prop to core and uses its issues', () => {
    const data = { number: 5.5 };
    const schema = {
      type: 'object',
      properties: { number: { type: 'number' } },
    };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const validator = () => ({
      validate: () => [
        { path: '/number', key: 'custom', message: 'custom says no' },
      ],
    });
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data, schema, renderers, validator },
      })
    );
    const core = (wrapper.vm as any).jsonforms.core;
    expect(core.validatorOption).toBe(validator);
    expect(core.errors).toHaveLength(1);
    expect(core.errors[0].instancePath).toBe('/number');
    expect(core.errors[0].keyword).toBe('custom');
    expect(core.errors[0].message).toBe('custom says no');
  });

  it('generates ui schema when not given via prop', () => {
    const data = { number: 5.5 };
    const schema = {
      type: 'object',
      properties: { number: { type: 'number' } },
    };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data, schema, renderers },
      })
    );
    expect((wrapper.vm as any).jsonforms.core.uischema).toEqual(
      Generate.uiSchema(schema)
    );
  });
});
