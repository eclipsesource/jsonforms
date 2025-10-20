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
import { type LabelElement } from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsLabel,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VLabel } from 'vuetify/components';
import { useVuetifyLabel } from '../util';

const labelRenderer = defineComponent({
  name: 'label-renderer',
  components: {
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
</script>
