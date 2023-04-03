<template>
  <v-app>
    <json-forms
      :data="data"
      :schema="schema"
      :uischema="uischema"
      :renderers="renderers"
      :config="config"
      @change="onChange"
    />
  </v-app>
</template>

<script lang="ts">
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VApp } from 'vuetify/components';

export default defineComponent({
  name: 'test-component',
  components: {
    JsonForms,
    VApp,
  },
  props: {
    initialData: {
      required: true,
      type: [String, Number, Boolean, Array, Object],
    },
    schema: {
      required: false,
      default: undefined,
      type: [Object, Boolean],
    },
    uischema: {
      required: false,
      type: Object,
    },
    config: {
      required: false,
      default: undefined,
      type: Object,
    },
    initialRenderers: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      renderers: Object.freeze(this.initialRenderers),
      data: this.initialData,
    };
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      this.data = event.data;
    },
  },
});
</script>
