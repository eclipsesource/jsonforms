<template>
  <div v-if="layout.visible" :class="styles.categorization.root">
    <v-stepper
      v-if="appliedOptions.vertical == true"
      non-linear
      v-model="activeCategory"
      v-bind="vuetifyProps('v-stepper')"
    >
      <template v-for="(element, index) in visibleCategories">
        <v-stepper-step
          :key="`${layout.path}-${index}`"
          :step="index + 1"
          editable
        >
          {{ visibleCategoryLabels[index] }}
        </v-stepper-step>

        <v-stepper-content :key="`${layout.path}-${index}`" :step="index + 1">
          <v-card elevation="0">
            <dispatch-renderer
              :schema="layout.schema"
              :uischema="element"
              :path="layout.path"
              :enabled="layout.enabled"
              :renderers="layout.renderers"
              :cells="layout.cells"
            />

            <div v-if="!!appliedOptions.showNavButtons">
              <v-divider></v-divider>

              <v-card-actions>
                <v-btn
                  text
                  left
                  :disabled="activeCategory - 1 <= 0"
                  @click="activeCategory--"
                >
                  Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  right
                  color="primary"
                  :disabled="activeCategory - 1 >= visibleCategories.length - 1"
                  @click="activeCategory++"
                >
                  Next
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </v-stepper-content>
      </template>
    </v-stepper>
    <v-stepper
      v-else
      non-linear
      v-model="activeCategory"
      v-bind="vuetifyProps('v-stepper')"
    >
      <v-stepper-header>
        <template v-for="(_, index) in visibleCategories">
          <v-stepper-step
            :key="`${layout.path}-${index}`"
            :step="index + 1"
            editable
          >
            {{ visibleCategoryLabels[index] }}
          </v-stepper-step>
          <v-divider
            v-if="index !== visibleCategories.length - 1"
            :key="index"
          ></v-divider>
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content
          v-for="(element, index) in visibleCategories"
          :key="`${layout.path}-${index}`"
          :step="index + 1"
        >
          <v-card elevation="0">
            <dispatch-renderer
              :schema="layout.schema"
              :uischema="element"
              :path="layout.path"
              :enabled="layout.enabled"
              :renderers="layout.renderers"
              :cells="layout.cells"
            />

            <div v-if="!!appliedOptions.showNavButtons">
              <v-divider></v-divider>

              <v-card-actions>
                <v-btn
                  text
                  left
                  :disabled="activeCategory - 1 <= 0"
                  @click="activeCategory--"
                >
                  Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  right
                  color="primary"
                  :disabled="activeCategory - 1 >= visibleCategories.length - 1"
                  @click="activeCategory++"
                >
                  Next
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
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
  optionIs,
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
} from '@jsonforms/vue2';
import { useAjv, useTranslator, useVuetifyLayout } from '../util';
import {
  VStepper,
  VStepperHeader,
  VStepperStep,
  VDivider,
  VStepperItems,
  VStepperContent,
  VSpacer,
  VCard,
  VCardActions,
  VBtn,
} from 'vuetify/lib';

const layoutRenderer = defineComponent({
  name: 'categorization-stepper-renderer',
  components: {
    DispatchRenderer,
    VStepper,
    VStepperHeader,
    VStepperStep,
    VDivider,
    VSpacer,
    VStepperItems,
    VStepperContent,
    VCard,
    VCardActions,
    VBtn,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const activeCategory = ref(1);
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

export const categorizationStepperTester: Tester = and(
  uiTypeIs('Categorization'),
  categorizationHasCategory,
  optionIs('variant', 'stepper')
);

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(3, categorizationStepperTester),
};
</script>
