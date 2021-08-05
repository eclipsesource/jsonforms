<template>
  <div class="layout">
    <div
      v-for="(element, index) in layout.uischema.elements"
      :key="`${path}-${index}`"
      class="layout-item"
    >
      <dispatch-renderer
        :schema="layout.schema"
        :uischema="element"
        :path="layout.path"
      />
    </div>
  </div>
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

const layoutRenderer = defineComponent({
  name: 'layout-renderer',
  components: {
    DispatchRenderer,
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
