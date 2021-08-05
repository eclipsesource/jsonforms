<template>
  <div>
    <label>{{ control.label }}</label>
    <input :value="control.data" @change="onChange" />
  </div>
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

const controlRenderer = defineComponent({
  name: 'control-renderer',
  props: {
    ...rendererProps(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useJsonFormsControl(props);
  },
  methods: {
    onChange(event: Event) {
      this.handleChange(this.control.path, (event.target as any).value);
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, isControl),
};
</script>
