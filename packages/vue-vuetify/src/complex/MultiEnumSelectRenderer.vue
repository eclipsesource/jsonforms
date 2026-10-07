<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-select
      v-disabled-icon-focus
      :id="control.id + '-input'"
      :class="styles.control.input"
      :disabled="!control.enabled"
      :readonly="control.readonly"
      :autofocus="appliedOptions.focus"
      :placeholder="appliedOptions.placeholder"
      :label="computedLabel"
      :hint="control.description"
      :persistent-hint="persistentHint()"
      :required="control.required"
      :error-messages="control.errors"
      :clearable="clearable"
      :model-value="control.data"
      :items="control.options"
      item-title="label"
      item-value="value"
      multiple
      chips
      closable-chips
      v-bind="vuetifyProps('v-select')"
      @update:model-value="onChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <template v-slot:prepend v-if="$slots.prepend">
        <slot name="prepend" />
      </template>
      <template v-slot:append v-if="$slots.append">
        <slot name="append" />
      </template>
    </v-select>
  </control-wrapper>
</template>

<script lang="ts">
import { type ControlElement } from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsMultiEnumControl,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VSelect } from 'vuetify/components';
import { useVuetifyControl } from '../util';
import { default as ControlWrapper } from '../controls/ControlWrapper.vue';
import { DisabledIconFocus } from '../controls/directives';

const controlRenderer = defineComponent({
  name: 'multi-enum-select-renderer',
  components: {
    ControlWrapper,
    VSelect,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const control = useJsonFormsMultiEnumControl(props);
    const vuetifyControl = useVuetifyControl(control);

    return {
      ...vuetifyControl,
      onChange: (value: any[] | null) => {
        const sanitizedValue = value === null || value.length === 0 ? undefined : value;
        control.handleChange?.(control.control.value.path, sanitizedValue);
      }
    };
  },
});

export default controlRenderer;
</script>
