import {
  Actions,
  JsonFormsUISchemaRegistryEntry,
  Generate,
  Middleware,
} from '@jsonforms/core';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
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

  it('generates schema for primitive root data', () => {
    const data = 5.5;
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

  it('preserves undefined root data when the data prop is cleared', async () => {
    const data = { number: 5.5 };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data, renderers },
      })
    );

    await wrapper.setProps({ data: undefined });

    expect((wrapper.vm as any).jsonforms.core.data).toBeUndefined();

    const changeEvents = wrapper.emitted('change');
    const latestChangeEvent: any = changeEvents?.[changeEvents.length - 1]?.[0];
    expect(latestChangeEvent?.data).toBeUndefined();
  });

  it('emits update:data when the form data changes', async () => {
    const data = { number: 5.5 };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data, renderers },
      })
    );

    (wrapper.vm as any).dispatch(Actions.update('number', () => 6));
    await nextTick();

    const updateEvents = wrapper.emitted('update:data');
    expect(updateEvents?.[updateEvents.length - 1]?.[0]).toEqual({ number: 6 });
  });

  it('emits middleware-transformed data on mount', () => {
    const middleware: Middleware = (state, action, defaultReducer) => ({
      ...defaultReducer(state, action),
      data: { number: 6 },
    });
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data: { number: 5.5 }, renderers, middleware },
      })
    );

    expect(wrapper.emitted('update:data')).toEqual([[{ number: 6 }]]);
  });

  it('keeps the data prop authoritative when additionalErrors change', async () => {
    const data = { number: 5.5 };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data, renderers },
      })
    );

    (wrapper.vm as any).dispatch(Actions.update('number', () => 6));
    await nextTick();

    await wrapper.setProps({
      additionalErrors: [
        {
          instancePath: '/number',
          schemaPath: '#/properties/number/minimum',
          keyword: 'minimum',
          params: { comparison: '>=', limit: 7 },
        },
      ],
    });

    expect((wrapper.vm as any).jsonforms.core.data).toEqual(data);
  });

  it('preserves edited data when v-model:data is used and additionalErrors change', async () => {
    const data = { number: 5.5 };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data, renderers },
      })
    );

    (wrapper.vm as any).dispatch(Actions.update('number', () => 6));
    await nextTick();

    const updateEvents = wrapper.emitted('update:data');
    const updatedData = updateEvents?.[updateEvents.length - 1]?.[0];
    await wrapper.setProps({ data: updatedData });

    await wrapper.setProps({
      additionalErrors: [
        {
          instancePath: '/number',
          schemaPath: '#/properties/number/minimum',
          keyword: 'minimum',
          params: { comparison: '>=', limit: 7 },
        },
      ],
    });

    expect((wrapper.vm as any).jsonforms.core.data).toEqual({ number: 6 });
  });

  it('does not regenerate schema and uischema when the parent passes back the current form data', async () => {
    const data = { number: 5.5 };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data, renderers },
      })
    );

    const initialSchema = (wrapper.vm as any).schemaToUse;
    const initialUiSchema = (wrapper.vm as any).uischemaToUse;

    (wrapper.vm as any).dispatch(Actions.update('number', () => 6));
    await nextTick();

    await wrapper.setProps({
      data: (wrapper.vm as any).jsonforms.core.data,
    });

    expect((wrapper.vm as any).schemaToUse).toBe(initialSchema);
    expect((wrapper.vm as any).uischemaToUse).toBe(initialUiSchema);
  });

  it('regenerates schema and uischema for external data changes', async () => {
    const data = { number: 5.5 };
    const nextData = { number: 5.5, text: 'hello' };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data, renderers },
      })
    );

    const initialSchema = (wrapper.vm as any).schemaToUse;
    const initialUiSchema = (wrapper.vm as any).uischemaToUse;

    await wrapper.setProps({ data: nextData });

    expect((wrapper.vm as any).schemaToUse).not.toBe(initialSchema);
    expect((wrapper.vm as any).uischemaToUse).not.toBe(initialUiSchema);
    expect((wrapper.vm as any).jsonforms.core.schema).toEqual(
      Generate.jsonSchema(nextData)
    );
  });

  it('does not replace a false schema when data changes', async () => {
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: {
          data: { number: 5.5 },
          schema: false,
          uischema: { type: 'VerticalLayout', elements: [] },
          renderers,
        },
      })
    );

    await wrapper.setProps({ data: { number: 6 } });

    expect((wrapper.vm as any).schemaToUse).toBe(false);
    expect((wrapper.vm as any).jsonforms.core.schema).toBe(false);
  });

  it('does not regenerate schema and uischema when external data keeps the same schema', async () => {
    const data = 'hello';
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const wrapper = shallowMount(
      JsonForms,
      bindings({
        props: { data, renderers },
      })
    );

    const initialSchema = (wrapper.vm as any).schemaToUse;
    const initialUiSchema = (wrapper.vm as any).uischemaToUse;

    await wrapper.setProps({ data: 'world' });

    expect((wrapper.vm as any).schemaToUse).toBe(initialSchema);
    expect((wrapper.vm as any).uischemaToUse).toBe(initialUiSchema);
  });
});
