<script lang="ts">
import { defineComponent } from 'vue';
import { JsonForms } from '../../../config/jsonforms';
import { vanillaRenderers, vanillaCells } from '../../../src';
import { JsonFormsChangeEvent } from '@jsonforms/vue';

export default defineComponent({
  name: 'TestComponent',
  components: {
    JsonForms,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['initialData', 'schema', 'uischema', 'config'],
  data() {
    return {
      renderers: Object.freeze(vanillaRenderers),
      cells: Object.freeze(vanillaCells),
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

<template>
  <json-forms
    :data="data"
    :schema="schema"
    :uischema="uischema"
    :renderers="renderers"
    :cells="cells"
    :config="config"
    @change="onChange"
  />
</template>
