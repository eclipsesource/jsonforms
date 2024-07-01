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
import type { ControlElement, RankedTester } from '@jsonforms/core';
import { isBooleanControl, rankWith } from '@jsonforms/core';
import { rendererProps, useJsonFormsCell } from '@jsonforms/vue';
import { useVanillaCell } from '../util';

const props = defineProps(rendererProps<ControlElement>());

const input = useVanillaCell(
  useJsonFormsCell(props),
  (target) => target.checked
);
const { styles, cell, appliedOptions, onChange, isFocused } = input;

/**
 * JUST AN PROPOSAL!!!
 * @see https://github.com/eclipsesource/jsonforms/pull/2279#discussion_r1528101480
 */
defineOptions(
  ((): { tester: RankedTester } => {
    const tester: RankedTester = rankWith(1, isBooleanControl);
    return { tester };
  })()
);
</script>
