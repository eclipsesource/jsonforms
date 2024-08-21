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
            v-for="(_, index) in visibleCategories"
            :key="`${layout.path}-${index}`"
          >
            {{ visibleCategoryLabels[index] }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col v-bind="vuetifyProps('v-col.v-window')">
        <v-window
          v-model="activeCategory"
          vertical
          v-bind="vuetifyProps('v-window')"
        >
          <v-window-item
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
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
    <v-row v-else v-bind="vuetifyProps('v-row')">
      <v-tabs v-model="activeCategory" v-bind="vuetifyProps('v-tabs')">
        <v-tab
          v-for="(_, index) in visibleCategories"
          :key="`${layout.path}-${index}`"
        >
          {{ visibleCategoryLabels[index] }}
        </v-tab>
      </v-tabs>

      <v-window v-model="activeCategory" v-bind="vuetifyProps('v-window')">
        <v-window-item
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
        </v-window-item>
      </v-window>
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
  deriveLabelForUISchemaElement,
} from '@jsonforms/core';
import { defineComponent, ref } from 'vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from '@jsonforms/vue';
import { useAjv, useTranslator, useVuetifyLayout } from '../util';
import {
  VContainer,
  VTabs,
  VTab,
  VWindow,
  VWindowItem,
  VRow,
  VCol,
} from 'vuetify/components';

const layoutRenderer = defineComponent({
  name: 'categorization-renderer',
  components: {
    DispatchRenderer,
    VContainer,
    VTabs,
    VTab,
    VWindow,
    VWindowItem,
    VRow,
    VCol,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const activeCategory = ref(0);
    const ajv = useAjv();
    const t = useTranslator();
    return {
      ...useVuetifyLayout(useJsonFormsLayout(props)),
      activeCategory,
      ajv,
      t,
    };
  },
  computed: {
    visibleCategories(): (Category | Categorization)[] {
      return (this.layout.uischema as Categorization).elements.filter(
        (category: Category | Categorization) =>
          isVisible(category, this.layout.data, this.layout.path, this.ajv)
      );
    },
    visibleCategoryLabels(): string[] {
      return this.visibleCategories.map((element) => {
        return deriveLabelForUISchemaElement(element, this.t) ?? '';
      });
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

<style>
.v-window {
  width: 100%;
}
</style>
