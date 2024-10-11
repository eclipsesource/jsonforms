<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-select
      v-if="appliedOptions.autocomplete === false"
      v-disabled-icon-focus
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
      :clearable="control.enabled"
      :model-value="control.data"
      :items="control.options"
      item-title="label"
      item-value="value"
      v-bind="vuetifyProps('v-select')"
      @update:model-value="onChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <v-autocomplete
      v-else
      v-disabled-icon-focus
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
      :clearable="control.enabled"
      :model-value="control.data"
      :items="control.options"
      item-title="label"
      item-value="value"
      v-bind="vuetifyProps('v-autocomplete')"
      @update:model-value="onChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
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
import { VAutocomplete, VSelect } from 'vuetify/components';
import { default as ControlWrapper } from '../controls/ControlWrapper.vue';
import { DisabledIconFocus } from '../controls/directives';
import { useVuetifyControl } from '../util';

const controlRenderer = defineComponent({
  name: 'autocomplete-oneof-enum-control-renderer',
  components: {
    ControlWrapper,
    VSelect,
    VAutocomplete,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(
      useJsonFormsOneOfEnumControl(props),
      (value) => (value !== null ? value : undefined),
      300,
    );
  },
});

export default controlRenderer;
</script>
