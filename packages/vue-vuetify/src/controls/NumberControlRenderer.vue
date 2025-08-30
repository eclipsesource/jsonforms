<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-number-input
      v-disabled-icon-focus
      :step="step"
      :precision="precision"
      :id="control.id + '-input'"
      :class="styles.control.input"
      :disabled="!control.enabled"
      :autofocus="appliedOptions.focus"
      :placeholder="appliedOptions.placeholder"
      :label="computedLabel"
      :hint="control.description"
      :persistent-hint="persistentHint()"
      :required="control.required"
      :error-messages="control.errors"
      :model-value="value"
      :clearable="control.enabled"
      v-bind="vuetifyProps('v-number-input')"
      @update:model-value="onChange"
      @focus="handleFocus"
      @blur="handleBlur"
    ></v-number-input>
  </control-wrapper>
</template>

<script lang="ts">
import { type ControlElement } from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VNumberInput } from 'vuetify/components';

import { determineClearValue, useVuetifyControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const controlRenderer = defineComponent({
  name: 'number-control-renderer',
  components: {
    ControlWrapper,
    VNumberInput,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const clearValue = determineClearValue(0);
    const adaptValue = (value: any) => (value === null ? clearValue : value);
    const input = useVuetifyControl(useJsonFormsControl(props), adaptValue);

    return { ...input, adaptValue };
  },
  computed: {
    step(): number {
      const options: any = this.appliedOptions;
      return options.step ?? 0.1;
    },
    precision(): number | undefined {
      if (!this.step || Number.isInteger(this.step)) return undefined;
      // Handle scientific notation and float imprecision
      const stepStr = this.step.toString();
      if (stepStr.indexOf('e-') > -1) {
        // Handle cases like 1e-3
        return parseInt(stepStr.split('e-')[1], 10);
      }
      const fraction = stepStr.split('.')[1];
      return fraction ? fraction.length : undefined;
    },
    value(): number | null | undefined {
      if (
        typeof this.control.data === 'number' ||
        this.control.data == null ||
        this.control.data === undefined
      ) {
        return this.control.data;
      }
      return Number(this.control.data);
    },
  },
});

export default controlRenderer;
</script>
