<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-text-field
      type="date"
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
  isDateControl,
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

const JSON_SCHEMA_DATE_FORMATS = ['YYYY-MM-DD'];

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
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined,
      300
    );
  },
  computed: {
    dateFormat(): string {
      return typeof this.appliedOptions.dateFormat == 'string'
        ? this.appliedOptions.dateFormat
        : 'YYYY-MM-DD';
    },
    dateSaveFormat(): string {
      return typeof this.appliedOptions.dateSaveFormat == 'string'
        ? this.appliedOptions.dateSaveFormat
        : 'YYYY-MM-DD';
    },
    formats(): string[] {
      return [
        this.dateSaveFormat,
        this.dateFormat,
        ...JSON_SCHEMA_DATE_FORMATS,
      ];
    },
    inputValue(): string | undefined {
      const value = this.control.data;
      const date = parseDateTime(value, this.formats);
      return date ? date.format(this.dateFormat) : value;
    },
  },
  methods: {
    onInputChange(value: string): void {
      const date = parseDateTime(value, this.dateFormat);
      this.onChange(date ? date.format(this.dateSaveFormat) : value);
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isDateControl),
};
</script>
