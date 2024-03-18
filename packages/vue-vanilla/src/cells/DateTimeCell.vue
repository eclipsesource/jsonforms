<template>
  <input
    :id="cell.id + '-input'"
    v-model="dataTime"
    type="datetime-local"
    :class="styles.control.input"
    :disabled="!cell.enabled"
    :autofocus="appliedOptions.focus"
    :placeholder="appliedOptions.placeholder"
    @change="onChange"
    @focus="isFocused = true"
    @blur="isFocused = false"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { rendererProps, useJsonFormsCell } from '@jsonforms/vue';
import type { RankedTester, ControlElement } from '@jsonforms/core';
import { isDateTimeControl, rankWith } from '@jsonforms/core';
import { useVanillaCell } from '../util';

const props = defineProps(rendererProps<ControlElement>());

const input = useVanillaCell(useJsonFormsCell(props), (target) =>
  '' !== target.value ? toISO(target.value) : undefined
);
const { styles, cell, appliedOptions, onChange, isFocused } = input;

const fromISO = (str: string | undefined) => str?.slice(0, 16);
const toISO = (str: string) => str + ':00.000Z';

const dataTime = ref();
const setDateTime = (str: string | undefined) => {
  dataTime.value = fromISO(str);
};

setDateTime(input.cell.value.data);
watch(() => input.cell.value.data, setDateTime);

defineOptions({
  tester: rankWith(2, isDateTimeControl) as RankedTester,
});
</script>
