<template>
  <v-container v-if="layout.visible" :class="styles.categorization.root">
    <v-row
      v-if="appliedOptions.vertical == true"
      v-bind="vuetifyProps('v-row')"
    >
      <v-col
        v-bind="vuetifyProps('v-col.v-tabs')"
        class="flex-shrink-1 flex-grow-0 pa-0"
      >
        <v-tabs
          v-model="activeCategory"
          v-bind="vuetifyProps('v-tabs')"
          direction="vertical"
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
          direction="vertical"
          v-bind="vuetifyProps('v-window')"
        >
          <v-window-item
            v-for="(element, index) in visibleCategories"
            :key="`${layout.path}-${index}`"
          >
            <dispatch-renderer
              :schema="layout.schema"
              :uischema="element.value.uischema"
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
            :uischema="element.value.uischema"
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
  isCategorization,
  rankWith,
  type JsonFormsRendererRegistryEntry,
  type Layout,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsCategorization,
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
import { useVuetifyLayout } from '../util';

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
    return {
      ...useVuetifyLayout(useJsonFormsCategorization(props)),
      activeCategory,
    };
  },
  computed: {
    visibleCategories() {
      return this.categories.filter((category) => category.value.visible);
    },
    visibleCategoryLabels(): string[] {
      return this.visibleCategories.map((element) => {
        return element.value.label;
      });
    },
  },
});

export default layoutRenderer;
</script>

<style scoped>
.v-window {
  width: 100%;
}
</style>
