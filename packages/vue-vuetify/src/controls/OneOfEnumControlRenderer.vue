<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-select
      v-disabled-icon-focus
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
      :clearable="clearable"
      :model-value="control.data"
      :items="control.options"
      item-title="label"
      item-value="value"
      v-bind="vuetifyProps('v-select')"
      @update:model-value="onChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <template v-slot:prepend v-if="$slots.prepend">
        <slot name="prepend" />
      </template>
      <template v-slot:append v-if="$slots.append">
        <slot name="append" />
      </template>
    </v-select>
  </control-wrapper>
</template>

<script lang="ts">
import { type ControlElement } from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsOneOfEnumControl,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VSelect } from 'vuetify/components';
import { determineClearValue, useVuetifyControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const controlRenderer = defineComponent({
  name: 'oneof-enum-control-renderer',
  components: {
    ControlWrapper,
    VSelect,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const clearValue = determineClearValue('');

    return useVuetifyControl(useJsonFormsOneOfEnumControl(props), (value) =>
      value === null ? clearValue : value,
    );
  },
});

export default controlRenderer;
</script>
