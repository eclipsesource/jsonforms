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
      :value="dataTime"
      v-bind="vuetifyProps('v-text-field')"
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
    return useVuetifyControl(useJsonFormsControl(props));
  },
  computed: {
    dataTime: {
      get(): string | null | undefined {
        const datetimeLocalFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
        const saveFormat = this.appliedOptions.dateTimeSaveFormat ?? undefined;
        const value = this.control.data as string | undefined | null;

        const dateTime = parseDateTime(value, saveFormat);
        return dateTime ? dateTime.local().format(datetimeLocalFormat) : value;
      },
      set(value: string) {
        const datetimeLocalFormats = [
          'YYYY-MM-DDTHH:mm:ss.SSS',
          'YYYY-MM-DDTHH:mm:ss',
          'YYYY-MM-DDTHH:mm',
        ];
        const saveFormat =
          this.appliedOptions.dateTimeSaveFormat ?? 'YYYY-MM-DDTHH:mm:ssZ';

        const dateTime = parseDateTime(value, datetimeLocalFormats);
        const result = dateTime ? dateTime.format(saveFormat) : value;

        this.onChange(result);
      },
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isDateTimeControl),
};
</script>
