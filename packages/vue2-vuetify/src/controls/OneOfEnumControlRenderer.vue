<template>
  <v-select
    :value="control.data ? control.data : null"
    :label="control.label"
    :error-messages="control.errors"
    clearable
    :items="control.options"
    item-text="label"
    item-value="value"
    @input="onChange"
  >
  </v-select>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  isOneOfEnumControl,
  ControlElement,
} from '@jsonforms/core';
import {
  RendererProps,
  rendererProps,
  useJsonFormsOneOfEnumControl,
} from '@jsonforms/vue2';
import { defineComponent } from '@vue/composition-api';
import { VSelect } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'one-of-enum-control-renderer',
  components: {
    VSelect,
  },
  props: {
    ...rendererProps(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useJsonFormsOneOfEnumControl(props);
  },
  methods: {
    onChange(newValue: string) {
      this.handleChange(this.control.path, newValue ?? undefined);
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isOneOfEnumControl),
};
</script>
