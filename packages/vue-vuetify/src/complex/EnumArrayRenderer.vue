<template>
  <v-container fluid v-if="control.visible">
    <v-row>
      <v-col v-for="(o, index) in control.options" :key="o.value">
        <v-checkbox
          :label="o.label"
          :model-value="dataHasEnum(o.value)"
          :id="control.id + `-input-${index}`"
          :path="composePaths(control.path, `${index}`)"
          :error-messages="control.errors"
          :disabled="!control.enabled"
          :indeterminate="control.data === undefined"
          v-bind="vuetifyProps(`v-checkbox[${o.value}]`)"
          @update:model-value="() => toggle(o.value)"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { type ControlElement, composePaths } from '@jsonforms/core';
import { VCheckbox, VContainer, VRow, VCol } from 'vuetify/components';
import {
  rendererProps,
  type RendererProps,
  useJsonFormsMultiEnumControl,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { useVuetifyBasicControl } from '../util';

const controlRenderer = defineComponent({
  name: 'enum-array-renderer',
  components: {
    VCheckbox,
    VContainer,
    VRow,
    VCol,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyBasicControl(useJsonFormsMultiEnumControl(props));
  },
  methods: {
    dataHasEnum(value: any) {
      return !!this.control.data?.includes(value);
    },
    composePaths,
    toggle(value: any) {
      if (!this.dataHasEnum(value)) {
        this.addItem(this.control.path, value);
      } else {
        // mistyped in core
        this.removeItem?.(this.control.path, value);
      }
    },
  },
});

export default controlRenderer;
</script>
