
# JSON Forms - More Forms. Less Code

*Complex Forms in the blink of an eye*

JSON Forms eliminates the tedious task of writing fully-featured forms by hand by leveraging the capabilities of JSON, JSON Schema and Javascript.

## Vue 2 Vanilla Renderers

This is the JSON Forms Vue 2 Vanilla renderers package which provides a HTML5-based renderer set for [JSON Forms Vue 2](https://github.com/eclipsesource/jsonforms/blob/master/packages/vue2).

### JSON Forms Vue 2 seed app

See our [JSON Forms Vue seed repository](https://github.com/eclipsesource/jsonforms-vue-seed/tree/vue2) to get started as quickly as possible.
Make sure to switch to branch `vue2`.

### Quick start

Install JSON Forms Core, Vue 2 and Vue 2 Vanilla Renderers.

```bash
npm i --save @jsonforms/core @jsonforms/vue2 @jsonforms/vue2-vanilla
```

Also add the packages to the transpile dependencies in the `vue.config.js` file:

```js
module.exports = {
    transpileDependencies: ['@jsonforms/core', '@jsonforms/vue2', '@jsonforms/vue2-vanilla']
}
```

Use the `json-forms` component for each form you want to render and hand over the renderer set.

```vue
<script>
import { JsonForms } from '@jsonforms/vue2';
import { vanillaRenderers } from '@jsonforms/vue2-vanilla'
import { defineComponent } from "vue";

const renderers = [
  ...vanillaRenderers,
  // here you can add custom renderers
]

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1
    },
    done: {
      type: 'boolean'
    },
    due_date: {
      type: 'string',
      format: 'date'
    },
    recurrence: {
      type: 'string',
      enum: ['Never', 'Daily', 'Weekly', 'Monthly']
    }
  },
  required: ['name', 'due_date']
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      label: false,
      scope: '#/properties/done'
    },
    {
      type: 'Control',
      scope: '#/properties/name'
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/due_date'
        },
        {
          type: 'Control',
          scope: '#/properties/recurrence'
        }
      ]
    }
  ]
};
const data = {};

export default defineComponent({
  name: 'app',
  components: {
    JsonForms
  },
  data() {
    return {
      renderers: Object.freeze(renderers),
      data,
      schema,
      uischema,
    };
  },
  methods: {
    onChange(event) {
      this.data = event.data;
    },
  }
});
</script>
<template>
  <json-forms
    :data="data"
    :schema="schema"
    :uischema="uischema"
    :renderers="renderers"
    @change="onChange"
  />
</template>
```

By default the Vanilla Renderers don't apply any CSS at all.
For a quick start you can use `@jsonforms/vue-vanilla/vanilla.css`.

For more information on how JSON Forms can be configured, please see the [README of `@jsonforms/vue2`](../vue2/README.md).

### Styling

Each rendered HTML element specifies a CSS class which can be used to style it.
This process can also be customized so that each element declares user-specified CSS classes.
Therefore JSON Forms Vue Vanilla can be integrated with any CSS-only UI framework quite easily.

You can find the default CSS classes in `[defaultStyles.ts](src/styles/defaultStyles.ts).

To render your own classes simply `provide` them as `styles`.
These `styles` replace the `defaultStyles`.
If you want to fall back to `defaultStyles` or combine them with your own classes you'll need to do so programmatically, e.g.:

```vue
<script>
import { JsonForms } from '@jsonforms/vue2';
import { defaultStyles, mergeStyles, vanillaRenderers } from '@jsonforms/vue2-vanilla'
import { defineComponent } from "vue";

const renderers = [
  ...vanillaRenderers,
  // here you can add custom renderers
]

// mergeStyles combines all classes from both styles definitions
const myStyles = mergeStyles(defaultStyles, { control: { root: 'my-control' } });

export default defineComponent({
  name: 'app',
  components: {
    JsonForms
  },
  data() {
    return {
      renderers: Object.freeze(renderers),
      data,
      schema,
      uischema,
    };
  },
  methods: {
    onChange(event) {
      this.data = event.data;
    },
  },
  provide() {
    return {
      styles: myStyles
    }
  }
});
</script>
<template>
  <json-forms
    :data="data"
    :schema="schema"
    :uischema="uischema"
    :renderers="renderers"
    @change="onChange"
  />
</template>
```

You can also use specify styles in the ui schema via the `options.styles` property.
Attributes specified here override the respective `defaultStyles` or provided `styles`.
Attributes not specified here fall back to either the `defaultStyles` or provided `styles`.

```json
{
  "type": "Control",
  "scope": "#/properties/name",
  "options": {
    "styles": {
      "control": {
        "root": "my-control-root"
      }
    }
  }
}
```

## License

The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.

## Roadmap

Our current roadmap is available [here](https://github.com/eclipsesource/jsonforms/blob/master/ROADMAP.md).

## Migration

See our [migration guide](https://github.com/eclipsesource/jsonforms/blob/master/MIGRATION.md) when updating JSON Forms.
