<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-hover v-slot="{ isHovering }">
      <v-text-field
        ref="input"
        :step="step"
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
        :model-value="inputValue"
        :clearable="isHovering"
        v-bind="vuetifyProps('v-text-field')"
        @update:model-value="onInputChange"
        @focus="handleFocus"
        @blur="handleBlur"
      ></v-text-field>
    </v-hover>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isIntegerControl,
} from '@jsonforms/core';
import { defineComponent, ref, unref } from 'vue';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VHover, VTextField } from 'vuetify/components';

const NUMBER_REGEX_TEST = /^[+-]?\d+([.]\d+)?([eE][+-]?\d+)?$/;

const controlRenderer = defineComponent({
  name: 'integer-control-renderer',
  components: {
    ControlWrapper,
    VHover,
    VTextField,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const adaptValue = (value: any) =>
      typeof value === 'number' ? value : value || undefined;
    const input = useVuetifyControl(useJsonFormsControl(props), adaptValue);

    // preserve the value as it was typed by the user - for example when the user type very long number if we rely on the control.data to return back the actual data then the string could appear with exponent form and etc.
    // otherwise while typing the string in the input can suddenly change
    const inputValue = ref((unref(input.control).data as string) || '');
    return { ...input, adaptValue, inputValue };
  },
  computed: {
    step(): number {
      const options: any = this.appliedOptions;
      return options.step ?? 1;
    },
    allowUnsafeInteger(): boolean {
      return this.appliedOptions.allowUnsafeInteger;
    },
  },
  methods: {
    onInputChange(value: string): void {
      this.inputValue = value;
      this.onChange(this.toNumberOrString(value));
    },
    toNumberOrString(value: string): number | string {
      // have a regex test before parseFloat to make sure that invalid input won't be ignored and will lead to errors, parseFloat will parse invalid input such 7.22m6 as 7.22
      if (NUMBER_REGEX_TEST.test(value)) {
        const num = Number.parseFloat(value);
        if (
          Number.isFinite(num) &&
          (this.allowUnsafeInteger || Number.isSafeInteger(num))
        ) {
          // return the parsed number only if it is not NaN or Infinite and it is safe integer (no potential lost of precision otherwise the input will show one value while the data will have different value ) or allowUnsafeInteger options is true
          return num;
        }
      }
      return value;
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, isIntegerControl),
};
</script>
