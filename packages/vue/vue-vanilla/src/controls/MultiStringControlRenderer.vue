<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <textarea
      :id="control.id + '-input'"
      :class="styles.control.textarea"
      :value="control.data"
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
  isStringControl,
  isMultiLineControl,
  and
} from '@jsonforms/core';
import { defineComponent } from '../../config/vue';
import { rendererProps, useJsonFormsControl } from '../../config/jsonforms';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVanillaControl } from '../util';

const controlRenderer: any = defineComponent({
  name: 'multi-string-control-renderer',
  components: {
    ControlWrapper
  },
  props: {
    ...rendererProps<ControlElement>()
  },
  setup(props) {
    return useVanillaControl(useJsonFormsControl(props));
  }
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, and(isStringControl, isMultiLineControl))
};
</script>
