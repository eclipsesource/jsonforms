<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-slider
      :step="control.schema.multipleOf || 1"
      :min="control.schema.minimum"
      :max="control.schema.maximum"
      :thumb-label="true"
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
      :model-value="control.data"
      v-bind="vuetifyProps('v-slider')"
      @update:model-value="onChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </control-wrapper>
</template>

<script lang="ts">
import { type ControlElement } from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  rendererProps,
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VSlider } from 'vuetify/components';

const controlRenderer = defineComponent({
  name: 'slider-control-renderer',
  components: {
    ControlWrapper,
    VSlider,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(useJsonFormsControl(props), (value) => {
      return Number(value);
    });
  },
});

export default controlRenderer;
</script>
