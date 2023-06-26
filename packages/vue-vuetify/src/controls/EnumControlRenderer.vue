<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-hover v-slot="{ isHovering }">
      <v-select
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
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </v-hover>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  isEnumControl,
  JsonFormsRendererRegistryEntry,
  rankWith,
} from '@jsonforms/core';
import {
  rendererProps,
  RendererProps,
  useJsonFormsEnumControl,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VHover, VSelect } from 'vuetify/components';
import { useTranslator, useVuetifyControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const controlRenderer = defineComponent({
  name: 'enum-control-renderer',
  components: {
    ControlWrapper,
    VSelect,
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

    const control = useVuetifyControl(useJsonFormsEnumControl(props), (value) =>
      value !== null ? value : undefined
    );

    return { ...control, t };
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isEnumControl),
};
</script>
