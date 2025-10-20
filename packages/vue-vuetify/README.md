# JSON Forms - More Forms. Less Code

_Complex Forms in the blink of an eye_

JSON Forms eliminates the tedious task of writing fully-featured forms by hand by leveraging the capabilities of JSON, JSON Schema and Javascript.

## Vue Vuetify Renderers

This is the JSON Forms Vue Vuetify renderers package which provides a Vuetify based renderer set for [JSON Forms Vue](https://github.com/eclipsesource/jsonforms/blob/master/packages/vue).
The renderers are in a preview state.

### Quick start

Install JSON Forms Core, Vue 3 and Vue 3 Vuetify Renderers.

```bash
npm i --save @jsonforms/core @jsonforms/vue @jsonforms/vue-vuetify
```

Also add the packages to the transpile dependencies in the `vite.config.js` file:

```js
// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    // Exclude vuetify since it has an issue with vite dev - TypeError: makeVExpansionPanelTextProps is not a function - the makeVExpansionPanelTextProps is used before it is defined
    exclude: ['vuetify'],
  },

  // more config....
});
```

Use the `json-forms` component for each form you want to render and hand over the renderer set.

```vue
<script>
import { JsonForms } from '@jsonforms/vue';
import { extendedVuetifyRenderers } from '@jsonforms/vue-vuetify';
import { markRaw } from 'vue';

const renderers = markRaw([
  ...extendedVuetifyRenderers,
  // here you can add custom renderers
]);

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

<style>
@import '@jsonforms/vue-vuetify/lib/jsonforms-vue-vuetify.css';
</style>
```

In your vuetify creation specify the icons used

Material Design Icons (mdi)

```js
import { mdi, aliases as mdiAliases } from 'vuetify/iconsets/mdi';
import { createVuetify } from 'vuetify';

import { mdiIconAliases } from '@jsonforms/vue-vuetify';
import '@mdi/font/css/materialdesignicons.css';

createVuetify({
    icons: {
      defaultSet: 'mdi',
      sets: {
        mdi,
      },
      aliases: { ...mdiAliases, ...mdiIconAliases };,
    },
  });
```

Font Awesome (fa)

```js
import { fa, aliases as faAliases } from 'vuetify/iconsets/fa';
import { createVuetify } from 'vuetify';

import { faIconAliases } from '@jsonforms/vue-vuetify';
import '@fortawesome/fontawesome-free/css/all.css';

createVuetify({
    icons: {
      defaultSet: 'fa',
      sets: {
        fa,
      },
      aliases: { ...faAliases, ...faIconAliases };,
    },
  });
```

If note done yet, please [install Vuetify for Vue](https://vuetifyjs.com/en/getting-started/installation/).

For more information on how JSON Forms can be configured, please see the [README of `@jsonforms/vue`](https://github.com/eclipsesource/jsonforms/blob/master/packages/vue/README.md).

## License

The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.
