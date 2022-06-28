<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-text-field
      type="time"
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
      :value="inputValue"
      v-bind="vuetifyProps('v-text-field')"
      @input="onInputChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isTimeControl,
} from '@jsonforms/core';
import { defineComponent } from '../vue';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { parseDateTime, useVuetifyControl } from '../util';
import { VTextField } from 'vuetify/lib';

const JSON_SCHEMA_TIME_FORMATS = [
  'HH:mm:ss.SSSZ',
  'HH:mm:ss.SSS',
  'HH:mm:ssZ',
  'HH:mm:ss',
];

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
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined,
      300
    );
  },
  computed: {
    timeFormat(): string {
      return typeof this.appliedOptions.timeFormat == 'string'
        ? this.appliedOptions.timeFormat
        : 'HH:mm';
    },
    timeSaveFormat(): string {
      return typeof this.appliedOptions.timeSaveFormat == 'string'
        ? this.appliedOptions.timeSaveFormat
        : 'HH:mm:ss';
    },
    formats(): string[] {
      return [
        this.timeSaveFormat,
        this.timeFormat,
        ...JSON_SCHEMA_TIME_FORMATS,
      ];
    },
    inputValue(): string | undefined {
      const value = this.control.data;
      const time = parseDateTime(value, this.formats);
      return time ? time.format(this.timeFormat) : value;
    },
  },
  methods: {
    onInputChange(value: string): void {
      const time = parseDateTime(value, this.timeFormat);
      this.onChange(time ? time.format(this.timeSaveFormat) : value);
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isTimeControl),
};
</script>
