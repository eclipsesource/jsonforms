<template>
  <v-label
    v-if="label.visible"
    :class="styles.label.root"
    v-bind="vuetifyProps('v-label')"
  >
    {{ label.text }}
  </v-label>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  uiTypeIs,
  LabelElement,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  DispatchRenderer,
  rendererProps,
  RendererProps,
  useJsonFormsLabel,
} from '@jsonforms/vue';
import { VLabel } from 'vuetify/components';
import { useVuetifyLabel } from '../util';

const labelRenderer = defineComponent({
  name: 'label-renderer',
  components: {
    DispatchRenderer,
    VLabel,
  },
  props: {
    ...rendererProps<LabelElement>(),
  },
  setup(props: RendererProps<LabelElement>) {
    return useVuetifyLabel(useJsonFormsLabel(props));
  },
});

export default labelRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: labelRenderer,
  tester: rankWith(1, uiTypeIs('Label')),
};
</script>
