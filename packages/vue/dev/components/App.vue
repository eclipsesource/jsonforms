<script lang="ts">
import { defineComponent } from 'vue';
import { JsonForms, JsonFormsChangeEvent } from '../../src';
import { vueRenderers } from '../renderers';

export default defineComponent({
  name: 'App',
  components: {
    JsonForms,
  },
  data: function () {
    return {
      renderers: Object.freeze(vueRenderers),
      data: {
        number: 5,
      },
      schema: {
        properties: {
          number: {
            type: 'number',
          },
        },
      } as any,
    };
  },
  methods: {
    setSchema() {
      this.schema = {
        properties: {
          name: {
            type: 'string',
          },
        },
      };
    },
    onChange(event: JsonFormsChangeEvent) {
      console.log(event);
      this.data = event.data;
    },
  },
});
</script>

<template>
  <div id="app">
    <json-forms
      :data="data"
      :schema="schema"
      :renderers="renderers"
      @change="onChange"
    />
    <button @click="setSchema">Set Schema</button>
  </div>
</template>
