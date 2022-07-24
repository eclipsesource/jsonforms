<script lang="ts">
import { defineComponent } from 'vue';
import { JsonForms } from '../../../config/jsonforms';
import { vanillaRenderers } from '../../../src';
import { JsonFormsChangeEvent } from '@jsonforms/vue';

export default defineComponent({
  name: 'test-component',
  components: {
    JsonForms
  },
  props: ['initialData', 'schema', 'uischema', 'config'],
  data() {
    return {
      renderers: Object.freeze(vanillaRenderers),
      data: this.initialData
    };
  },
  methods: {
    onChange(event: JsonFormsChangeEvent){
      this.data = event.data;
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
    :config="config"
    @change="onChange"
  />
</template>
