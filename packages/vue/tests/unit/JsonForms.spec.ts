import {
  JsonFormsUISchemaRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
  Generate,
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
