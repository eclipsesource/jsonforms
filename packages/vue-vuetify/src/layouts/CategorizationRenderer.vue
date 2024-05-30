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
and,
categorizationHasCategory,
deriveLabelForUISchemaElement,
isVisible,
rankWith,
uiTypeIs,
type Categorization,
type Category,
type JsonFormsRendererRegistryEntry,
type Layout,
type Tester,
} from '@jsonforms/core';
import {
DispatchRenderer,
rendererProps,
useJsonFormsLayout,
type RendererProps,
} from '@jsonforms/vue';
import { defineComponent, ref } from 'vue';
import {
VCol,
VContainer,
VRow,
VTab,
VTabs,
VWindow,
VWindowItem,
} from 'vuetify/components';
import { useAjv, useTranslator, useVuetifyLayout } from '../util';

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
          isVisible(category, this.layout.data, this.layout.path, this.ajv),
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
  categorizationHasCategory,
);

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, isSingleLevelCategorization),
};
</script>

<style scoped>
.v-window {
  width: 100%;
}
</style>
