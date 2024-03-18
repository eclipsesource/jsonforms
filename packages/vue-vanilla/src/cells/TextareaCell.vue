<template>
  <textarea
    :id="cell.id + '-input'"
    :class="styles.control.textarea"
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
import {
  and,
  isMultiLineControl,
  isStringControl,
  rankWith,
} from '@jsonforms/core';
import { useVanillaCell } from '../util';

const props = defineProps(rendererProps<ControlElement>());

const input = useVanillaCell(
  useJsonFormsCell(props),
  (target) => target.value || undefined
);
const { styles, cell, appliedOptions, onChange, isFocused } = input;

defineOptions({
  tester: rankWith(2, and(isStringControl, isMultiLineControl)) as RankedTester,
});
</script>
