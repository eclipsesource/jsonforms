<template>
  <select
    :id="cell.id + '-input'"
    :class="styles.control.select"
    :value="cell.data"
    :disabled="!cell.enabled"
    :autofocus="appliedOptions.focus"
    @change="onChange"
    @focus="isFocused = true"
    @blur="isFocused = false"
  >
    <option key="empty" value="" :class="styles.control.option" />
    <option
      v-for="optionElement in cell.options"
      :key="optionElement.value"
      :value="optionElement.value"
      :label="optionElement.label"
      :class="styles.control.option"
    ></option>
  </select>
</template>

<script setup lang="ts">
import { useJsonFormsOneOfEnumCell } from '@jsonforms/vue';
import type { CellProps, RankedTester } from '@jsonforms/core';
import { isOneOfEnumControl, rankWith } from '@jsonforms/core';
import { useVanillaCell } from '../util';

const props = defineProps<CellProps>();

const input = useVanillaCell(useJsonFormsOneOfEnumCell(props), (target) =>
  target.selectedIndex === 0 ? undefined : target.value
);
const { styles, cell, appliedOptions, onChange, isFocused } = input;

defineOptions({
  tester: rankWith(5, isOneOfEnumControl) as RankedTester,
});
</script>
