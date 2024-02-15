<template>
  <input
    :id="cell.id + '-input'"
    type="checkbox"
    :class="styles.control.input"
    :checked="!!cell.data"
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
import { isBooleanControl, rankWith } from '@jsonforms/core';
import { useJsonFormsCell } from '@jsonforms/vue';
import { useVanillaCell } from '../util';

const props = defineProps<CellProps>();

const input = useVanillaCell(
  useJsonFormsCell(props),
  (target) => target.checked
);
const { styles, cell, appliedOptions, onChange, isFocused } = input;

defineOptions({
  tester: rankWith(1, isBooleanControl) as RankedTester,
});
</script>
