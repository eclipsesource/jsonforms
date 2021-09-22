<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-hover v-slot="{ hover }">
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
        :clearable="hover"
        v-model="control.data"
        :items="control.options"
        item-text="label"
        item-value="value"
        @change="onChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
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
        :clearable="hover"
        v-model="control.data"
        :items="control.options"
        item-text="label"
        item-value="value"
        @change="onChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </v-hover>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isOneOfEnumControl,
} from '@jsonforms/core';
import { defineComponent } from '../vue';
import {
  rendererProps,
  useJsonFormsOneOfEnumControl,
  RendererProps,
} from '@jsonforms/vue2';
import { default as ControlWrapper } from '../controls/ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VSelect, VHover, VAutocomplete } from 'vuetify/lib';
import { DisabledIconFocus } from '../controls/directives';

const controlRenderer = defineComponent({
  name: 'autocomplete-oneof-enum-control-renderer',
  components: {
    ControlWrapper,
    VSelect,
    VAutocomplete,
    VHover,
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
      (value) => value || undefined
    );
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(10, isOneOfEnumControl),
};
</script>
