<template>
  <div v-if="layout.visible" :class="styles.categorization.root">
    <v-stepper-vertical
      v-if="appliedOptions.vertical == true"
      non-linear
      v-model="activeCategory"
      editable
      v-bind="vuetifyProps('v-stepper-vertical')"
      :hide-actions="!appliedOptions.showNavButtons"
    >
      <v-stepper-vertical-item
        v-for="entry in visibleCategoriesWithIndex"
        :title="entry.category.value.label"
        :value="entry.originalIndex + 1"
        :key="`${layout.path}-${entry.originalIndex}`"
      >
        <v-card elevation="0">
          <dispatch-renderer
            :schema="layout.schema"
            :uischema="entry.category.value.uischema"
            :path="layout.path"
            :enabled="layout.enabled"
            :renderers="layout.renderers"
            :cells="layout.cells"
          />
        </v-card>
      </v-stepper-vertical-item>
    </v-stepper-vertical>
    <v-stepper
      v-else
      non-linear
      v-model="activeCategory"
      v-bind="vuetifyProps('v-stepper')"
    >
      <template v-slot:default="{ prev, next }">
        <v-stepper-header>
          <template
            v-for="(entry, index) in visibleCategoriesWithIndex"
            :key="`${layout.path}-${entry.originalIndex}`"
          >
            <v-stepper-item :value="entry.originalIndex + 1" editable>
              {{ entry.category.value.label }}
            </v-stepper-item>
            <v-divider
              v-if="index < visibleCategoriesWithIndex.length - 1"
              :key="`${layout.path}-divider-${entry.originalIndex}`"
            ></v-divider>
          </template>
        </v-stepper-header>

        <v-stepper-window>
          <v-stepper-window-item
            v-for="entry in visibleCategoriesWithIndex"
            :value="entry.originalIndex + 1"
            :key="`${layout.path}-${entry.originalIndex}`"
          >
            <v-card elevation="0">
              <dispatch-renderer
                :schema="layout.schema"
                :uischema="entry.category.value.uischema"
                :path="layout.path"
                :enabled="layout.enabled"
                :renderers="layout.renderers"
                :cells="layout.cells"
              />
            </v-card>
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions
          v-if="appliedOptions.showNavButtons"
          @click:next="next"
          @click:prev="prev"
        ></v-stepper-actions>
      </template>
    </v-stepper>
  </div>
</template>

<script lang="ts">
import { type Layout } from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsCategorization,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent, ref } from 'vue';
import {
  VCard,
  VDivider,
  VStepper,
  VStepperActions,
  VStepperHeader,
  VStepperItem,
  VStepperWindow,
  VStepperWindowItem,
} from 'vuetify/components';
import {
  VStepperVertical,
  VStepperVerticalItem,
} from 'vuetify/labs/VStepperVertical';
import { useVuetifyLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'categorization-stepper-renderer',
  components: {
    DispatchRenderer,
    VStepperVertical,
    VStepperVerticalItem,
    VStepper,
    VStepperHeader,
    VStepperItem,
    VDivider,
    VStepperWindowItem,
    VStepperWindow,
    VStepperActions,
    VCard,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const activeCategory = ref(1);

    return {
      ...useVuetifyLayout(useJsonFormsCategorization(props)),
      activeCategory,
    };
  },
  computed: {
    visibleCategoriesWithIndex() {
      return this.categories
        .map((category, originalIndex) => ({
          category,
          originalIndex,
        }))
        .filter((e) => e.category.value.visible);
    },
  },
});

export default layoutRenderer;
</script>
