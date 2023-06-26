# JSON Forms - More Forms. Less Code

_Complex Forms in the blink of an eye_

JSON Forms eliminates the tedious task of writing fully-featured forms by hand by leveraging the capabilities of JSON, JSON Schema and Javascript.

## Vue Vuetify Renderers

This is the JSON Forms Vue Vuetify renderers package which provides a Vuetify based renderer set for [JSON Forms Vue](https://github.com/eclipsesource/jsonforms/blob/master/packages/vue/vue).

### Quick start

Install JSON Forms Core, Vue 3 and Vue 3 Vuetify Renderers.

```bash
npm i --save @jsonforms/core @jsonforms/vue @jsonforms/vue-vuetify
```

Also add the packages to the transpile dependencies in the `vue.config.js` file:

```js
module.exports = {
    transpileDependencies: ['@jsonforms/core', '@jsonforms/vue', '@jsonforms/vue-vuetify']
}
```

Use the `json-forms` component for each form you want to render and hand over the renderer set.

```vue
<script>
import { JsonForms } from '@jsonforms/vue';
import { vuetifyRenderers } from '@jsonforms/vue-vuetify';

const renderers = [
  ...vuetifyRenderers,
  // here you can add custom renderers
];

export default defineComponent({
  name: 'app',
  components: {
    JsonForms,
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

<style scoped>
@import '~@jsonforms/vue-vuetify/lib/jsonforms-vue-vuetify.esm.css';
</style>
```

If note done yet, please [install Vuetify for Vue](https://vuetifyjs.com/en/getting-started/installation/).

For more information on how JSON Forms can be configured, please see the [README of `@jsonforms/vue`](https://github.com/eclipsesource/jsonforms/blob/master/packages/vue/vue/README.md).

## License

The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.
