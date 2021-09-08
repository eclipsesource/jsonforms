<template>
  <v-text-field
    :value="control.data ? control.data : null"
    :label="control.label"
    clearable
    @input="onChange"
  >
  </v-text-field>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  isControl,
  ControlElement,
} from '@jsonforms/core';
import {
  RendererProps,
  rendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue2';
import { defineComponent } from '@vue/composition-api';
import { VTextField } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'control-renderer',
  components: {
    VTextField,
  },
  props: {
    ...rendererProps(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useJsonFormsControl(props);
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
  tester: rankWith(1, isControl),
};
</script>
