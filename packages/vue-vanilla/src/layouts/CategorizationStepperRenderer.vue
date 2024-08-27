<template>
  <div :class="styles.categorization.root">
    <div :class="styles.categorization.stepper">
      <template
        v-for="(category, index) in visibleCategories"
        :key="`tab-${index}`"
      >
        <div v-if="category.value.visible" @click="selected = index">
          <button
            :class="[selected === index ? styles.categorization.selected : '']"
            :disabled="!category.value.enabled"
          >
            <span :class="styles.categorization.stepperBadge">{{
              index + 1
            }}</span>

            <label>{{ category.value.label }}</label>
          </button>
        </div>

        <hr
          v-if="index !== visibleCategories.length - 1"
          :class="styles.categorization.stepperLine"
        />
      </template>
    </div>

    <div :class="styles.categorization.panel">
      <DispatchRenderer
        v-if="visibleCategories[selected]"
        :schema="layout.schema"
        :uischema="visibleCategories[selected].value.uischema"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells"
      />
    </div>

    <footer
      v-if="appliedOptions?.showNavButtons"
      :class="styles.categorization.stepperFooter"
    >
      <div
        v-if="selected > 0"
        :class="styles.categorization.stepperButtonBack"
        @click="selected = selected - 1"
      >
        <button :disabled="!visibleCategories[selected - 1].value.enabled">
          {{ 'back' }}
        </button>
      </div>

      <div
        v-if="selected + 1 < visibleCategories.length"
        :class="styles.categorization.stepperButtonNext"
        @click="selected = selected + 1"
      >
        <button :disabled="!visibleCategories[selected + 1].value.enabled">
          {{ 'next' }}
        </button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { JsonFormsRendererRegistryEntry, Layout } from '@jsonforms/core';
import {
  and,
  categorizationHasCategory,
  isCategorization,
  optionIs,
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
  name: 'CategorizationStepperRenderer',
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
  computed: {
    visibleCategories() {
      return this.categories.filter((category) => category.value.visible);
    },
  },
});

export default layoutRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(
    3,
    and(
      isCategorization,
      categorizationHasCategory,
      optionIs('variant', 'stepper')
    )
  ),
};
</script>
