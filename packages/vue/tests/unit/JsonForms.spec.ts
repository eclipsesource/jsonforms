import {
  Actions,
  JsonFormsUISchemaRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
  Generate,
  Middleware,
  createAjv,
} from '@jsonforms/core';
import {
  defineComponent,
  h,
  isReactive,
  nextTick,
  reactive,
  shallowReactive,
  watch,
} from 'vue';
import { flushPromises, mount, shallowMount } from '@vue/test-utils';
import { JsonForms } from '../../src';
import { bindings } from '../testHelper';

/**
 * Mounts a form as a child of an application.
 *
 * `@vue/test-utils` keeps the props of a mount in `reactive()`, thus a plain
 * object of a test reaches `JsonForms` as a proxy. Vue keeps the props of a
 * component shallow, thus a parent gives the object itself. The
 * `shallowReactive` state of this parent replaces a prop.
 */
const mountInParent = (props: Record<string, unknown>) => {
  const state = shallowReactive({ ...props });
  const parent = mount(
    defineComponent({
      render: () => h(JsonForms as any, { ...state }),
    })
  );
  const vm = () => parent.findComponent(JsonForms).vm as any;
  return {
    state,
    jsonforms: () => vm().jsonforms,
    core: () => vm().jsonforms.core,
  };
};

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

  it('does not emit update:data on mount when data is unchanged', () => {
    const data = { number: 5.5 };
    const wrapper = shallowMount(
      JsonForms,
      bindings({ props: { data, renderers: [] } })
    );

    expect(wrapper.emitted('update:data')).toBeUndefined();
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('only emits change when validation-related props change without changing data', async () => {
    const data = { number: 5.5 };
    const wrapper = shallowMount(
      JsonForms,
      bindings({ props: { data, renderers: [] } })
    );

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
    expect(wrapper.emitted('change')).toHaveLength(2);
    expect(wrapper.emitted('update:data')).toBeUndefined();

    await wrapper.setProps({
      schema: {
        type: 'object',
        properties: { number: { type: 'number', minimum: 7 } },
      },
    });
    expect(wrapper.emitted('change')).toHaveLength(3);
    expect(wrapper.emitted('update:data')).toBeUndefined();

    await wrapper.setProps({ validationMode: 'NoValidation' });
    expect(wrapper.emitted('change')).toHaveLength(4);
    expect(wrapper.emitted('update:data')).toBeUndefined();
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

  it.each([undefined, null])(
    'regenerates schema and uischema for external data changes with schema %s',
    async (schema) => {
      const data = { number: 5.5 };
      const nextData = { number: 5.5, text: 'hello' };
      const renderers: JsonFormsUISchemaRegistryEntry[] = [];
      const wrapper = shallowMount(
        JsonForms,
        bindings({
          props: { data, schema, renderers },
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
    }
  );

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

  it('adds no reactivity to the given schema and ui schema', () => {
    const data = { number: 5.5 };
    const schema = {
      type: 'object',
      properties: { number: { type: 'number' } },
    };
    const uischema = {
      type: 'Control',
      scope: '#/properties/number',
    };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const form = mountInParent({ data, schema, uischema, renderers });
    const core = form.core();

    expect(isReactive(core.schema)).toBe(false);
    expect(isReactive(core.uischema)).toBe(false);
    // A renderer gets the original nested nodes, and not proxies of them.
    expect(core.schema).toBe(schema);
    expect(core.schema.properties.number).toBe(schema.properties.number);
    expect(core.uischema).toBe(uischema);
    expect(isReactive(core.data)).toBe(false);
    expect(core.data).toBe(data);
  });

  it('adds no reactivity to a generated schema and ui schema', () => {
    const data = { number: 5.5 };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const core = mountInParent({ data, renderers }).core();

    expect(isReactive(core.schema)).toBe(false);
    expect(isReactive(core.uischema)).toBe(false);
  });

  it('applies a new schema prop to the core state', async () => {
    const data = { number: 5.5 };
    const schema = {
      type: 'object',
      properties: { number: { type: 'number' } },
    };
    const newSchema = {
      type: 'object',
      properties: { number: { type: 'string' } },
    };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const form = mountInParent({ data, schema, renderers });
    expect(form.core().schema).toBe(schema);
    expect(form.core().errors).toHaveLength(0);

    form.state.schema = newSchema;
    await flushPromises();

    expect(form.core().schema).toBe(newSchema);
    // The validation runs again for the new schema.
    expect(form.core().errors).toHaveLength(1);
  });

  it('applies a new ui schema prop to the core state', async () => {
    const data = { number: 5.5 };
    const schema = {
      type: 'object',
      properties: { number: { type: 'number' } },
    };
    const uischema = { type: 'Control', scope: '#/properties/number' };
    const newUischema = {
      type: 'VerticalLayout',
      elements: [{ type: 'Control', scope: '#/properties/number' }],
    };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const form = mountInParent({ data, schema, uischema, renderers });
    expect(form.core().uischema).toBe(uischema);

    form.state.uischema = newUischema;
    await flushPromises();

    expect(form.core().uischema).toBe(newUischema);
  });

  it('adds no reactivity to the renderers and the cells', async () => {
    const data = { number: 5.5 };
    const stub = { name: 'Stub', template: '<div />' };
    const renderers: JsonFormsRendererRegistryEntry[] = [
      { tester: () => -1, renderer: stub },
    ];
    const cells: JsonFormsCellRendererRegistryEntry[] = [
      { tester: () => -1, cell: stub },
    ];
    const newRenderers: JsonFormsRendererRegistryEntry[] = [
      { tester: () => 1, renderer: stub },
    ];
    const form = mountInParent({ data, renderers, cells });

    // A reactive renderer entry gives the Vue warning for a reactive
    // component, thus an application would need `markRaw` for its set.
    expect(form.jsonforms().renderers).toBe(renderers);
    expect(form.jsonforms().renderers[0].renderer).toBe(stub);
    expect(isReactive(form.jsonforms().renderers)).toBe(false);
    expect(form.jsonforms().cells).toBe(cells);
    expect(isReactive(form.jsonforms().cells)).toBe(false);

    form.state.renderers = newRenderers;
    await flushPromises();

    expect(form.jsonforms().renderers).toBe(newRenderers);
    expect(isReactive(form.jsonforms().renderers)).toBe(false);
  });

  it('adds no reactivity to ajv', () => {
    const data = { number: 5.5 };
    const ajv = createAjv();
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const core = mountInParent({ data, ajv, renderers }).core();

    // Ajv cannot compile a schema through a proxy of itself.
    expect(core.ajv).toBe(ajv);
    expect(isReactive(core.ajv)).toBe(false);
  });

  it('unwraps an ajv that comes from reactive state', () => {
    const data = { number: 5.5 };
    const ajv = createAjv();
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    // An application that keeps `ajv` in `reactive()` gives a proxy of it.
    const core = mountInParent({ data, ajv: reactive(ajv), renderers }).core();

    // Ajv cannot compile a schema through a proxy of itself.
    expect(core.ajv).toBe(ajv);
    expect(core.errors).toHaveLength(0);
  });

  it('unwraps a data, schema and ui schema that come from reactive state', () => {
    const data = { number: 5.5 };
    const schema = {
      type: 'object',
      properties: { number: { type: 'number' } },
    };
    const uischema = {
      type: 'Control',
      scope: '#/properties/number',
    };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    // An application that keeps these values in `reactive()` gives proxies of
    // them.
    const state = reactive({ data, schema, uischema });
    const core = mountInParent({ ...state, renderers }).core();

    expect(core.data).toBe(data);
    expect(core.schema).toBe(schema);
    expect(core.uischema).toBe(uischema);
  });

  it('unwraps a new data, schema and ui schema that come from reactive state', async () => {
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const form = mountInParent({ data: { number: 5.5 }, renderers });
    const data = { number: 6 };
    const schema = {
      type: 'object',
      properties: { number: { type: 'number' } },
    };
    const uischema = {
      type: 'Control',
      scope: '#/properties/number',
    };
    const state = reactive({ data, schema, uischema });
    form.state.data = state.data;
    form.state.schema = state.schema;
    form.state.uischema = state.uischema;
    await nextTick();

    const core = form.core();
    expect(core.data).toBe(data);
    expect(core.schema).toBe(schema);
    expect(core.uischema).toBe(uischema);
  });

  it('adds no reactivity to a generated ajv', () => {
    const data = { number: 5.5 };
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    const core = mountInParent({ data, renderers }).core();

    expect(core.ajv).toBeDefined();
    expect(isReactive(core.ajv)).toBe(false);
  });

  it('leaves the objects of the application untouched', async () => {
    const data = { number: 5.5 };
    const schema = {
      type: 'object',
      properties: { number: { type: 'number' } as Record<string, unknown> },
    };
    const state = reactive({ schema });
    let deepChanges = 0;
    watch(
      () => state.schema,
      () => {
        deepChanges++;
      },
      { deep: true }
    );
    const renderers: JsonFormsUISchemaRegistryEntry[] = [];
    mountInParent({ data, schema: state.schema, renderers });

    // JSON Forms keeps its own state shallow. It writes no flag on the object
    // of the application, thus a deep watcher of the application still runs.
    expect((schema as Record<string, unknown>).__v_skip).toBeUndefined();
    state.schema.properties.number.title = 'Number';
    await nextTick();
    expect(deepChanges).toBe(1);
  });
});
