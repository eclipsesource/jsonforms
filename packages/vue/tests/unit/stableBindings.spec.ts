/* eslint-disable vue/one-component-per-file */
import {
  ControlElement,
  isControl,
  isLayout,
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
} from '@jsonforms/core';
import { mount } from '@vue/test-utils';
import cloneDeep from 'lodash/cloneDeep';
import { defineComponent, h, markRaw, nextTick } from 'vue';
import {
  DispatchRenderer,
  JsonForms,
  rendererProps,
  useJsonFormsControl,
  useJsonFormsLayout,
} from '../../src';

const renders: Record<string, number> = {};
let changeHandlers: Record<string, (path: string, value: unknown) => void> = {};

const TestControl = defineComponent({
  props: rendererProps<ControlElement>(),
  setup(props) {
    const { control, handleChange } = useJsonFormsControl(props);
    changeHandlers[control.value.path] = handleChange;
    return () => {
      const path = control.value.path;
      renders[path] = (renders[path] ?? 0) + 1;
      const min = control.value.uischema.options?.min;
      return h(
        'span',
        min instanceof Date ? min.toISOString() : String(control.value.data)
      );
    };
  },
});

// A layout that dispatches its elements. With `clone`, it gives a new clone of
// each element to the dispatch on each render, as wrapper renderers often do.
const createTestLayout = (clone: boolean) =>
  defineComponent({
    props: rendererProps<Layout>(),
    setup(props) {
      const { layout } = useJsonFormsLayout(props);
      return () =>
        h(
          'div',
          (layout.value.uischema as Layout).elements.map((element) =>
            h(DispatchRenderer, {
              schema: layout.value.schema,
              uischema: clone ? cloneDeep(element) : element,
              path: layout.value.path,
              enabled: layout.value.enabled,
            })
          )
        );
    },
  });

const createRenderers = (clone: boolean): JsonFormsRendererRegistryEntry[] => [
  { tester: rankWith(1, isControl), renderer: markRaw(TestControl) },
  {
    tester: rankWith(1, isLayout),
    renderer: markRaw(createTestLayout(clone)),
  },
];

const renderers = createRenderers(false);

const schema = {
  type: 'object',
  properties: {
    first: { type: 'string' },
    second: { type: 'string' },
  },
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/first' },
    { type: 'Control', scope: '#/properties/second' },
  ],
};

describe('stable bindings', () => {
  beforeEach(() => {
    for (const key of Object.keys(renders)) {
      delete renders[key];
    }
    changeHandlers = {};
  });

  it('does not re-render a control whose bindings did not change', async () => {
    const wrapper = mount(JsonForms, {
      props: {
        data: { first: 'a', second: 'b' },
        schema,
        uischema,
        renderers,
      },
    });
    await nextTick();
    expect(renders).toEqual({ first: 1, second: 1 });

    changeHandlers.first('first', 'changed');
    await nextTick();

    expect(wrapper.text()).toContain('changed');
    expect(renders.first).toBe(2);
    expect(renders.second).toBe(1);
  });

  it('re-renders a control when its bindings change', async () => {
    const wrapper = mount(JsonForms, {
      props: {
        data: { first: 'a', second: 'b' },
        schema,
        uischema,
        renderers,
      },
    });
    await nextTick();

    changeHandlers.second('second', 'changed');
    await nextTick();

    expect(wrapper.text()).toContain('changed');
    expect(renders.first).toBe(1);
    expect(renders.second).toBe(2);
  });

  it('does not re-render a control when its layout dispatches a cloned UI schema element', async () => {
    const wrapper = mount(JsonForms, {
      props: {
        data: { first: 'a', second: 'b' },
        schema,
        uischema,
        renderers: createRenderers(true),
      },
    });
    await nextTick();
    expect(renders).toEqual({ first: 1, second: 1 });

    changeHandlers.first('first', 'changed');
    await nextTick();

    expect(wrapper.text()).toContain('changed');
    expect(renders.first).toBe(2);
    expect(renders.second).toBe(1);
  });

  it('re-renders a control when a date in its UI schema changes', async () => {
    const uischemaWithDate = (min: Date) => ({
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/first', options: { min } },
        { type: 'Control', scope: '#/properties/second' },
      ],
    });
    const wrapper = mount(JsonForms, {
      props: {
        data: { first: 'a', second: 'b' },
        schema,
        uischema: uischemaWithDate(new Date(Date.UTC(1970, 0, 1))),
        renderers,
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain('1970-01-01');

    await wrapper.setProps({
      uischema: uischemaWithDate(new Date(Date.UTC(2030, 0, 1))),
    });
    await nextTick();

    expect(wrapper.text()).toContain('2030-01-01');
  });
});
