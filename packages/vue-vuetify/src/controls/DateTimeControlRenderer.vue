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
      :model-value="dataTime"
      @update:model-value="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      type="datetime-local"
    >
    </v-text-field>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  isDateTimeControl,
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

const toISOString = (inputDateTime: string) => {
  return inputDateTime === '' ? undefined : inputDateTime + ':00.000Z';
};

const controlRenderer = defineComponent({
  name: 'datetime-control-renderer',
  components: {
    ControlWrapper,
    VTextField,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const adaptValue = (value: any) => toISOString(value) || undefined;

    const control = useVuetifyControl(useJsonFormsControl(props), adaptValue);
    return { ...control, adaptValue };
  },
  computed: {
    dataTime(): string {
      return (this.control.data ?? '').substr(0, 16);
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isDateTimeControl),
};
</script>
