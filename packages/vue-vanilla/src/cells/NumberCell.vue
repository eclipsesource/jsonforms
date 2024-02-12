<template>
  <input
    :id="control.id + '-input'"
    type="number"
    :step="step"
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
  isNumberControl,
  type RankedTester,
  rankWith,
} from '@jsonforms/core';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { useVanillaControl } from '../util';
import { computed } from 'vue';

const props = defineProps(rendererProps<ControlElement>());

const input = useVanillaControl(useJsonFormsControl(props), (target) =>
  target.value === '' ? undefined : Number(target.value)
);
const { styles, control, appliedOptions, onChange, isFocused } = input;

const step = computed(() => {
  const options: any = appliedOptions;
  return options.step ?? 0.1;
});

defineOptions({
  tester: rankWith(1, isNumberControl) as RankedTester,
});
</script>
