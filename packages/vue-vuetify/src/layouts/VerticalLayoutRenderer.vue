<template>
  <v-container
    v-if="layout.visible"
    fill-height
    :class="`${styles.verticalLayout.root}`"
    v-bind="vuetifyProps('v-container')"
  >
    <v-row
      v-for="(element, index) in (layout.uischema as Layout).elements"
      :key="`${layout.path}-${index}`"
      v-bind="vuetifyProps(`v-row[${index}]`)"
    >
      <v-col
        cols="12"
        :class="styles.verticalLayout.item"
        v-bind="vuetifyProps('v-col')"
      >
        <dispatch-renderer
          :schema="layout.schema"
          :uischema="element"
          :path="layout.path"
          :enabled="layout.enabled"
          :renderers="layout.renderers"
          :cells="layout.cells"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { type Layout } from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VCol, VContainer, VRow } from 'vuetify/components';
import { useVuetifyLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'vertical-layout-renderer',
  components: {
    DispatchRenderer,
    VContainer,
    VRow,
    VCol,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return useVuetifyLayout(useJsonFormsLayout(props));
  },
});

export default layoutRenderer;
</script>
