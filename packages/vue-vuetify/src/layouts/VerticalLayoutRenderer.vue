<template>
  <v-container
    v-if="layout.visible && (layout.uischema as Layout).elements.length > 0"
    fill-height
    fluid
    :class="`pa-0 ${styles.verticalLayout.root}`"
    v-bind="vuetifyProps('v-container')"
  >
    <v-row
      v-for="(element, index) in (layout.uischema as Layout).elements"
      :key="`${layout.path}-${(layout.uischema as Layout).elements.length}-${index}`"
      v-bind="vuetifyProps(`v-row[${index}]`)"
    >
      <v-col
        cols="12"
        v-if="isVisible(element, layout.path)"
        :class="styles.verticalLayout.item"
        v-bind="vuetifyProps('v-col')"
      >
        <dispatch-renderer
          :schema="layout.schema"
          :uischema="element"
          :path="layout.path"
          :enabled="layout.enabled"
          :renderers="layout.renderers"
          :cells="layout.cells"
        />
      </v-col>
    </v-row>
  </v-container>
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
import { defineComponent } from 'vue';
import { VCol, VContainer, VRow } from 'vuetify/components';
import { useJsonForms, useVuetifyLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'vertical-layout-renderer',
  components: {
    DispatchRenderer,
    VContainer,
    VRow,
    VCol,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const jsonforms = useJsonForms();
    return { ...useVuetifyLayout(useJsonFormsLayout(props)), jsonforms };
  },
  methods: {
    // helper method to check visibility and if not visible to remove the v-col since otherwise it will add extra padding
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
