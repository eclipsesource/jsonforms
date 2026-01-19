<template>
  <div v-if="layout.visible" :class="styles.categorization.root">
    <v-stepper-vertical
      v-if="appliedOptions.vertical == true"
      non-linear
      v-model="activeCategory"
      editable
      flat
      v-bind="vuetifyProps('v-stepper-vertical')"
      :hide-actions="!appliedOptions.showNavButtons"
    >
      <v-stepper-vertical-item
        :title="visibleCategoryLabels[index]"
        v-for="(element, index) in visibleCategories"
        :value="index + 1"
        :key="`${layout.path}-${visibleCategories.length}-${index}`"
      >
        <dispatch-renderer
          :schema="layout.schema"
          :uischema="element.value.uischema"
          :path="layout.path"
          :enabled="layout.enabled"
          :renderers="layout.renderers"
          :cells="layout.cells"
        />
      </v-stepper-vertical-item>
    </v-stepper-vertical>
    <v-stepper
      v-else
      non-linear
      flat
      v-model="activeCategory"
      v-bind="vuetifyProps('v-stepper')"
    >
      <template v-slot:default="{ prev, next }">
        <v-stepper-header>
          <template
            v-for="(_, index) in visibleCategories"
            :key="`${layout.path}-${visibleCategories.length}-${index}`"
          >
            <v-stepper-item :value="index + 1" editable>
              {{ visibleCategoryLabels[index] }}
            </v-stepper-item>
            <v-divider
              v-if="index !== visibleCategories.length - 1"
              :key="`${layout.path}-divider-${visibleCategories.length}-${index}`"
            ></v-divider>
          </template>
        </v-stepper-header>

        <v-stepper-window class="ma-0">
          <v-stepper-window-item
            v-for="(element, index) in visibleCategories"
            :value="index + 1"
            :key="`${layout.path}-${visibleCategories.length}-${index}`"
          >
            <dispatch-renderer
              :schema="layout.schema"
              :uischema="element.value.uischema"
              :path="layout.path"
              :enabled="layout.enabled"
              :renderers="layout.renderers"
              :cells="layout.cells"
            />
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
