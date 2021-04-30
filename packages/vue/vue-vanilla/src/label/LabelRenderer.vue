<template>
  <label v-if="layout.visible" :class="styles.label.root">
    {{ this.layout.uischema.text }}
  </label>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
import { defineComponent } from '../../config/vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps
} from '../../config/jsonforms';
import { useVanillaLayout } from '../util';

const labelRenderer = defineComponent({
  name: 'label-renderer',
  components: {
    DispatchRenderer
  },
  props: {
    ...rendererProps<Layout>()
  },
  setup(props: RendererProps<Layout>) {
    // reuse layout bindings for label
    return useVanillaLayout(useJsonFormsLayout(props));
  }
});

export default labelRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: labelRenderer,
  tester: rankWith(1, uiTypeIs('Label'))
};
</script>
