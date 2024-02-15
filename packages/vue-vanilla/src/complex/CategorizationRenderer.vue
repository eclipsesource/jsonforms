<template>
  <div :class="styles.categorization.root">
    <div :class="styles.categorization.category">
      <template v-for="(item, index) in categories" :key="`tab-${index}`">
        <div @click="selected = index">
          <button
            :class="[selected === index ? styles.categorization.selected : '']"
            :disabled="!item.isEnabled"
          >
            <label>{{ item.label }}</label>
          </button>
        </div>
      </template>
    </div>

    <div :class="styles.categorization.panel">
      <DispatchRenderer
        :schema="layout.schema"
        :uischema="currentUischema"
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
import type {
  Categorization,
  JsonFormsRendererRegistryEntry,
  Layout,
  UISchemaElement,
} from '@jsonforms/core';
import {
  and,
  categorizationHasCategory,
  createAjv,
  deriveLabelForUISchemaElement,
  isEnabled,
  isVisible,
  rankWith,
  isCategorization,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  type RendererProps,
  useJsonFormsLayout,
} from '@jsonforms/vue';
import { type CategoryItem, useTranslator, useVanillaLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'CategorizationRenderer',
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const input = useVanillaLayout(useJsonFormsLayout(props));

    return {
      ...input,
      ajv: createAjv(),
      t: useTranslator(),
    };
  },
  data() {
    return {
      selected: 0,
    };
  },

  computed: {
    currentUischema(): UISchemaElement {
      return this.categories[this.selected].element;
    },
    categories(): CategoryItem[] {
      const { data, path } = this.layout;
      return (this.layout.uischema as Categorization).elements
        .filter((category) => isVisible(category, data, path, this.ajv))
        .map((category): CategoryItem => {
          return {
            element: category,
            isEnabled: isEnabled(category, data, path, this.ajv),
            label: deriveLabelForUISchemaElement(category, this.t),
          };
        });
    },
  },
});

export default layoutRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, and(isCategorization, categorizationHasCategory)),
};
</script>


























































































