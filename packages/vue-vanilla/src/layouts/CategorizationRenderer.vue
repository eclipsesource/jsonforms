<template>
  <div :class="styles.categorization.root">
    <div :class="styles.categorization.category">
      <template
        v-for="(category, index) in categories"
        :key="`category-${index}`"
      >
        <div v-if="category.value.visible" @click="selected = index">
          <button
            :class="[selected === index ? styles.categorization.selected : '']"
            :disabled="!category.value.enabled"
          >
            <label>{{ category.value.label }}</label>
          </button>
        </div>
      </template>
    </div>

    <div :class="styles.categorization.panel">
      <DispatchRenderer
        v-if="categories[selected]"
        :schema="layout.schema"
        :uischema="categories[selected].value.uischema"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { JsonFormsRendererRegistryEntry, Layout } from '@jsonforms/core';
import {
  and,
  categorizationHasCategory,
  isCategorization,
  rankWith,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsCategorization,
  type RendererProps,
} from '@jsonforms/vue';
import { useVanillaLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'CategorizationRenderer',
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return useVanillaLayout(useJsonFormsCategorization(props));
  },
  data() {
    return {
      selected: 0,
    };
  },
});

export default layoutRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, and(isCategorization, categorizationHasCategory)),
};
</script>
