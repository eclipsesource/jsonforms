<template>
  <v-card v-if="layout.visible" :class="styles.categorization.root">
    <v-tabs v-model="activeCategory" :vertical="layout.direction == 'row'">
      <v-tab
        v-for="(element, index) in visibleCategories"
        :key="`${layout.path}-${index}`"
      >
        {{ element.label }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeCategory">
      <v-tab-item
        v-for="(element, index) in visibleCategories"
        :key="`${layout.path}-${index}`"
      >
        <dispatch-renderer
          :schema="layout.schema"
          :uischema="element"
          :path="layout.path"
          :enabled="layout.enabled"
          :renderers="layout.renderers"
          :cells="layout.cells"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
  and,
  uiTypeIs,
  Categorization,
  Category,
  Tester,
  isVisible,
  categorizationHasCategory,
} from '@jsonforms/core';
import { defineComponent, ref } from '../vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from '@jsonforms/vue2';
import { useAjv, useVuetifyLayout } from '../util';
import { VCard, VTabs, VTab, VTabsItems, VTabItem } from 'vuetify/lib';

const layoutRenderer = defineComponent({
  name: 'categorization-renderer',
  components: {
    DispatchRenderer,
    VCard,
    VTabs,
    VTab,
    VTabsItems,
    VTabItem,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const activeCategory = ref(0);
    const ajv = useAjv();

    return {
      ...useVuetifyLayout(useJsonFormsLayout(props)),
      activeCategory,
      ajv,
    };
  },
  computed: {
    visibleCategories(): (Category | Categorization)[] {
      return (this.layout.uischema as Categorization).elements.filter(
        (category: Category | Categorization) =>
          isVisible(category, this.layout.data, this.layout.path, this.ajv)
      );
    },
  },
});

export default layoutRenderer;

export const isSingleLevelCategorization: Tester = and(
  uiTypeIs('Categorization'),
  categorizationHasCategory
);

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, isSingleLevelCategorization),
};
</script>
