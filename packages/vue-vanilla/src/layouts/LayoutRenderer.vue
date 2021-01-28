<template>
  <div v-if="layout.visible" :class="styles[className].root">
    <div
      v-for="(element, index) in layout.uischema.elements"
      :key="`${layout.path}-${index}`"
      :class="styles[className]?.item"
    >
      <dispatch-renderer
        :schema="layout.schema"
        :uischema="element"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  isLayout,
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith
} from '@jsonforms/core';
import { defineComponent } from "../../config";
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout
} from '@jsonforms/vue';
import { useVanillaLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'layout-renderer',
  components: {
    DispatchRenderer
  },
  props: {
    ...rendererProps<Layout>()
  },
  setup(props) {
    return useVanillaLayout(useJsonFormsLayout(props));
  },
  computed: {
    className(): string {
      return this.layout.direction === 'row' ? 'horizontalLayout' : 'verticalLayout';
    }
  }
});

export default layoutRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(1, isLayout)
};
</script>
