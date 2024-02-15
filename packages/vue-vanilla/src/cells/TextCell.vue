<template>
  <input
    :id="cell.id + '-input'"
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
import type { CellProps, RankedTester } from '@jsonforms/core';
import { isStringControl, rankWith } from '@jsonforms/core';
import { useJsonFormsCell } from '@jsonforms/vue';
import { useVanillaCell } from '../util';

const props = defineProps<CellProps>();

const input = useVanillaCell(
  useJsonFormsCell(props),
  (target) => target.value || undefined
);
const { styles, cell, appliedOptions, onChange, isFocused } = input;

defineOptions({
  tester: rankWith(1, isStringControl) as RankedTester,
});
</script>
