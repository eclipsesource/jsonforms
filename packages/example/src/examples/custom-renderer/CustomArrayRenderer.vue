<template>
  <array-layout-renderer v-bind="$props">
    <template v-slot:toolbar-elements>{{ null }}</template>
    <template v-slot:actions="actionsProps">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn
            color="primary"
            rounded
            :aria-label="actionsProps.labels.add"
            v-on="onTooltip"
            :class="actionsProps.styles.arrayList.addButton"
            :disabled="actionsProps.addDisabled"
            @click="actionsProps.addClick"
          >
            <v-icon>mdi-plus</v-icon> {{ actionsProps.labels.add }}
          </v-btn>
        </template>
        {{ actionsProps.labels.add }}
      </v-tooltip>
    </template>
  </array-layout-renderer>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  withIncreasedRank,
} from '@jsonforms/core';
import { rendererProps } from '@jsonforms/vue2';
import {
  ArrayLayoutRenderer,
  arrayLayoutRendererEntry,
} from '@jsonforms/vue2-vuetify';
import { VTooltip, VIcon, VBtn } from 'vuetify/lib';
import { defineComponent } from 'vue';

const controlRenderer = defineComponent({
  name: 'custom-array-renderer',
  components: {
    ArrayLayoutRenderer,
    VTooltip,
    VIcon,
    VBtn,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: withIncreasedRank(1, arrayLayoutRendererEntry.tester),
};
</script>
