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
      <v-radio
        v-for="o in control.options"
        v-bind="vuetifyProps(`v-radio[${o.value}]`)"
        :key="o.value"
        :label="o.label"
        :value="o.value"
      ></v-radio>
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
