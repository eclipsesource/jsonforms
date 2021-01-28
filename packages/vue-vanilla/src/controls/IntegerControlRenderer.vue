<template>
  <control-wrapper
    v-bind="control"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <input
      type="number"
      :step="1"
      :id="control.id + '-input'"
      :class="styles.control.input"
      :value="control.data"
      :disabled="!control.enabled"
      :autofocus="appliedOptions.focus"
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
  isIntegerControl
} from '@jsonforms/core';
import { defineComponent } from '../../config';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVanillaControl } from '../util';

const controlRenderer = defineComponent({
  name: 'integer-control-renderer',
  components: {
    ControlWrapper
  },
  props: {
    ...rendererProps<ControlElement>()
  },
  setup(props) {
    return useVanillaControl(useJsonFormsControl(props), target => parseInt(target.value, 10));
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, isIntegerControl)
};
</script>
