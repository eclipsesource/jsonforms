<script lang="ts">
import { defineComponent } from "../../config";
import { JsonForms, JsonFormsChangeEvent } from '../../src';
import { vueRenderers } from '../renderers';

export default defineComponent({
  name: 'app',
  components: {
    JsonForms
  },
  data: function() {
    return {
      renderers: Object.freeze(vueRenderers),
      data: {
        number: 5
      },
      schema: {
        properties: {
          number: {
            type: 'number'
          }
        }
      } as any
    };
  },
  methods: {
    setSchema() {
      this.schema = {
        properties: {
          name: {
            type: 'string'
          }
        }
      };
    },
    onChange(event: JsonFormsChangeEvent) {
      console.log(event);
      this.data = event.data;
    }
  }
});
</script>

<template>
  <div id="app">
    <json-forms
      v-bind:data="data"
      v-bind:renderers="renderers"
      @change="onChange"
    />
    <button @click="setSchema">Set Schema</button>
  </div>
</template>
