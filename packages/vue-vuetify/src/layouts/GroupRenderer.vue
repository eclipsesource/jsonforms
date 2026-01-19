<template>
  <v-expansion-panels
    v-if="layout.visible"
    :class="classes"
    :elevation="!bare ? 2 : undefined"
    :outlined="bare"
    v-model="openedPanels"
    v-bind="vuetifyProps('v-expansion-panels')"
  >
    <v-expansion-panel>
      <v-expansion-panel-title
        :class="styles.group.label"
        v-bind="vuetifyProps('v-expansion-panel-title')"
        >{{ layout.label }}</v-expansion-panel-title
      >

      <v-expansion-panel-text
        v-bind="vuetifyProps(`v-expansion-panel-text[${index}]`)"
        v-for="(element, index) in (layout.uischema as Layout).elements"
        :key="`${layout.path}-${(layout.uischema as Layout).elements.length}-${index}`"
        :class="styles.group.item"
      >
        <dispatch-renderer
          :schema="layout.schema"
          :uischema="element"
          :path="layout.path"
          :enabled="layout.enabled"
          :renderers="layout.renderers"
          :cells="layout.cells"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { type Layout } from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent, ref } from 'vue';
import {
  VExpansionPanel,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VExpansionPanels,
} from 'vuetify/components';
import { useVuetifyLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'group-renderer',
  components: {
    DispatchRenderer,
    VExpansionPanel,
    VExpansionPanelText,
    VExpansionPanelTitle,
    VExpansionPanels,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const openedPanels = ref<number | number[]>(0);

    return { ...useVuetifyLayout(useJsonFormsLayout(props)), openedPanels };
  },
  computed: {
    bare(): boolean {
      return !!this.appliedOptions.bare;
    },
    alignLeft(): boolean {
      return !!this.appliedOptions.alignLeft;
    },
    classes(): string {
      const classes = ['my-1', 'pa-0', `${this.styles.group.root}`];
      if (this.bare) {
        classes.push(`${this.styles.group.bare}`);
      }
      if (this.alignLeft) {
        classes.push(`${this.styles.group.alignLeft}`);
      }
      return classes.join(' ');
    },
  },
});

export default layoutRenderer;
</script>

<!-- Default styles for the 'nested' feature -->
<style scoped>
.group.group-bare {
  border: 0;
}
.group-bare > .group-label,
.group-bare > .group-item {
  padding-right: 0;
}
.group-align-left > .group-label,
.group-align-left > .group-item {
  padding-left: 0;
}
</style>
