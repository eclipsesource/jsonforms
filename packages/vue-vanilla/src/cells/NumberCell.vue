<template>
  <input
    :id="cell.id + '-input'"
    type="number"
    :step="step"
    :class="styles.control.input"
    :value="cell.data"
    :disabled="!cell.enabled"
    :autofocus="appliedOptions.focus"
    :placeholder="appliedOptions.placeholder"
    @change="onChange"
    @focus="isFocused = true"
    @blur="isFocused = false"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ControlElement, RankedTester } from '@jsonforms/core';
import { isNumberControl, rankWith } from '@jsonforms/core';
import { rendererProps, useJsonFormsCell } from '@jsonforms/vue';
import { useVanillaCell } from '../util';

const props = defineProps(rendererProps<ControlElement>());

const input = useVanillaCell(useJsonFormsCell(props), (target) =>
  target.value === '' ? undefined : Number(target.value)
);
const { styles, cell, appliedOptions, onChange, isFocused } = input;

const step = computed(() => {
  const options: any = appliedOptions;
  return options.step ?? 0.1;
});

defineOptions({
  tester: rankWith(1, isNumberControl) as RankedTester,
});
</script>
