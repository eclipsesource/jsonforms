<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-text-field
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
      v-bind="vuetifyProps('v-text-field')"
      :model-value="control.data"
      @update:model-value="onChange"
      @focus="handleFocus"
      @blur="handleBlur"
      type="time"
    >
    </v-text-field>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  isTimeControl,
  JsonFormsRendererRegistryEntry,
  rankWith,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  rendererProps,
  RendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue';
import { VTextField } from 'vuetify/components';
import { useVuetifyControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';

/**
 * AJV 'time' format expects HH:mm:ss while <input type='time'> only returns HH:mm.
 * Therefore we append ':00' when the seconds are missing.
 */
const appendSecondsIfNecessary = (value: unknown) => {
  if (typeof value === 'string') {
    const splitValue = value.split(':');
    if (splitValue.length === 2) {
      splitValue.push('00');
    }
    return splitValue.join(':');
  }
  return value;
};

const controlRenderer = defineComponent({
  name: 'time-control-renderer',
  components: {
    ControlWrapper,
    VTextField,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const adaptValue = (value: any) =>
      appendSecondsIfNecessary(value) || undefined;
    const control = useVuetifyControl(useJsonFormsControl(props), adaptValue);
    return { ...control, adaptValue };
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isTimeControl),
};
</script>
