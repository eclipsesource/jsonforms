<template>
  <div :class="styles.categorization.root">
    <div :class="styles.categorization.stepper">
      <template v-for="(item, index) in categories" :key="`tab-${index}`">
        <div @click="selected = index">
          <button
            :class="[selected === index ? styles.categorization.selected : '']"
            :disabled="!item.isEnabled"
          >
            <span :class="styles.categorization.stepperBadge">{{
              index + 1
            }}</span>

            <label>{{ item.label }}</label>
          </button>
        </div>

        <hr
          v-if="index !== categories.length - 1"
          :class="styles.categorization.stepperLine"
        />
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

    <footer v-if="showNavButtons" :class="styles.categorization.stepperFooter">
      <div
        v-if="selected > 0"
        :class="styles.categorization.stepperButtonNext"
        @click="selected = selected - 1"
      >
        <button :disabled="!categories[selected - 1].isEnabled">
          {{ t('categorizationStepperBack', 'back') }}
        </button>
      </div>

      <div
        v-if="selected + 1 <= categories.length - 1"
        :class="styles.categorization.stepperButtonNext"
        @click="selected = selected + 1"
      >
        <button :disabled="!categories[selected + 1].isEnabled">
          {{ t('categorizationStepperNext', 'next') }}
        </button>
      </div>
    </footer>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import {
  isVisible,
  rankWith,
  createAjv,
  isEnabled,
  and,
  categorizationHasCategory,
  deriveLabelForUISchemaElement,
  optionIs,
  isCategorization,
} from '@jsonforms/core';
import type {
  JsonFormsRendererRegistryEntry,
  Layout,
  Categorization,
  UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  type RendererProps,
} from '@jsonforms/vue';
import { type CategoryItem, useTranslator, useVanillaLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'CategorizationStepperRenderer',
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const input = useVanillaLayout(useJsonFormsLayout(props));
    const showNavButtons = !!input.appliedOptions?.value.showNavButtons;

    return {
      ...input,
      showNavButtons,
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
        .map((category) => {
          return {
            element: category,
            isEnabled: isEnabled(category, data, path, this.ajv),
            label: deriveLabelForUISchemaElement(category, this.t),
          } as CategoryItem;
        });
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
