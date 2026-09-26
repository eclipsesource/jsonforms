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
import { defineComponent, h, nextTick } from 'vue';
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
      return h('span', String(control.value.data));
    };
  },
});

const TestLayout = defineComponent({
  props: rendererProps<Layout>(),
  setup(props) {
    const { layout } = useJsonFormsLayout(props);
    return () =>
      h(
        'div',
        (layout.value.uischema as Layout).elements.map((element) =>
          h(DispatchRenderer, {
            schema: layout.value.schema,
            uischema: element,
            path: layout.value.path,
            enabled: layout.value.enabled,
          })
        )
      );
  },
});

const renderers: JsonFormsRendererRegistryEntry[] = [
  { tester: rankWith(1, isControl), renderer: TestControl },
  { tester: rankWith(1, isLayout), renderer: TestLayout },
];

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
});
