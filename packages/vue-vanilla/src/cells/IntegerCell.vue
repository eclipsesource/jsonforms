<template>
  <input
    :id="control.id + '-input'"
    type="number"
    :step="1"
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
  isIntegerControl,
  type RankedTester,
  rankWith,
} from '@jsonforms/core';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { useVanillaControl } from '../util';

const props = defineProps(rendererProps<ControlElement>());

const input = useVanillaControl(useJsonFormsControl(props), (target) =>
  target.value === '' ? undefined : parseInt(target.value, 10)
);
const { styles, control, appliedOptions, onChange, isFocused } = input;

defineOptions({
  tester: rankWith(1, isIntegerControl) as RankedTester,
});
</script>
