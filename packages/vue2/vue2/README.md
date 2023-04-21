# JSON Forms - More Forms. Less Code

_Complex forms in the blink of an eye_

JSON Forms eliminates the tedious task of writing fully-featured forms by hand by leveraging the capabilities of JSON, JSON Schema and Javascript.

## Vue 2 Package

This is the JSON Forms Vue 2 package which provides the necessary bindings for Vue 2. It uses [JSON Forms Core](https://github.com/eclipsesource/jsonforms/blob/master/packages/core).

## JSON Forms Vue 2 seed app

See our [JSON Forms Vue seed repository](https://github.com/eclipsesource/jsonforms-vue-seed/tree/vue2) to get started as quickly as possible.
Make sure to switch to branch `vue2`.

## Usage

Use the `json-forms` component for each form you want to render.

Mandatory props:

- `data: any` - the data to show
- `renderers: JsonFormsRendererRegistryEntry[]` - the Vue renderer set to use

Optional props:

- `schema: JsonSchema` - the data schema for the given data. Will be generated when not given.
- `uischema: UISchemaElement` - the ui schema for the given data schema. Will be generated when not given.
- `cells: JsonFormsCellRendererRegistryEntry[]` - the Vue cell renderer set to use
- `config: any` - form-wide options. May contain default ui schema options.
- `readonly: boolean` - whether all controls shall be readonly.
- `uischemas: JsonFormsUiSchemaEntry[]` - registry for dynamic ui schema dispatching
- `validationMode: 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation'` - the validation mode for the form
- `ajv: AJV` - custom Ajv instance for the form

Events:

- `change: {data: any; errors: AJVError[]}` - Whenever data and/or errors change this event is emitted.

Example:

```html
<json-forms
  :data="data"
  :renderers="renderers"
  :schema="schema"
  :uischema="uischema"
  @change="onChange"
/>
```

```ts
export default defineComponent({
  components: {
    JsonForms,
  },
  data() {
    return {
      // freeze renderers for performance gains
      renderers: Object.freeze(renderers),
      data: {
        number: 5,
      },
      schema: {
        properties: {
          number: {
            type: 'number',
          },
        },
      },
      uischema: {
        type: 'VerticalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/number',
          },
        ],
      },
    };
  },
  methods: {
    onChange(event) {
      this.data = event.data;
    },
  },
});
```

### Renderer Set

The `@jsonforms/vue` package offers JSON Forms Core bindings based on the composition API.
These bindings handle the props given to the `dispatch-renderer` and use the JSON Forms Core to determine specialized inputs for many use cases like validation and rule-based visibility.
Using these bindings as a basis, it's straightforward to create renderer sets for Vue 2.

#### Basic control renderer example

```ts
import { ControlElement } from '@jsonforms/core';
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';

const controlRenderer = defineComponent({
  name: 'control-renderer',
  props: {
    ...rendererProps(),
  },
  setup(props: any) {
    return useJsonFormsControl(props);
  },
  methods: {
    onChange(event: Event) {
      this.handleChange(
        this.control.path,
        (event.target as HTMLInputElement).value
      );
    },
  },
});
export default controlRenderer;
```

- You can use the provided `rendererProps` factory which declares all props required for each renderer.
  When using Typescript you can specify a `UISchemaElement` type to declare that you only expect UI schema elements of that type.
- In `setup` call the appropriate binding for your renderer.
  Here we use `useJsonFormsControl` which will work on any `Control` element and provides a `control` property containing calculated attributes like `data`, `description`, `errors`, `enabled` and many more.
  It also provides a `handleChange(path,value)` method with which the managed data can be updated.

```html
<div>
  <input v-bind:value="control.data" @change="onChange" />
  <div class="error" v-if="control.errors">{{ control.errors }}</div>
</div>
```

This is a very simplified template for such a control.
You can see how some of the `control` properties are bound against the input, including the `handleChange` method via `onChange`.

```ts
import {
  isControl,
  JsonFormsRendererRegistryEntry,
  rankWith,
} from '@jsonforms/core';
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, isControl),
};
```

It's convenient to create the `JsonFormsRendererRegistryEntry` within the same file as the renderer.
Here it's ranked with priority `1` (higher is better) for any UI schema element which satisfies `isControl`.

These entries can then be collected and form the Vue renderer set handed over to the `json-forms` component.

#### Basic layout renderer example

The principle is the same as with the control example.
The only difference here is the use of the provided `dispatch-renderer` which will determine the next renderer to use, based on its inputs.

```ts
import {
  isLayout,
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
} from '@jsonforms/vue';

const layoutRenderer = defineComponent({
  name: 'layout-renderer',
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps(),
  },
  setup(props: any) {
    return useJsonFormsLayout(props);
  },
});

export default layoutRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(1, isLayout),
};
```

```html
<div>
  <div
    v-for="(element, index) in layout.uischema.elements"
    v-bind:key="`${layout.path}-${index}`"
  >
    <dispatch-renderer
      v-bind:schema="layout.schema"
      v-bind:uischema="element"
      v-bind:path="layout.path"
      v-bind:enabled="layout.enabled"
      v-bind:renderers="layout.renderers"
      v-bind:cells="layout.cells"
    />
  </div>
</div>
```

#### dispatch renderer

The dispatch renderer is used to dispatch to the highest ranked registered renderer.

Required props are `schema`, `uischema` and `path`.
Optional props are `enabled`, `renderers` and `cells`.
These can be used to implement more advanced use cases like hierarchical enablement and dynamically adapted renderer / cell sets.

#### Available bindings

The following bindings can be used for `Control` elements and provide a `control` property and `handleChange` method.
The `useJsonFormsArrayControl` additionally provides `addItem`, `removeItems`, `moveUp` and `moveDown` methods.

- `useJsonFormsControl`
- `useJsonFormsControlWithDetail`
- `useJsonFormsEnumControl`
- `useJsonFormsOneOfEnumControl`
- `useJsonFormsArrayControl`
- `useJsonFormsAllOfControl`
- `useJsonFormsAnyOfControl`
- `useJsonFormsOneOfControl`

The following bindings can be used for `Layout` elements and provide a `layout` property.
`useJsonFormsArrayLayout` is a mix between `Control` and `Layout` as it's meant for showing `array` elements within a specific layout.

- `useJsonFormsLayout`
- `useJsonFormsArrayLayout`

The following binding can be used for any renderer.
It's main use case is within dispatch renderers.
The binding provides a `renderer` property.

- `useJsonFormsRenderer`

Besides `renderers` JSON Forms also supports a separate `cells` registry.
Cells are meant to be simpler as normal renderers, rendering simplified inputs to be used within more complex structures like tables.
The following bindings can be used for cells and provide a `cell` property and `handleChange` method.

- `useJsonFormsDispatchCell`
- `useJsonFormsCell`
- `useJsonFormsEnumCell`

The last binding is a special one, meant to be used within lists of master-detail controls.
In contrast to all other bindings it's not meant to be registered as an own `renderer` or `cell`.
The binding provides an `item` propery.

- `useJsonFormsMasterListItem`

#### Custom binding

Should any of the provided bindings not completely match an intended use case, then you can create your own.
When constructing a new binding you might want to access the injected raw `jsonforms` object and `dispatch` method, e.g.

```ts
import { inject } from 'vue';

const useCustomBinding = (props) => {
  const jsonforms = inject<JsonFormsSubStates>('jsonforms');
  const dispatch = inject<Dispatch<CoreActions>>('dispatch');

  return {
    // use props, jsonforms and dispatch to construct own binding
  };
};
```

Of course these can also be directly injected into your components, e.g.

```ts
const myComponent = defineComponent({
  inject: ['jsonforms', 'dispatch'],
});
```

The injected `jsonforms` object is not meant to be modified directly.
Instead it should be modified via the provided `dispatch` and by changing the props of the `json-forms` component.

## License

The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.

## Roadmap

Our current roadmap is available [here](https://github.com/eclipsesource/jsonforms/blob/master/ROADMAP.md).

## Feedback, Help and Support

JSON Forms is developed by [EclipseSource](https://eclipsesource.com).

If you encounter any problems feel free to [open an issue](https://github.com/eclipsesource/jsonforms/issues/new/choose) on the repo.
For questions and discussions please use the [JSON Forms board](https://jsonforms.discourse.group).
You can also reach us via [email](mailto:jsonforms@eclipsesource.com?subject=JSON%20Forms).
In addition, EclipseSource also offers [professional support](https://jsonforms.io/support) for JSON Forms.

## Migration

See our [migration guide](https://github.com/eclipsesource/jsonforms/blob/master/MIGRATION.md) when updating JSON Forms.
