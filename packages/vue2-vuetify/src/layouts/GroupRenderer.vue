<template>
  <v-card
    v-if="layout.visible"
    :class="`pa-0 ${styles.group.root}`"
    elevation="2"
  >
    <v-card-title
      v-if="groupLayoutUiSchema.label"
      :class="styles.group.label"
      >{{ groupLayoutUiSchema.label }}</v-card-title
    >

    <v-card-text
      v-for="(element, index) in groupLayoutUiSchema.elements"
      :key="`${layout.path}-${index}`"
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
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  Layout,
  GroupLayout,
  rankWith,
  and,
  isLayout,
  uiTypeIs,
} from '@jsonforms/core';
import { defineComponent } from '../vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyLayout } from '../util';
import { VCard, VCardTitle, VCardText } from 'vuetify/lib';

const layoutRenderer = defineComponent({
  name: 'group-renderer',
  components: {
    DispatchRenderer,
    VCard,
    VCardTitle,
    VCardText,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return useVuetifyLayout(useJsonFormsLayout(props));
  },
  computed: {
    groupLayoutUiSchema(): GroupLayout {
      return this.layout.uischema as GroupLayout;
    },
  },
});

export default layoutRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, and(isLayout, uiTypeIs('Group'))),
};
</script>
