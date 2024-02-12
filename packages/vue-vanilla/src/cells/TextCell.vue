<template>
  <input
    :id="control.id + '-input'"
    :class="styles.control.input"
    :value="control.data"
    :disabled="!control.enabled"
    :autofocus="appliedOptions.focus"
    :placeholder="appliedOptions.placeholder"
    @change="onChange"
    @focus="isFocused = true"
    @blur="isFocused = false"
  />
</template>

<script setup lang="ts">
import {
  ControlElement,
  isStringControl,
  type RankedTester,
  rankWith,
} from '@jsonforms/core';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { useVanillaControl } from '../util';

const props = defineProps(rendererProps<ControlElement>());

const input = useVanillaControl(
  useJsonFormsControl(props),
  (target) => target.value || undefined
);
const { styles, control, appliedOptions, onChange, isFocused } = input;

defineOptions({
  tester: rankWith(1, isStringControl) as RankedTester,
});
</script>
