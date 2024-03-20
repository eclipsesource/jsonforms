<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-text-field
      :type="passwordVisible ? 'text' : 'password'"
      :append-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="() => (passwordVisible = !passwordVisible)"
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
      :model-value="control.data"
      :maxlength="
        appliedOptions.restrict ? control.schema.maxLength : undefined
      "
      :size="
        appliedOptions.trim && control.schema.maxLength !== undefined
          ? control.schema.maxLength
          : undefined
      "
      v-bind="vuetifyProps('v-text-field')"
      @update:model-value="onChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isStringControl,
  and,
  formatIs,
} from '@jsonforms/core';
import { defineComponent, ref } from 'vue';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VTextField } from 'vuetify/components';

const controlRenderer = defineComponent({
  name: 'password-control-renderer',
  components: {
    ControlWrapper,
    VTextField,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const passwordVisible = ref(false);

    return {
      ...useVuetifyControl(
        useJsonFormsControl(props),
        (value) => value || undefined,
        300
      ),
      passwordVisible,
    };
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, and(isStringControl, formatIs('password'))),
};
</script>
