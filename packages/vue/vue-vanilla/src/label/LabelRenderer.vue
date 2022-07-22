<template>
  <label v-if="label.visible" :class="styles.label.root">
    {{ label.text }}
  </label>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  LabelElement,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  rendererProps,
  RendererProps,
  useJsonFormsLabel
} from '../../config/jsonforms';
import { useVanillaLabel } from '../util';

const labelRenderer = defineComponent({
  name: 'label-renderer',
  props: {
    ...rendererProps<LabelElement>()
  },
  setup(props: RendererProps<LabelElement>) {
    return useVanillaLabel(useJsonFormsLabel(props));
  }
});

export default labelRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: labelRenderer,
  tester: rankWith(1, uiTypeIs('Label'))
};
</script>
