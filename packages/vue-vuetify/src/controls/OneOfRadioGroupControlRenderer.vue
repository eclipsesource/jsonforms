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
      v-bind="vuetifyProps('v-radio-group')"
      :model-value="control.data"
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
import {
  rendererProps,
  useJsonFormsOneOfEnumControl,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VLabel, VRadio, VRadioGroup } from 'vuetify/components';
import { useVuetifyControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';

const controlRenderer = defineComponent({
  name: 'oneof-radio-group-control-renderer',
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
    return useVuetifyControl(useJsonFormsOneOfEnumControl(props));
  },
});

export default controlRenderer;
</script>
