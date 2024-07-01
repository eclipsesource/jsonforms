<template>
  <input
    :id="cell.id + '-input'"
    type="time"
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
import { rendererProps, useJsonFormsCell } from '@jsonforms/vue';
import type { ControlElement, RankedTester } from '@jsonforms/core';
import { isTimeControl, rankWith } from '@jsonforms/core';
import { useVanillaCell } from '../util';

const props = defineProps(rendererProps<ControlElement>());

const input = useVanillaCell(useJsonFormsCell(props), (target) =>
  appendSeconds(target.value || undefined)
);
const { styles, cell, appliedOptions, onChange, isFocused } = input;

const appendSeconds = (value: string | undefined) =>
  value?.split(':').length === 2 ? value + ':00' : value;

defineOptions({
  tester: rankWith(2, isTimeControl) as RankedTester,
});
</script>
