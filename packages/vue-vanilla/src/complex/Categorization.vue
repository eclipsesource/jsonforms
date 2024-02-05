<template>
  <div :class="styles.categorization.root">
    <div
      :class="[
        isStepper
          ? styles.categorization.stepper
          : styles.categorization.category,
      ]"
    >
      <template v-for="(item, index) in categories" :key="`tab-${index}`">
        <div @click="selected = index">
          <button
            :class="[selected === index ? styles.categorization.selected : '']"
            :disabled="!item.isEnabled"
          >
            <span
              v-if="isStepper"
              :class="styles.categorization.stepperBadge"
              >{{ index + 1 }}</span
            >

            <label>{{ item.label }}</label>
          </button>
        </div>

        <hr
          v-if="isStepper && index !== categories.length - 1"
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
  uiTypeIs,
  deriveLabelForUISchemaElement,
} from '@jsonforms/core';
import type {
  JsonFormsRendererRegistryEntry,
  Layout,
  Category,
  Categorization,
  UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  type RendererProps,
} from '@jsonforms/vue';
import { useTranslator, useVanillaLayout } from '../util';

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
    const isStepper = 'stepper' === input.appliedOptions?.value.variant;
    const showNavButtons =
      isStepper && !!input.appliedOptions?.value.showNavButtons;

    return {
      ...input,
      isStepper,
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
    categories(): any {
      return (this.layout.uischema as Categorization).elements
        .filter((category: Category | Categorization) =>
          isVisible(category, this.layout.data, this.layout.path, this.ajv)
        )
        .map((category: Category | Categorization) => {
          return {
            element: category,
            isEnabled: isEnabled(
              category,
              this.layout.data,
              this.layout.path,
              this.ajv
            ),
            label: deriveLabelForUISchemaElement(category, this.t),
          };
        });
    },
  },
});

export default layoutRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(
    2,
    and(uiTypeIs('Categorization'), categorizationHasCategory)
  ),
};
</script>
