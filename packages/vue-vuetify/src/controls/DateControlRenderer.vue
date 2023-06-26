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
      @focus="isFocused = true"
      @blur="isFocused = false"
      type="date"
    />
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  isDateControl,
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

const controlRenderer = defineComponent({
  name: 'date-control-renderer',
  components: {
    ControlWrapper,
    VTextField,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const adaptValue = (value: any) => value || undefined;
    const control = useVuetifyControl(useJsonFormsControl(props), adaptValue);
    return { ...control, adaptValue };
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isDateControl),
};
</script>
