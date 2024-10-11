<template>
  <v-container
    v-if="layout.visible"
    :class="`${styles.horizontalLayout.root}`"
    v-bind="vuetifyProps('v-container')"
  >
    <v-row v-bind="vuetifyProps('v-row')">
      <v-col
        v-for="(element, index) in (layout.uischema as Layout).elements"
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
import { type Layout } from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { useDisplay } from 'vuetify';
import { VCol, VContainer, VRow } from 'vuetify/components';
import { useVuetifyLayout } from '../util';

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
    const { xs, sm, md, lg, xl } = useDisplay();
    return {
      ...useVuetifyLayout(useJsonFormsLayout(props)),
      xs,
      sm,
      md,
      lg,
      xl,
    };
  },
  computed: {
    collapse() {
      if (this.appliedOptions.breakHorizontal === 'xs' && this.xs) {
        return true;
      }
      if (
        this.appliedOptions.breakHorizontal === 'sm' &&
        (this.xs || this.sm)
      ) {
        return true;
      }
      if (
        this.appliedOptions.breakHorizontal === 'md' &&
        (this.xs || this.sm || this.md)
      ) {
        return true;
      }
      if (
        this.appliedOptions.breakHorizontal === 'lg' &&
        (this.xs || this.sm || this.md || this.lg)
      ) {
        return true;
      }
      if (
        this.appliedOptions.breakHorizontal === 'xl' &&
        (this.xs || this.sm || this.md || this.lg || this.xl)
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
</script>
