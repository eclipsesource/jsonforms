<template>
  <v-row>
    <v-col
      v-for="(element, index) in layout.uischema.elements"
      :key="`${path}-${index}`"
      cols="12"
    >
      <dispatch-renderer
        :schema="layout.schema"
        :uischema="element"
        :path="layout.path"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  isLayout,
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
} from '@jsonforms/core';
import { defineComponent } from '@vue/composition-api';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from '@jsonforms/vue2';
import { VCol, VRow } from 'vuetify/lib';

const layoutRenderer = defineComponent({
  name: 'layout-renderer',
  components: {
    DispatchRenderer,
    VCol,
    VRow,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return useJsonFormsLayout(props);
  },
});

export default layoutRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(1, isLayout),
};
</script>
