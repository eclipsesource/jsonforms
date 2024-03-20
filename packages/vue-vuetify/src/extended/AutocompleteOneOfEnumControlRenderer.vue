<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-hover v-slot="{ isHovering }">
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
        :clearable="isHovering"
        :model-value="control.data"
        :items="control.options"
        :item-title="(item) => t(item.label, item.label)"
        item-value="value"
        v-bind="vuetifyProps('v-select')"
        @change="onChange"
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
        :clearable="isHovering"
        :model-value="control.data"
        :items="control.options"
        :item-title="(item) => t(item.label, item.label)"
        item-value="value"
        v-bind="vuetifyProps('v-autocomplete')"
        @update:model-value="onChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </v-hover>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  isOneOfEnumControl,
  JsonFormsRendererRegistryEntry,
  rankWith,
} from '@jsonforms/core';
import {
  rendererProps,
  RendererProps,
  useJsonFormsOneOfEnumControl,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VAutocomplete, VHover, VSelect } from 'vuetify/components';
import { default as ControlWrapper } from '../controls/ControlWrapper.vue';
import { DisabledIconFocus } from '../controls/directives';
import { useTranslator, useVuetifyControl } from '../util';

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
    const t = useTranslator();

    const control = useVuetifyControl(
      useJsonFormsOneOfEnumControl(props),
      (value) => (value !== null ? value : undefined),
      300
    );
    return { ...control, t };
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(10, isOneOfEnumControl),
};
</script>
