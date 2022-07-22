<template>
  <v-container v-if="layout.visible" :class="styles.categorization.root">
    <v-row
      v-if="appliedOptions.vertical == true"
      v-bind="vuetifyProps('v-row')"
    >
      <v-col v-bind="vuetifyProps('v-col.v-tabs')">
        <v-tabs
          v-model="activeCategory"
          v-bind="vuetifyProps('v-tabs')"
          vertical
        >
          <v-tab
            v-for="(element, index) in visibleCategories"
            :key="`${layout.path}-${index}`"
          >
            {{ element.label }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col v-bind="vuetifyProps('v-col.v-tabs-items')">
        <v-tabs-items
          v-model="activeCategory"
          vertical
          v-bind="vuetifyProps('v-tabs-items')"
        >
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
      </v-col>
    </v-row>
    <v-row v-else v-bind="vuetifyProps('v-row')">
      <v-tabs v-model="activeCategory" v-bind="vuetifyProps('v-tabs')">
        <v-tab
          v-for="(element, index) in visibleCategories"
          :key="`${layout.path}-${index}`"
        >
          {{ element.label }}
        </v-tab>
      </v-tabs>

      <v-tabs-items
        v-model="activeCategory"
        v-bind="vuetifyProps('v-tabs-items')"
      >
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
    </v-row>
  </v-container>
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
import { defineComponent, ref } from 'vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from '@jsonforms/vue2';
import { useAjv, useVuetifyLayout } from '../util';
import {
  VContainer,
  VTabs,
  VTab,
  VTabsItems,
  VTabItem,
  VRow,
  VCol,
} from 'vuetify/lib';

const layoutRenderer = defineComponent({
  name: 'categorization-renderer',
  components: {
    DispatchRenderer,
    VContainer,
    VTabs,
    VTab,
    VTabsItems,
    VTabItem,
    VRow,
    VCol,
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
