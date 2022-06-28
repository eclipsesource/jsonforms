<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-text-field
      type="datetime-local"
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
  isDateTimeControl,
} from '@jsonforms/core';
import { defineComponent } from '../vue';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl, parseDateTime } from '../util';
import { VTextField } from 'vuetify/lib';

const JSON_SCHEMA_DATE_TIME_FORMATS = [
  'YYYY-MM-DDTHH:mm:ss.SSSZ',
  'YYYY-MM-DDTHH:mm:ss.SSS',
  'YYYY-MM-DDTHH:mm:ssZ',
  'YYYY-MM-DDTHH:mm:ss',
];

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
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined,
      300
    );
  },
  computed: {
    dateTimeFormat(): string {
      return typeof this.appliedOptions.dateTimeFormat == 'string'
        ? this.appliedOptions.dateTimeFormat
        : 'YYYY-MM-DDTHH:mm';
    },
    dateTimeSaveFormat(): string {
      return typeof this.appliedOptions.dateTimeSaveFormat == 'string'
        ? this.appliedOptions.dateTimeSaveFormat
        : 'YYYY-MM-DDTHH:mm:ssZ';
    },
    formats(): string[] {
      return [
        this.dateTimeSaveFormat,
        this.dateTimeFormat,
        ...JSON_SCHEMA_DATE_TIME_FORMATS,
      ];
    },
    inputValue(): string | undefined {
      const value = this.control.data;
      const date = parseDateTime(value, this.formats);
      return date ? date.format(this.dateTimeFormat) : value;
    },
  },
  methods: {
    onInputChange(value: string): void {
      const date = parseDateTime(value, this.dateTimeFormat);
      this.onChange(date ? date.format(this.dateTimeSaveFormat) : value);
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isDateTimeControl),
};
</script>
