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
        v-for="{ element, index } in visibleElementsWithIndex"
        :key="`${layout.path}-${visibleElementsWithIndex.length}-${index}`"
        :class="styles.group.item"
        v-bind="{
          ...vuetifyProps(`v-expansion-panel-text`),
          ...vuetifyProps(`v-expansion-panel-text[${index}]`),
        }"
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
import {
  getAjv,
  getConfig,
  getData,
  hasShowRule,
  isVisible,
  type Layout,
  type UISchemaElement,
} from '@jsonforms/core';
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
import { useJsonForms, useVuetifyLayout } from '../util';

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
    const jsonforms = useJsonForms();

    return {
      ...useVuetifyLayout(useJsonFormsLayout(props)),
      openedPanels,
      jsonforms,
    };
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
    visibleElementsWithIndex(): { element: UISchemaElement; index: number }[] {
      return this.layout.uischema.elements
        .map((element, index) => ({ element, index }))
        .filter(({ element }) => this.isVisible(element, this.layout.path));
    },
  },
  methods: {
    isVisible(uischema: UISchemaElement, path: string): boolean {
      if (hasShowRule(uischema)) {
        const state = { jsonforms: this.jsonforms };
        const rootData = getData(state);

        return isVisible(
          uischema,
          rootData,
          path,
          getAjv(state),
          getConfig(state),
        );
      }
      return true;
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
