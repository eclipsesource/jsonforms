<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  isEnumControl,
  ControlElement,
} from '@jsonforms/core';
import {
  RendererProps,
  rendererProps,
  useJsonFormsEnumControl,
} from '@jsonforms/vue2';
import { defineComponent } from '@vue/composition-api';
import { VSelect } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'enum-control-renderer',
  components: {
    VSelect,
  },
  props: {
    ...rendererProps(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useJsonFormsEnumControl(props);
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
  tester: rankWith(2, isEnumControl),
};
</script>
