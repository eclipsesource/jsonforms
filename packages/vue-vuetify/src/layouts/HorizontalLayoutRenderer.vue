<template>
  <v-container
    v-if="layout.visible"
    :class="`${styles.horizontalLayout.root}`"
    v-bind="vuetifyProps('v-container')"
  >
    <v-row v-bind="vuetifyProps('v-row')">
      <v-col
        v-for="(element, index) in layout.uischema.elements"
        :key="`${layout.path}-${index}`"
        :class="styles.horizontalLayout.item"
        :cols="cols[index]"
        v-bind="vuetifyProps(`v-col[${index}]`)"
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
import {
  uiTypeIs,
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from '@jsonforms/vue';
import { useVuetifyLayout } from '../util';
import { VContainer, VRow, VCol } from 'vuetify/components';

const layoutRenderer = defineComponent({
  name: 'horizontal-layout-renderer',
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
  computed: {
    collapse() {
      const { xs, sm, md, lg, xl } = this.$vuetify.display;
      if (this.appliedOptions.breakHorizontal === 'xs' && xs) {
        return true;
      }
      if (this.appliedOptions.breakHorizontal === 'sm' && (xs || sm)) {
        return true;
      }
      if (this.appliedOptions.breakHorizontal === 'md' && (xs || sm || md)) {
        return true;
      }
      if (
        this.appliedOptions.breakHorizontal === 'lg' &&
        (xs || sm || md || lg)
      ) {
        return true;
      }
      if (
        this.appliedOptions.breakHorizontal === 'xl' &&
        (xs || sm || md || lg || xl)
      ) {
        return true;
      }
      return false;
    },
    /**
     * Combines 'breakHorizontal' with user defined 'col' weights.
     * 'breakHorizontal' takes precedence.
     */
    cols(): (number | false)[] {
      return this.uischema.elements.map((_, index) => {
        if (this.collapse) {
          return 12;
        }
        const uiSchemaCols = this.vuetifyProps(`v-col[${index}]`)?.cols;
        return uiSchemaCols !== undefined ? uiSchemaCols : false;
      });
    },
  },
});

export default layoutRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, uiTypeIs('HorizontalLayout')),
};
</script>
