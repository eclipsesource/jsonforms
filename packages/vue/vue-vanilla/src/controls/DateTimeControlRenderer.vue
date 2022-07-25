<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <input
      type="datetime-local"
      :id="control.id + '-input'"
      :class="styles.control.input"
      :value="dataTime"
      :disabled="!control.enabled"
      :autofocus="appliedOptions.focus"
      :placeholder="appliedOptions.placeholder"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isDateTimeControl
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl, RendererProps } from '../../config/jsonforms';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVanillaControl } from '../util';

const toISOString = (inputDateTime: string) => {
  return inputDateTime === '' ? undefined : inputDateTime + ':00.000Z';
};

const controlRenderer = defineComponent({
  name: 'datetime-control-renderer',
  components: {
    ControlWrapper
  },
  props: {
    ...rendererProps<ControlElement>()
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaControl(useJsonFormsControl(props), target => toISOString(target.value));
  },
  computed: {
    dataTime(): string {
      return (this.control.data ?? '').substr(0, 16);
    }
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isDateTimeControl)
};
</script>
