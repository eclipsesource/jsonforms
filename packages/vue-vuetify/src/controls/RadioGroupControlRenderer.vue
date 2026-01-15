<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-label :for="control.id + '-input'" v-bind="vuetifyProps('v-label')">{{
      computedLabel
    }}</v-label>
    <v-radio-group
      :id="control.id + '-input'"
      :class="styles.control.input"
      :disabled="!control.enabled"
      :readonly="control.readonly"
      :autofocus="appliedOptions.focus"
      :placeholder="appliedOptions.placeholder"
      :hint="control.description"
      :persistent-hint="persistentHint()"
      :required="control.required"
      :error-messages="control.errors"
      :model-value="control.data"
      v-bind="vuetifyProps('v-radio-group')"
      @update:model-value="onChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <template v-slot:prepend v-if="$slots.prepend">
        <slot name="prepend" />
      </template>
      <v-radio
        v-for="o in control.options"
        v-bind="vuetifyProps(`v-radio[${o.value}]`)"
        :key="o.value"
        :label="o.label"
        :value="o.value"
      ></v-radio>
      <template v-slot:append v-if="$slots.append">
        <slot name="append" />
      </template>
    </v-radio-group>
  </control-wrapper>
</template>

<script lang="ts">
import { type ControlElement } from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  rendererProps,
  useJsonFormsEnumControl,
  type RendererProps,
} from '@jsonforms/vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VRadioGroup, VRadio, VLabel } from 'vuetify/components';

const controlRenderer = defineComponent({
  name: 'radio-group-control-renderer',
  components: {
    ControlWrapper,
    VRadioGroup,
    VRadio,
    VLabel,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(useJsonFormsEnumControl(props));
  },
});

export default controlRenderer;
</script>
