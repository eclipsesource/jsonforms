<template>
  <input
    :id="cell.id + '-input'"
    type="number"
    :step="1"
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
import type { RankedTester, ControlElement } from '@jsonforms/core';
import { isIntegerControl, rankWith } from '@jsonforms/core';
import { rendererProps, useJsonFormsCell } from '@jsonforms/vue';
import { useVanillaCell } from '../util';

const props = defineProps(rendererProps<ControlElement>());

const input = useVanillaCell(useJsonFormsCell(props), (target) =>
  target.value === '' ? undefined : parseInt(target.value, 10)
);
const { styles, cell, appliedOptions, onChange, isFocused } = input;

defineOptions({
  tester: rankWith(1, isIntegerControl) as RankedTester,
});
</script>
